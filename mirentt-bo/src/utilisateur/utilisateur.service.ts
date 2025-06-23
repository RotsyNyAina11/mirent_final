import {
  BadRequestException,
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Utilisateur } from '../entities/utilisateur.entity';
import { CreateUserDto } from './create_utilisateur.dto';
import { LoginUserDto } from './create_Login.dto';
import { InvalidatedTokenService } from './invalidated-token.service';
@Injectable()
export class UtilisateurService {
  constructor(
    @InjectRepository(Utilisateur)
    private usersRepository: Repository<Utilisateur>,
    private jwtService: JwtService,
    private invalidatedTokenService: InvalidatedTokenService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<Utilisateur> {
    const { firstName, lastName, email, password, confirmPassword } =
      createUserDto;

    if (password !== confirmPassword) {
      throw new BadRequestException('Les mots de passe ne correspondent pas.');
    }

    const existingUser = await this.usersRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('Un utilisateur avec cet email existe déjà.');
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const newUser = this.usersRepository.create({
      firstName,
      lastName,
      email,
      passwordHash,
    });

    return this.usersRepository.save(newUser);
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user) {
      return null;
    }

    // Comparer le mot de passe fourni avec le hash stocké
    const isPasswordMatching = await bcrypt.compare(pass, user.passwordHash);

    if (isPasswordMatching) {
      // Retourne l'utilisateur sans le mot de passe hashé
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.validateUser(
      loginUserDto.email,
      loginUserDto.password,
    );

    if (!user) {
      throw new UnauthorizedException('Email ou mot de passe incorrect.');
    }

    // Générer un jeton JWT
    const payload = {
      email: user.email,
      sub: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }

  /**
   * Invalide un jeton JWT en l'ajoutant à la liste noire.
   * Cela rend le jeton inutilisable pour les requêtes futures.
   * @param token Le jeton JWT à déconnecter.
   * @returns Un message de confirmation de déconnexion.
   */
  async logout(token: string): Promise<{ message: string }> {
    try {
      // Décoder le token pour obtenir sa date d'expiration (exp)
      const decodedToken = this.jwtService.decode(token) as { exp?: number };

      if (!decodedToken || !decodedToken.exp) {
        throw new BadRequestException(
          "Jeton invalide ou sans date d'expiration.",
        );
      }

      // 'exp' est en secondes Unix (Epoch time). Convertir en millisecondes pour Date.
      const expirationDate = new Date(decodedToken.exp * 1000);

      // Si le token est déjà expiré, pas besoin de l'invalider.
      if (expirationDate <= new Date()) {
        return { message: 'Déconnexion réussie (jeton déjà expiré).' };
      }

      // Ajouter le token à la liste noire
      await this.invalidatedTokenService.invalidateToken(token, expirationDate);
      return { message: 'Déconnexion réussie.' };
    } catch (error) {
      console.error('Erreur lors de la déconnexion :', error);
      throw new BadRequestException('Impossible de déconnecter le jeton.');
    }
  }
}
