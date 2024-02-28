import {Component, Input} from '@angular/core';
import {Language} from '../../../../shared/models/attributes/language';

@Component({
  selector: 'app-language-details',
  templateUrl: './language-details.component.html',
  styleUrls: ['./language-details.component.scss']
})
export class LanguageDetailsComponent {
  @Input() language: Language;

  constructor() { }
}
