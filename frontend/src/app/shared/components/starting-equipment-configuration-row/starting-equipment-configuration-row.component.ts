import {Component, EventEmitter, Input, Output} from '@angular/core';
import {StartingEquipmentType} from '../../models/startingEquipment/starting-equipment-type.enum';
import {ItemFilterService} from '../../../core/services/item-filter.service';
import {TranslateService} from '@ngx-translate/core';
import {StartingEquipmentItemGroupOptionItem} from '../../models/startingEquipment/starting-equipment-item-group-option-item';

@Component({
  selector: 'app-starting-equipment-configuration-row',
  templateUrl: './starting-equipment-configuration-row.component.html',
  styleUrls: ['./starting-equipment-configuration-row.component.scss']
})
export class StartingEquipmentConfigurationRowComponent {
  @Input() editing = false;
  @Input() loading = false;
  @Input() disabled = false;
  @Input() item: StartingEquipmentItemGroupOptionItem;

  @Output() delete = new EventEmitter<StartingEquipmentItemGroupOptionItem>();
  @Output() configure = new EventEmitter<StartingEquipmentItemGroupOptionItem>();

  constructor(
    private translate: TranslateService,
    private itemFilterService: ItemFilterService
  ) { }

  getDisplayMessage(): string {
    return this.item.quantity + ' ' + this.getName();
  }

  getName(): string {
    if (this.item.startingEquipmentType === StartingEquipmentType.ITEM) {
      return this.item.item.name;
    } else {
      return this.translate.instant('Labels.Filter') + this.itemFilterService.getFilterDisplay(this.item.filters);
    }
  }

  deleteItem(): void {
    if (!this.disabled && !this.item.inheritedFrom != null) {
      this.delete.emit(this.item);
    }
  }

  configureItem(): void {
    if (!this.disabled && !this.item.inheritedFrom != null) {
      this.configure.emit(this.item);
    }
  }

}
