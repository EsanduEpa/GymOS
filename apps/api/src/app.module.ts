import { Module, MiddlewareConsumer, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { TenantModule } from './modules/tenant/tenant.module';
import { UserModule } from './modules/user/user.module';
import { MemberModule } from './modules/member/member.module';
import { MembershipModule } from './modules/membership/membership.module';
import { PaymentModule } from './modules/payment/payment.module';
import { ClassModule } from './modules/class/class.module';
import { BookingModule } from './modules/booking/booking.module';
import { WorkoutModule } from './modules/workout/workout.module';
import { NotificationModule } from './modules/notification/notification.module';
import { TenantMiddleware } from './common/middleware/tenant.middleware';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    PrismaModule,
    AuthModule,
    TenantModule,
    UserModule,
    MemberModule,
    MembershipModule,
    PaymentModule,
    ClassModule,
    BookingModule,
    WorkoutModule,
    NotificationModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TenantMiddleware)
      .exclude(
        { path: 'auth/(.*)', method: RequestMethod.ALL },
        { path: 'api/docs(.*)', method: RequestMethod.ALL },
      )
      .forRoutes('*');
  }
}
