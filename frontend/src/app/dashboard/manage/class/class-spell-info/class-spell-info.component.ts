import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ListObject} from '../../../../shared/models/list-object';
import {CharacterClass} from '../../../../shared/models/characteristics/character-class';
import {CharacteristicConfigurationCollection} from '../../../../shared/models/characteristics/characteristic-configuration-collection';
import {TranslateService} from '@ngx-translate/core';
import {MatCheckboxChange} from '@angular/material/checkbox';

@Component({
  selector: 'app-class-spell-info',
  templateUrl: './class-spell-info.component.html',
  styleUrls: ['./class-spell-info.component.scss']
})
export class ClassSpellInfoComponent implements OnInit {
  @Input() characterClass: CharacterClass;
  @Input() editing: boolean;
  @Input() loading: boolean;
  @Input() characteristicConfigurationCollection: CharacteristicConfigurationCollection;
  @Input() casterTypes: ListObject[];
  @Input() abilities: ListObject[];
  @Input() numToPrepareAbility: ListObject;
  @Input() isPublic = false;
  @Input() isShared = false;

  @Output() configListUpdated = new EventEmitter();

  noAbility: string;
  noCasterType: string;

  constructor(
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.noAbility = this.translate.instant('None');
    this.noCasterType = this.translate.instant('None');
  }

  spellcastingAbilityChange(value: string): void {
    this.characteristicConfigurationCollection.spellConfigurationCollection.spellcastingAbility = value;
  }

  casterTypeChange(value: string): void {
    this.characteristicConfigurationCollection.spellConfigurationCollection.casterType = value;
  }

  requiresPreparationChange(event: MatCheckboxChange): void {
    this.characterClass.classSpellPreparation.requirePreparation = event.checked;
  }

  getNumSpellsToPrepare(): string {
    const parts: string[] = [];
    if (this.characterClass.classSpellPreparation.numToPrepareAbilityModifier != null
      && this.characterClass.classSpellPreparation.numToPrepareAbilityModifier.id !== '0') {
      parts.push(this.characterClass.classSpellPreparation.numToPrepareAbilityModifier.name);
    }
    if (this.characterClass.classSpellPreparation.numToPrepareIncludeLevel) {
      parts.push(this.translate.instant('ClassLevel'));
    }
    if (this.characterClass.classSpellPreparation.numToPrepareIncludeHalfLevel) {
      parts.push(this.translate.instant('HalfClassLevel'));
    }
    if (this.characterClass.classSpellPreparation.numToPrepareMiscModifier > 0) {
      parts.push(this.characterClass.classSpellPreparation.numToPrepareMiscModifier.toString(10));
    }
    return parts.join(' + ');
  }

  prepareAbilityChange(value: string): void {
    const ability = this.getAbility(value);
    if (ability == null || ability.id === '0') {
      this.numToPrepareAbility.id = '0';
      this.numToPrepareAbility.name = '';
    } else {
      this.numToPrepareAbility.id = ability.id;
      this.numToPrepareAbility.name = ability.name;
    }
  }

  getAbility(id: string): ListObject {
    for (let i = 0; i < this.abilities.length; i++) {
      const ability: ListObject = this.abilities[i];
      if (ability.id === id) {
        return ability;
      }
    }
    return null;
  }

  getCasterType(id: string): ListObject {
    for (let i = 0; i < this.casterTypes.length; i++) {
      const casterType: ListObject = this.casterTypes[i];
      if (casterType.id === id) {
        return casterType;
      }
    }
    return null;
  }

  numToPrepareIncludeLevelChange(event: MatCheckboxChange): void {
    this.characterClass.classSpellPreparation.numToPrepareIncludeLevel = event.checked;
    if (event.checked) {
      this.characterClass.classSpellPreparation.numToPrepareIncludeHalfLevel = false;
    }
  }

  numToPrepareIncludeHalfLevelChange(event: MatCheckboxChange): void {
    this.characterClass.classSpellPreparation.numToPrepareIncludeHalfLevel = event.checked;
    if (event.checked) {
      this.characterClass.classSpellPreparation.numToPrepareIncludeLevel = false;
    }
  }

  numToPrepareMiscModifierChange(input): void {
    this.characterClass.classSpellPreparation.numToPrepareMiscModifier = input.value;
  }

  handleConfigListUpdated(): void {
    this.configListUpdated.emit();
  }

}
