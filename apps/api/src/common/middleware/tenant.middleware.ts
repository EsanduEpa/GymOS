import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PrismaService } from '../../prisma/prisma.service';

// Extend Express Request to include tenantId
declare global {
  namespace Express {
    interface Request {
      tenantId?: string;
    }
  }
}

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  private readonly logger = new Logger(TenantMiddleware.name);

  constructor(private readonly prisma: PrismaService) {}

  async use(req: Request, _res: Response, next: NextFunction): Promise<void> {
    // 1. Check x-tenant-id header
    const headerTenantId = req.headers['x-tenant-id'] as string;

    if (headerTenantId) {
      const tenant = await this.prisma.tenant.findUnique({
        where: { id: headerTenantId },
        select: { id: true, isActive: true },
      });

      if (tenant && tenant.isActive) {
        req.tenantId = tenant.id;
        next();
        return;
      }

      this.logger.warn(`Invalid or inactive tenant ID from header: ${headerTenantId}`);
    }

    // 2. Check subdomain
    const host = req.headers.host || '';
    const subdomain = host.split('.')[0];

    if (subdomain && subdomain !== 'www' && subdomain !== 'api' && subdomain !== 'localhost') {
      const tenant = await this.prisma.tenant.findUnique({
        where: { slug: subdomain },
        select: { id: true, isActive: true },
      });

      if (tenant && tenant.isActive) {
        req.tenantId = tenant.id;
        next();
        return;
      }
    }

    // 3. No tenant resolved — still proceed (some routes don't need tenant)
    next();
  }
}
