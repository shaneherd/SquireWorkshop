import {Component, Input, OnInit} from '@angular/core';
import {Weapon} from '../../../../shared/models/items/weapon';
import {WeaponRangeType} from '../../../../shared/models/items/weapon-range-type.enum';
import {WeaponTypeService} from '../../../../core/services/attributes/weapon-type.service';
import {ListObject} from '../../../../shared/models/list-object';
import {WeaponService} from '../../../../core/services/items/weapon.service';
import {WeaponPropertyConfigurationCollection} from '../../../../shared/models/items/weapon-property-configuration-collection';
import {DamageConfigurationCollection} from '../../../../shared/models/damage-configuration-collection';
import {WeaponPropertyConfiguration} from '../../../../shared/models/items/weapon-property-configuration';
import {WeaponType} from '../../../../shared/models/items/weapon-type';
import {SID} from '../../../../constants';
import {ItemService} from '../../../../core/services/items/item.service';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {ItemListObject} from '../../../../shared/models/items/item-list-object';

@Component({
  selector: 'app-weapon-info',
  templateUrl: './weapon-info.component.html',
  styleUrls: ['./weapon-info.component.scss']
})
export class WeaponInfoComponent implements OnInit {
  @Input() weapon: Weapon;
  @Input() propertyCollection: WeaponPropertyConfigurationCollection;
  @Input() damageCollection: DamageConfigurationCollection;
  @Input() editing: boolean;

  weaponTypes: ListObject[] = [];
  selectedWeaponType: ListObject;

  rangeTypes: WeaponRangeType[] = [];

  ammoTypes: ItemListObject[] = [];
  selectedAmmoType: ItemListObject;
  ammoId = SID.WEAPON_PROPERTIES.AMMUNITION;
  versatileId = SID.WEAPON_PROPERTIES.VERSATILE;
  thrownId = SID.WEAPON_PROPERTIES.THROWN;

  constructor(
    private weaponService: WeaponService,
    private weaponTypeService: WeaponTypeService,
    private itemService: ItemService
  ) { }

  ngOnInit() {
    this.initializeWeaponTypes();
    this.initializeRangeTypes();
    this.initializeAmmoTypes();
  }

  initializeWeaponTypes(): void {
    this.weaponTypeService.getWeaponTypes().then((weaponTypes: ListObject[]) => {
      this.weaponTypes = weaponTypes;
      this.initializedSelectedWeaponType();
    });
  }

  initializedSelectedWeaponType(): void {
    if (this.weapon.weaponType != null) {
      for (let i = 0; i < this.weaponTypes.length; i++) {
        const weaponType: ListObject = this.weaponTypes[i];
        if (this.weapon.weaponType.id === weaponType.id) {
          this.selectedWeaponType = weaponType;
          return;
        }
      }
    }

    if (this.weaponTypes.length > 0) {
      this.weaponTypeChange(this.weaponTypes[0]);
    }
  }

  weaponTypeChange(value: ListObject): void {
    this.selectedWeaponType = value;
    this.weapon.weaponType = new WeaponType();
    this.weapon.weaponType.id = value.id;
    this.weapon.weaponType.name = value.name;
  }

  initializeRangeTypes(): void {
    this.rangeTypes = [];
    this.rangeTypes.push(WeaponRangeType.MELEE);
    this.rangeTypes.push(WeaponRangeType.RANGED);
  }

  initializeAmmoTypes(): void {
    this.ammoTypes = [];
    this.itemService.getAmmos().then((ammoTypes: ItemListObject[]) => {
      this.ammoTypes = ammoTypes;
      this.initializeSelectedAmmoType();
    });
  }

  initializeSelectedAmmoType(): void {
    if (this.weapon.ammoType != null) {
      for (let i = 0; i < this.ammoTypes.length; i++) {
        const ammoType: ItemListObject = this.ammoTypes[i];
        if (this.weapon.ammoType.id === ammoType.id) {
          this.selectedAmmoType = ammoType;
          return;
        }
      }
    }

    if (this.editing && this.ammoTypes.length > 0) {
      this.ammoTypeChange(this.ammoTypes[0]);
    }
  }

  ammoTypeChange(value: ItemListObject): void {
    this.selectedAmmoType = value;
    this.weapon.ammoType = new ListObject(value.id, value.name, value.sid);
  }

  isRanged(): boolean {
    return this.weapon.rangeType === WeaponRangeType.RANGED;
  }

  rangeTypeChange(value: WeaponRangeType): void {
    this.weapon.rangeType = value;
  }

  normalRangeChange(input): void {
    this.weapon.normalRange = input.value;
  }

  longRangeChange(input): void {
    this.weapon.longRange = input.value;
  }

  attackModChange(input): void {
    this.weapon.attackMod = input.value;
  }

  propertyConfigChange(config: WeaponPropertyConfiguration, event: MatCheckboxChange): void {
    config.checked = event.checked;
  }
}
