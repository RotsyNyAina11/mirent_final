import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Utilisateur } from 'src/entities/utilisateur.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../config/jwt.constants';
import { JwtStrategy } from './jwt.strategy';
import { User } from './entities/user.entity';
import { TokenBlacklist } from './entities/token-blacklist.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Utilisateur, TokenBlacklist]),
    PassportModule.register({ defaultStrategy: 'jwt'}),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy]
})
export class AuthModule {}
