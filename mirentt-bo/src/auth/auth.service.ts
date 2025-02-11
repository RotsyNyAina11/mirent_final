import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private  readonly jwtService: JwtService
    ) {}

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.usersService.findByEmail(email);

        if (user && (await bcrypt.compare(password, user.password))) {
            return { email: user.email};
        }
        throw new UnauthorizedException('Invalid credentials');
    }

    async login(email: string, password: string) {
        const user = await this.validateUser(email, password);
        const payload = { email: user.email };

        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
