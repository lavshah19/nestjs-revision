
import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";


// protected routes that required authentication

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}   