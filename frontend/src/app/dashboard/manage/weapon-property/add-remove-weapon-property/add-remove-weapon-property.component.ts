import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MenuItem} from '../../../../shared/models/menuItem.model';
import {WeaponProperty} from '../../../../shared/models/attributes/weapon-property';
import {WeaponPropertyService} from '../../../../core/services/attributes/weapon-property.service';

@Component({
  selector: 'app-add-remove-weapon-property',
  templateUrl: './add-remove-weapon-property.component.html',
  styleUrls: ['./add-remove-weapon-property.component.scss']
})
export class AddRemoveWeaponPropertyComponent implements OnInit {
  @Input() weaponProperty: MenuItem;
  @Output() save = new EventEmitter();
  @Output() cancel = new EventEmitter();

  loading = true;
  viewingWeaponProperty: WeaponProperty = null;

  constructor(
    private weaponPropertyService: WeaponPropertyService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.weaponPropertyService.getWeaponProperty(this.weaponProperty.id).then((weaponProperty: WeaponProperty) => {
      this.viewingWeaponProperty = weaponProperty;
      this.loading = false;
    });
  }

  close(): void {
    this.cancel.emit();
  }

  continue(): void {
    this.save.emit(this.weaponProperty);
  }
}
