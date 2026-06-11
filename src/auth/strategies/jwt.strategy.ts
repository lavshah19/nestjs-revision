import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthService } from "../auth.service";
import { ConfigService } from "@nestjs/config";

/**
 * JwtStrategy
 * ---------------------------------------
 * This strategy is responsible for validating
 * JWT access tokens in incoming requests.
 *
 * It integrates with Passport.js through NestJS
 * and runs automatically on protected routes
 * using JwtAuthGuard.
 *
 * ---------------------------------------
 * Why PassportStrategy(Strategy)?
 * ---------------------------------------
 * - `Strategy` comes from passport-jwt and contains
 *   the real JWT authentication logic (verify, decode, extract).
 *
 * - `PassportStrategy()` is a NestJS wrapper that:
 *   ✔ connects Passport strategy to Nest DI system
 *   ✔ registers the strategy automatically
 *   ✔ enables lifecycle hook `validate()`
 *
 * In simple terms:
 * Passport Strategy = authentication engine
 * Nest wrapper = connector between Passport and NestJS
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  
  /**
   * Constructor
   * ---------------------------------------
   * Injects required services and configures
   * how JWT tokens should be extracted and verified.
   */
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) {
    super({
      /**
       * Extract JWT from Authorization header:
       * Format: Authorization: Bearer <token>
       */
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      /**
       * Secret key used to verify JWT signature
       * (must match the key used during token generation)
       */
      secretOrKey: configService.getOrThrow<string>('JWT_ACCESS_SECRET'),

      /**
       * Ensures expired tokens are automatically rejected
       */
      ignoreExpiration: false,
    });
  }

  /**
   * validate()
   * ---------------------------------------
   * This function is called automatically by Passport
   * AFTER the JWT has been successfully verified.
   *
   * The payload is the decoded JWT body.
   *
   * Responsibilities:
   * - Extract user identifier from token (payload.sub)
   * - Fetch user from database
   * - Attach safe user object to request (req.user)
   *
   * @param payload - decoded JWT payload
   * @returns user object that will be attached to request
   */
  async validate(payload: any) {
    const user = await this.authService.getUserById(payload.sub);

    /**
     * If user does not exist, token is invalid
     * (even if JWT itself is valid)
     */
    if (!user) {
      throw new UnauthorizedException("Invalid token");
    }

    /**
     * Return only safe user data
     * This will be available in controllers as req.user
     */
    return {
      id: user.id,
      email: user.email,
      role: user.role
    };
  }
}