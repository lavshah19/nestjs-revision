import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({}),
    // passport module
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [AuthService,JwtStrategy,RolesGuard], // jwt strategy,role guard
  exports: [AuthService,RolesGuard], // roles guard
})
export class AuthModule {}
