import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  // Service de base pour l'envoi d'emails
  // Les méthodes spécifiques peuvent être ajoutées selon les besoins
}
