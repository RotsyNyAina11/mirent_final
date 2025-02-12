import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as dotenv from 'dotenv';
import { AuthService } from './auth.service';

dotenv.config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly authService: AuthService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET,
        });
    }

    async validate(payload: any) {
        const token = ExtractJwt.fromAuthHeaderAsBearerToken()(payload.req);
        if(await this.authService.isTokenBlacklisted(token)){
            throw new Error('Token has been invalidated');
        } 
        return { email: payload.email, id: payload.sub};
    }
}