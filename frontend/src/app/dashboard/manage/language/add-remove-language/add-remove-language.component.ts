import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MenuItem} from '../../../../shared/models/menuItem.model';
import {Language} from '../../../../shared/models/attributes/language';
import {LanguageService} from '../../../../core/services/attributes/language.service';

@Component({
  selector: 'app-add-remove-language',
  templateUrl: './add-remove-language.component.html',
  styleUrls: ['./add-remove-language.component.scss']
})
export class AddRemoveLanguageComponent implements OnInit {
  @Input() language: MenuItem;
  @Output() save = new EventEmitter();
  @Output() cancel = new EventEmitter();

  loading = true;
  viewingLanguage: Language = null;

  constructor(
    private languageService: LanguageService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.languageService.getLanguage(this.language.id).then((language: Language) => {
      this.viewingLanguage = language;
      this.loading = false;
    });
  }

  close(): void {
    this.cancel.emit();
  }

  continue(): void {
    this.save.emit(this.language);
  }
}
