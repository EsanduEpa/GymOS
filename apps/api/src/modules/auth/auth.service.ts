import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserRole } from '@prisma/client';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto, tenantId?: string) {
    const effectiveTenantId = dto.tenantId || tenantId;

    // Check if user already exists within the same tenant
    const existingUser = await this.prisma.user.findFirst({
      where: {
        email: dto.email,
        tenantId: effectiveTenantId || null,
      },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const role = dto.role || UserRole.MEMBER;

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
        role,
        tenantId: effectiveTenantId,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        tenantId: true,
        createdAt: true,
      },
    });

    // If registering as a member, create member profile
    if (role === UserRole.MEMBER) {
      await this.prisma.member.create({
        data: { userId: user.id },
      });
    }

    // If registering as a trainer, create trainer profile
    if (role === UserRole.TRAINER) {
      await this.prisma.trainer.create({
        data: {
          userId: user.id,
          specializations: [],
          certifications: [],
        },
      });
    }

    const tokens = await this.generateTokens(user.id, user.email, user.role, user.tenantId);
    await this.storeRefreshToken(user.id, tokens.refreshToken);

    this.logger.log(`User registered: ${user.email} (${user.role})`);

    return {
      user,
      ...tokens,
    };
  }

  async login(dto: LoginDto, tenantId?: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        email: dto.email,
        ...(tenantId ? { tenantId } : {}),
      },
      select: {
        id: true,
        email: true,
        passwordHash: true,
        firstName: true,
        lastName: true,
        role: true,
        tenantId: true,
        isActive: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokens(user.id, user.email, user.role, user.tenantId);
    await this.storeRefreshToken(user.id, tokens.refreshToken);

    this.logger.log(`User logged in: ${user.email}`);

    const { passwordHash: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      ...tokens,
    };
  }

  async refreshToken(userId: string, refreshToken: string) {
    const storedToken = await this.prisma.refreshToken.findFirst({
      where: {
        userId,
        token: refreshToken,
        expiresAt: { gt: new Date() },
      },
    });

    if (!storedToken) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
        tenantId: true,
        isActive: true,
      },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('User not found or inactive');
    }

    // Delete old refresh token
    await this.prisma.refreshToken.delete({
      where: { id: storedToken.id },
    });

    // Generate new tokens
    const tokens = await this.generateTokens(user.id, user.email, user.role, user.tenantId);
    await this.storeRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async logout(userId: string, refreshToken?: string) {
    if (refreshToken) {
      await this.prisma.refreshToken.deleteMany({
        where: { userId, token: refreshToken },
      });
    } else {
      // Delete all refresh tokens for user
      await this.prisma.refreshToken.deleteMany({
        where: { userId },
      });
    }

    this.logger.log(`User logged out: ${userId}`);
    return { message: 'Logged out successfully' };
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatar: true,
        role: true,
        tenantId: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        memberProfile: {
          select: {
            id: true,
            dateOfBirth: true,
            gender: true,
            joinDate: true,
            subscription: {
              select: {
                id: true,
                status: true,
                startDate: true,
                endDate: true,
                plan: {
                  select: {
                    id: true,
                    name: true,
                    price: true,
                    currency: true,
                  },
                },
              },
            },
          },
        },
        trainerProfile: {
          select: {
            id: true,
            specializations: true,
            bio: true,
            certifications: true,
            rating: true,
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findFirst({
      where: { email },
    });

    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return null;
    }

    const { passwordHash: _, ...result } = user;
    return result;
  }

  private async generateTokens(
    userId: string,
    email: string,
    role: string,
    tenantId?: string | null,
  ) {
    const payload = {
      sub: userId,
      email,
      role,
      tenantId: tenantId || undefined,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('jwt.secret'),
        expiresIn: this.configService.get<string>('jwt.accessExpiresIn'),
      }),
      this.jwtService.signAsync(
        { sub: userId, email },
        {
          secret: this.configService.get<string>('jwt.refreshSecret'),
          expiresIn: this.configService.get<string>('jwt.refreshExpiresIn'),
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
      tokenType: 'Bearer',
    };
  }

  private async storeRefreshToken(userId: string, token: string) {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await this.prisma.refreshToken.create({
      data: {
        id: uuidv4(),
        userId,
        token,
        expiresAt,
      },
    });

    // Clean up expired tokens
    await this.prisma.refreshToken.deleteMany({
      where: {
        userId,
        expiresAt: { lt: new Date() },
      },
    });
  }
}
