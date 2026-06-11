import { SetMetadata } from "@nestjs/common";
import { UserRole } from "../entities/user.entity";




// this server as unique indentifier for storing and retrieving role requirements as a metadata
export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);