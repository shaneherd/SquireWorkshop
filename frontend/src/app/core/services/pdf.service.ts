import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import {PlayerCharacter} from '../../shared/models/creatures/characters/player-character';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor() { }

  printCharacter(playerCharacter: PlayerCharacter): void {
    const doc = new jsPDF();

    doc.text('Hello world!', 10, 10);
    doc.save('a4.pdf');
  }
}
