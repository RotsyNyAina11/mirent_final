import { Module } from '@nestjs/common';
import { UtilisateurService } from './utilisateur.service';
import { Utilisateur } from 'src/entities/utilisateur.entity';
import { UtilisateurController } from './utilisateur.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../config/jwt.constants';
import { InvalidatedTokenService } from './invalidated-token.service'; // Importez le nouveau service
import { InvalidatedToken } from '../entities/invalidated-token.entity'; // Importez la nouvelle entité
// PassportModule n'est plus nécessaire car on utilise la stratégie centralisée de auth

@Module({
  imports: [
    TypeOrmModule.forFeature([Utilisateur, InvalidatedToken]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60m' },
    }),
  ],
  controllers: [UtilisateurController],
  providers: [UtilisateurService, InvalidatedTokenService],
  exports: [UtilisateurService, JwtModule, InvalidatedTokenService],
})
export class UtilisateurModule {}
