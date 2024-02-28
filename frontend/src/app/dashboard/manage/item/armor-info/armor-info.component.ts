import {Component, Input, OnInit} from '@angular/core';
import {Armor} from '../../../../shared/models/items/armor';
import {EquipmentSlotType} from '../../../../shared/models/items/equipment-slot-type.enum';
import {ListObject} from '../../../../shared/models/list-object';
import {ArmorTypeService} from '../../../../core/services/attributes/armor-type.service';
import {ArmorType} from '../../../../shared/models/attributes/armor-type';
import {AbilityService} from '../../../../core/services/attributes/ability.service';
import {Ability} from '../../../../shared/models/attributes/ability.model';
import {TranslateService} from '@ngx-translate/core';
import {MatCheckboxChange} from '@angular/material/checkbox';

@Component({
  selector: 'app-armor-info',
  templateUrl: './armor-info.component.html',
  styleUrls: ['./armor-info.component.scss']
})
export class ArmorInfoComponent implements OnInit {
  @Input() armor: Armor;
  @Input() editing: boolean;

  selectedAbility: ListObject = new ListObject('0', '');
  abilities: ListObject[] = [];
  noAbility: string;
  slots: EquipmentSlotType[] = [];
  selectedArmorType: ListObject = new ListObject('0', '');
  armorTypes: ListObject[] = [];

  constructor(
    private abilityService: AbilityService,
    private armorTypeService: ArmorTypeService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.initializeArmorTypes();
    this.initializeAbilities();
    this.initializeSlots();
  }

  initializeArmorTypes(): void {
    this.armorTypeService.getArmorTypes().then((armorTypes: ListObject[]) => {
      this.armorTypes = armorTypes;
      this.initializeSelectedArmorType();
    });
  }

  initializeSelectedArmorType(): void {
    if (this.armor.armorType != null) {
      for (let i = 0; i < this.armorTypes.length; i++) {
        const armorType = this.armorTypes[i];
        if (armorType.id === this.armor.armorType.id) {
          this.selectedArmorType = armorType;
          return;
        }
      }
    }
    if (this.editing && this.armorTypes.length > 0) {
      this.armor.armorType = new ArmorType();
      this.armorTypeChange(this.armorTypes[0]);
    }
  }

  armorTypeChange(value: ListObject): void {
    this.selectedArmorType = value;
    this.armor.armorType.id = value.id;
    this.armor.armorType.name = value.name;
  }

  initializeAbilities(): void {
    this.noAbility = this.translate.instant('None');
    this.abilityService.getAbilities().then((abilities: ListObject[]) => {
      abilities = abilities.slice(0);
      const noAbility = new ListObject('0', '');
      abilities.unshift(noAbility);
      this.abilities = abilities;
      this.initializeSelectedAbility();
    });
  }

  initializeSelectedAbility(): void {
    if (this.armor.abilityModifier != null) {
      for (let i = 0; i < this.abilities.length; i++) {
        const ability = this.abilities[i];
        if (ability.id === this.armor.abilityModifier.id) {
          this.selectedAbility = ability;
          return;
        }
      }
    }
    if (this.abilities.length > 0) {
      this.armor.abilityModifier = new Ability();
      this.abilityChange(this.abilities[0]);
    }
  }

  abilityChange(value: ListObject): void {
    this.selectedAbility = value;
    this.armor.abilityModifier.id = value.id;
    this.armor.abilityModifier.name = value.name;
  }

  initializeSlots(): void {
    this.slots = [];
    this.slots.push(EquipmentSlotType.HAND);
    this.slots.push(EquipmentSlotType.BODY);
    this.slots.push(EquipmentSlotType.BACK);
    this.slots.push(EquipmentSlotType.NECK);
    this.slots.push(EquipmentSlotType.GLOVES);
    this.slots.push(EquipmentSlotType.FINGER);
    this.slots.push(EquipmentSlotType.HEAD);
    this.slots.push(EquipmentSlotType.WAIST);
    this.slots.push(EquipmentSlotType.FEET);
    this.slots.push(EquipmentSlotType.MOUNT);
    this.initializeSelectedSlot();
  }

  initializeSelectedSlot(): void {
    if (this.armor.slot == null) {
      this.armor.slot = this.slots[1]; //body
    }
  }

  slotChange(slot: EquipmentSlotType): void {
    this.armor.slot = slot;
  }

  acChange(input): void {
    this.armor.ac = input.value;
  }

  maxAbilityModifierChange(input): void {
    this.armor.maxAbilityModifier = input.value;
  }

  minStrengthChange(input): void {
    this.armor.minStrength = input.value;
  }

  stealthDisadvantageChange(event: MatCheckboxChange): void {
    this.armor.stealthDisadvantage = event.checked;
  }
}
