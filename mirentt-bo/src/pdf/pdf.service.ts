import { Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class PdfService {
    // Service de base pour la génération de PDF
    // Les méthodes spécifiques peuvent être ajoutées selon les besoins
}