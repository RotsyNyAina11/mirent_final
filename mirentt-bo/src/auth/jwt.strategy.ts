import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: 'lengla123',
        });
    }

    async validate(payload: any){
        const user = await this.usersRepository.findOne({ where: {id: payload.sub}});
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
};