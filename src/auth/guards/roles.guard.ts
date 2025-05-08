// roles.guard.ts
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum'; 

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass()
        ]);

        if (!requiredRoles) {
            return true;
        }

        const request = context.switchToHttp().getRequest();

        if (!request.user) {
            console.error("No user found in request.");
            throw new ForbiddenException("User not found in request.");
        }

        if (!Array.isArray(request.user.roles)) {
           //console.error("User roles is missing or not an array:", request.user.roles);
            throw new ForbiddenException("User role is missing or not an array.");
        }

        return requiredRoles.some(role => request.user.roles.includes(role));
    }
}