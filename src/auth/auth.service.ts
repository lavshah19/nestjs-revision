import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from './entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existUser = await this.userRepository.findOneBy({
      email: registerDto.email,
    });
    if (existUser) {
      throw new ConflictException('User already exists');
    }
    const hashedPassword = await this.hashPassword(registerDto.password);
    const newlyCreatedUser = this.userRepository.create({
      ...registerDto,
      password: hashedPassword,
    });
    const savedUser = await this.userRepository.save(newlyCreatedUser);
    const { password, ...result } = savedUser;
    return {
      user: result,
      messge: 'User created successfully',
    };
  }
  async createAdmin(registerDto: RegisterDto) {
    const existUser = await this.userRepository.findOneBy({
      email: registerDto.email,
    });
    if (existUser) {
      throw new ConflictException('User already exists');
    }
    const hashedPassword = await this.hashPassword(registerDto.password);
    const newlyCreatedUser = this.userRepository.create({
      ...registerDto,
      password: hashedPassword,
      role: UserRole.ADMIN,
    });
    const savedUser = await this.userRepository.save(newlyCreatedUser);
    const { password, ...result } = savedUser;
    return {
      user: result,
      messge: 'User created successfully',
    };
  }
  async login(loginDto: LoginDto) {
const user = await this.userRepository
  .createQueryBuilder('user')
  .addSelect('user.password')
  .where('user.email = :email', { email: loginDto.email })
  .getOne();
    if (!user) {
      throw new ConflictException('invalid credentials');
    }
    const isPasswordValid = await this.comparePassword(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = this.generateTokens(user);
    const { password, ...result } = user;
    return {
      user: result,
      ...tokens,
      message: 'Login successful',
    };
  }

  async refreshTokens(refreshToken: string) {
    try {
      console.log(refreshToken);
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });
      const user = await this.userRepository.findOneBy({ id: payload.sub });
      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }
      const accesstokens = this.generateAccessTokens(user);
      const { password, ...result } = user;
      return {
        user: result,
        accesstokens,
        message: 'Login successful',
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  // get user by id
  async getUserById(id: number): Promise<Omit<User, 'password'>> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const { password, ...result } = user;
    return result;
  }
  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  private async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  private generateTokens(user: User) {
    return {
      accessToken: this.generateAccessTokens(user),
      refreshToken: this.generateRefreshToken(user),
    };
  }

  private generateAccessTokens(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'), // i will used env variable in future it just for revision purposes
      expiresIn: '15m',
    });
  }
  private generateRefreshToken(user: User) {
    const payload = { sub: user.id };

    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: '7d',
    });
  }
}
