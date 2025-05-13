import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt'
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private jwtService: JwtService,
    ){}

    async register(registerDto: RegisterDto): Promise<User>{
        const { email, password } = registerDto;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = this.usersRepository.create({
            email,
            password: hashedPassword,
        });
        return this.usersRepository.save(user);
    }

    async login(loginDto: LoginDto): Promise<{ access_token: string }> {
        const {email, password} =  loginDto;
        const user = await this.usersRepository.findOne({where:  { email }});
        if(!user || !(await bcrypt.compare(password, user.password))) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = { email: user.email, sub: user.id };
        return{
            access_token: this.jwtService.sign(payload),
        }
    }
}
