import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MenuItem} from '../../../../shared/models/menuItem.model';
import {ArmorType} from '../../../../shared/models/attributes/armor-type';
import {ArmorTypeService} from '../../../../core/services/attributes/armor-type.service';

@Component({
  selector: 'app-add-remove-armor-type',
  templateUrl: './add-remove-armor-type.component.html',
  styleUrls: ['./add-remove-armor-type.component.scss']
})
export class AddRemoveArmorTypeComponent implements OnInit {
  @Input() armorType: MenuItem;
  @Output() save = new EventEmitter();
  @Output() cancel = new EventEmitter();

  loading = true;
  viewingArmorType: ArmorType = null;

  constructor(
    private armorTypeService: ArmorTypeService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.armorTypeService.getArmorType(this.armorType.id).then((armorType: ArmorType) => {
      this.viewingArmorType = armorType;
      this.loading = false;
    });
  }

  close(): void {
    this.cancel.emit();
  }

  continue(): void {
    this.save.emit(this.armorType);
  }
}
