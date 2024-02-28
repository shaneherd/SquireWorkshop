import {Component} from '@angular/core';
import {AttributeService} from '../../../../core/services/attributes/attribute.service';
import {LanguageService} from '../../../../core/services/attributes/language.service';
import {MenuItem} from '../../../../shared/models/menuItem.model';
import {ExportAttributeService} from '../../../../core/services/export/export-attribute.service';

@Component({
  selector: 'app-language-manage',
  templateUrl: './language-manage.component.html',
  styleUrls: ['./language-manage.component.scss']
})
export class LanguageManageComponent {
  selectedItem: MenuItem = null;

  constructor(
    public languageService: LanguageService,
    public attributeService: AttributeService,
    public exportService: ExportAttributeService) { }

  onItemClick(menuItem: MenuItem): void {
    this.selectedItem = menuItem;
  }

  updateSelected(menuItem: MenuItem): void {
    menuItem.selected = !menuItem.selected;
    this.selectedItem = null;
  }

  closeItem(): void {
    this.selectedItem = null;
  }

}
