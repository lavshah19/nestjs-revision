import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../decorators/roles.decorators";
import { UserRole } from "../entities/user.entity";




@Injectable()
export class RolesGuard implements CanActivate{

    // this reflator is utility that will help to access metadata
    constructor(private readonly reflector: Reflector){}

    canActivate(context: ExecutionContext): boolean {
        
        const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
            ROLES_KEY,
            [context.getHandler(), context.getClass()],
          );
          if (!requiredRoles) {
            return true;
          }
          const { user } = context.switchToHttp().getRequest();
          if(!user){
            throw new ForbiddenException('User not found');
          }
          const hasRequiredRole= requiredRoles.some((role) => user.role === role);
          if(!hasRequiredRole){
            throw new ForbiddenException('Access denied ok');
          }
          return true;
    }
        
    }
