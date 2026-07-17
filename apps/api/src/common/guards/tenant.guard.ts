import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';

@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const tenantId = request.tenantId;

    // Super admins can access any tenant
    if (user?.role === UserRole.SUPER_ADMIN) {
      return true;
    }

    // If no tenantId on request, deny
    if (!tenantId) {
      throw new ForbiddenException('Tenant context is required');
    }

    // Ensure user belongs to the requested tenant
    if (user?.tenantId && user.tenantId !== tenantId) {
      throw new ForbiddenException('Access denied to this tenant');
    }

    return true;
  }
}
