import { Injectable } from '@nestjs/common';
import { ThrottlerException, ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class LoginThrottlerGuard extends ThrottlerGuard {
  protected async getTracker(req: Record<string, any>): Promise<string> {
    const email = req.body.email;
    return `login:${email}`;
  }

  // set limit to 5 attempt
  // protected getLimit(): Promise<number> {
  //     // set limit to 5 attempt
  //     return Promise.resolve(5);
  // }
  // // time window of 60 seconds
  // protected getTTL(): Promise<number> {
  //     // time window of 60 seconds
  //     return Promise.resolve(60000);
  // }
  protected async throwThrottlingException(): Promise<void> {
    throw new ThrottlerException(
      'Too many login attempts. Please try again later.',
    );
  }
}
