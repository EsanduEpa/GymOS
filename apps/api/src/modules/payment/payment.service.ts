import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as md5 from 'md5';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../../prisma/prisma.service';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';
import { PaymentStatus, SubscriptionStatus } from '@prisma/client';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async initiatePayment(dto: InitiatePaymentDto, tenantId: string, userId: string) {
    // Verify subscription exists and belongs to this tenant
    const subscription = await this.prisma.subscription.findFirst({
      where: {
        id: dto.subscriptionId,
        plan: { tenantId },
      },
      include: {
        plan: true,
        member: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
              },
            },
          },
        },
      },
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    const merchantId = this.configService.get<string>('payhere.merchantId') || '';
    const merchantSecret = this.configService.get<string>('payhere.merchantSecret') || '';
    const isSandbox = this.configService.get<boolean>('payhere.sandbox');
    const notifyUrl = this.configService.get<string>('payhere.notifyUrl');
    const returnUrl = this.configService.get<string>('payhere.returnUrl');
    const cancelUrl = this.configService.get<string>('payhere.cancelUrl');

    // Generate unique order ID
    const orderId = `GYMOS-${uuidv4().substring(0, 8).toUpperCase()}`;

    // Format amount to 2 decimal places
    const amount = dto.amount;
    const currency = dto.currency || 'LKR';
    const amountFormatted = amount.toFixed(2);

    // Generate PayHere hash
    // Formula: md5(merchant_id + order_id + amount_formatted + currency + md5(merchant_secret))
    const merchantSecretHash = md5(merchantSecret);
    const hash = md5(merchantId + orderId + amountFormatted + currency + merchantSecretHash)
      .toUpperCase();

    // Create payment record in DB
    const payment = await this.prisma.payment.create({
      data: {
        subscriptionId: dto.subscriptionId,
        amount: amount,
        currency,
        status: PaymentStatus.PENDING,
        payhereOrderId: orderId,
      },
    });

    const checkoutUrl = isSandbox
      ? 'https://sandbox.payhere.lk/pay/checkout'
      : 'https://www.payhere.lk/pay/checkout';

    // Build PayHere checkout form data
    const payhereData = {
      merchant_id: merchantId,
      return_url: returnUrl,
      cancel_url: cancelUrl,
      notify_url: notifyUrl,
      order_id: orderId,
      items: subscription.plan.name,
      currency,
      amount: amountFormatted,
      first_name: subscription.member.user.firstName,
      last_name: subscription.member.user.lastName,
      email: subscription.member.user.email,
      phone: subscription.member.user.phone || '',
      address: '',
      city: '',
      country: 'Sri Lanka',
      hash,
      checkout_url: checkoutUrl,
    };

    this.logger.log(`Payment initiated: ${orderId} for subscription ${dto.subscriptionId}`);

    return {
      paymentId: payment.id,
      orderId,
      checkoutUrl,
      formData: payhereData,
    };
  }

  async handleWebhook(body: Record<string, any>) {
    const {
      merchant_id,
      order_id,
      payhere_amount,
      payhere_currency,
      status_code,
      md5sig,
      payment_id: payherePaymentId,
      method: paymentMethod,
    } = body;

    this.logger.log(`Webhook received for order: ${order_id}, status: ${status_code}`);

    // Verify the webhook hash
    const merchantSecret = this.configService.get<string>('payhere.merchantSecret') || '';
    const merchantSecretHash = md5(merchantSecret);
    const localMd5sig = md5(
      merchant_id +
        order_id +
        payhere_amount +
        payhere_currency +
        status_code +
        merchantSecretHash,
    ).toUpperCase();

    if (localMd5sig !== md5sig.toUpperCase()) {
      this.logger.error(`Webhook hash verification failed for order: ${order_id}`);
      throw new BadRequestException('Invalid webhook signature');
    }

    // Find the payment by order ID
    const payment = await this.prisma.payment.findUnique({
      where: { payhereOrderId: order_id },
      include: {
        subscription: true,
      },
    });

    if (!payment) {
      this.logger.error(`Payment not found for order: ${order_id}`);
      throw new NotFoundException('Payment not found');
    }

    // PayHere status codes: 2 = success, 0 = pending, -1 = canceled, -2 = failed, -3 = charged back
    const statusCode = parseInt(status_code, 10);
    let paymentStatus: PaymentStatus;

    switch (statusCode) {
      case 2:
        paymentStatus = PaymentStatus.COMPLETED;
        break;
      case 0:
        paymentStatus = PaymentStatus.PENDING;
        break;
      case -1:
      case -2:
        paymentStatus = PaymentStatus.FAILED;
        break;
      case -3:
        paymentStatus = PaymentStatus.REFUNDED;
        break;
      default:
        paymentStatus = PaymentStatus.FAILED;
    }

    // Update payment status
    await this.prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: paymentStatus,
        paymentMethod: paymentMethod || null,
        paidAt: paymentStatus === PaymentStatus.COMPLETED ? new Date() : null,
      },
    });

    // If payment is successful, activate the subscription
    if (paymentStatus === PaymentStatus.COMPLETED) {
      await this.prisma.subscription.update({
        where: { id: payment.subscriptionId },
        data: { status: SubscriptionStatus.ACTIVE },
      });
      this.logger.log(`Payment completed and subscription activated: ${payment.subscriptionId}`);
    }

    // If payment failed, mark subscription as expired if no other successful payments
    if (paymentStatus === PaymentStatus.FAILED) {
      this.logger.warn(`Payment failed for order: ${order_id}`);
    }

    return { status: 'OK' };
  }

  async findAll(tenantId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [payments, total] = await Promise.all([
      this.prisma.payment.findMany({
        where: {
          subscription: {
            plan: { tenantId },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          subscription: {
            include: {
              plan: {
                select: { id: true, name: true },
              },
              member: {
                include: {
                  user: {
                    select: {
                      id: true,
                      email: true,
                      firstName: true,
                      lastName: true,
                    },
                  },
                },
              },
            },
          },
        },
      }),
      this.prisma.payment.count({
        where: {
          subscription: {
            plan: { tenantId },
          },
        },
      }),
    ]);

    return {
      data: payments,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, tenantId: string) {
    const payment = await this.prisma.payment.findFirst({
      where: {
        id,
        subscription: {
          plan: { tenantId },
        },
      },
      include: {
        subscription: {
          include: {
            plan: true,
            member: {
              include: {
                user: {
                  select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    phone: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }
}
