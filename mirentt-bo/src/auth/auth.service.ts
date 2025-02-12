import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { BlacklistedToken } from 'src/entities/blacklisted-token.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(BlacklistedToken)
        private readonly blacklistedTokenRepository: Repository<BlacklistedToken>,
        private readonly jwtService: JwtService
    ) {}


    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.userRepository.findOne({ where: { email } });
        if (user && (await bcrypt.compare(password, user.password))) {
          const { password, ...result } = user;
          return result;
        }
        throw new UnauthorizedException('Invalid credentials');
      }

    async login(user: any) {
        const payload = { email: user.email, sub: user.id };
        return {
          access_token: this.jwtService.sign(payload),
        };
    }

    async registerUser(user: User): Promise<User> {
        const existingUser = await this.userRepository.findOne({ where: { email: user.email } });
        if (existingUser) {
            throw new Error('Email already in use');
        }

        
        user.password = await bcrypt.hash(user.password, 10);
        return this.userRepository.save(user);
    }

    async logout(token: string): Promise<void> {
        // Verification de token s'il existe dejà dans la blacklist
        const existinToken = await this.blacklistedTokenRepository.findOne({ where: { token } });
        if(existinToken) {
            throw new UnauthorizedException('Token already blacklisted');
        }

        // Ajout du token dans la blacklist
        const blacklistedToken = new BlacklistedToken();
        blacklistedToken.token = token;
        await this.blacklistedTokenRepository.save(blacklistedToken);
    }

    async isTokenBlacklisted(token: string): Promise<boolean> {
      const blacklistedToken = await this.blacklistedTokenRepository.findOne({ where: { token } });
      return !!blacklistedToken;
    }
}
