import {Component} from '@angular/core';
import {LanguageService} from '../../../../core/services/attributes/language.service';

@Component({
  selector: 'app-language-list',
  templateUrl: './language-list.component.html',
  styleUrls: ['./language-list.component.scss']
})
export class LanguageListComponent {
  loading = true;

  constructor(
    public languageService: LanguageService
  ) { }
}
