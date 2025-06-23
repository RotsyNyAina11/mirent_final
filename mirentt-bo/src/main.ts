import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './filters/all-eceptionfilters';
import 'reflect-metadata';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as express from 'express';
import * as cors from 'cors';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useLogger(new Logger());

  // Activer CORS pour tout le backend
  app.use(
    cors({
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Supprime les propriétés inconnues
      forbidNonWhitelisted: true, // Renvoie une erreur si des propriétés inconnues sont présentes
      transform: true, // <--- DÉCOMMENTEZ ET ACTIVEZ CETTE LIGNE
      disableErrorMessages: false, // <--- AJOUTEZ CETTE LIGNE : Permet d'obtenir des messages d'erreur détaillés
    }),
  );

  // Middleware pour ajouter les en-têtes CORS aux fichiers statiques
  app.use('/uploads', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Methods',
      'GET,HEAD,PUT,PATCH,POST,DELETE',
    );
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });

  // Gérer les fichiers statiques avec Express
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  // Ajout de la validation globale pour sécuriser les entrées
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      //transform: true,
    }),
  );

  const PORT = process.env.PORT || 3000;
  const logger = new Logger('Main');
  app.useGlobalFilters(new AllExceptionsFilter());
  app.enableCors();

  await app.listen(PORT);
  Logger.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
}

bootstrap();
