import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { AuthController } from './auth.controller';
import { BlacklistedToken } from 'src/entities/blacklisted-token.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, BlacklistedToken]),
    JwtModule.register({
      secret: '3c0dbbe3a452ebfa4906f0d27a3d718fc8d458f49661d3ca303ffeebdcbe5540be1be1316448ada3b71dc7f33398a24cdbd89a65de3c7297ef3cbd6802ca1fc27ab9236ce363b8d016a1ae3c05a4cecf8d4bfe5dee2385a0fc98ea4c953d4cd2',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService], 
  exports: [AuthService],
})
export class AuthModule {}
