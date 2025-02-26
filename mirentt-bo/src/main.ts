import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import 'reflect-metadata';
import * as dotenv from 'dotenv';

dotenv.config(); // Charge les variables d'environnement

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap'); // Création du logger

  // Activer CORS pour permettre les requêtes frontend
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173', // URL du frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Ajout de la validation globale pour sécuriser les entrées
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Supprime les champs non définis dans le DTO
      forbidNonWhitelisted: true, // Rejette les requêtes avec des champs non autorisés
      transform: true, // Transforme les types en ceux définis dans le DTO
    }),
  );

  const PORT = process.env.PORT || 3000; // Utilisation de la variable d'environnement pour le port

  await app.listen(PORT);
  logger.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
}

bootstrap();
