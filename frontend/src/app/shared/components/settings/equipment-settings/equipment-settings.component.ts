import {Component, Input, OnInit} from '@angular/core';
import {PlayerCharacter} from '../../../models/creatures/characters/player-character';
import {CharacterSettings} from '../../../models/creatures/characters/character-settings';
import * as _ from 'lodash';
import {MatCheckboxChange} from '@angular/material/checkbox';

@Component({
  selector: 'app-equipment-settings',
  templateUrl: './equipment-settings.component.html',
  styleUrls: ['./equipment-settings.component.scss']
})
export class EquipmentSettingsComponent implements OnInit {
  @Input() playerCharacter: PlayerCharacter;
  @Input() settings: CharacterSettings;
  @Input() showHideEmptySlots = true;
  @Input() showUseEncumbrance = true;
  @Input() showCalculateCurrencyWeight = true;
  @Input() showAutoConvertCurrency = true;
  @Input() showAttackWithUnequipped = true;
  @Input() showAttuneLimit = true;
  @Input() showAttuneEnforce = true;

  constructor() { }

  ngOnInit() {
    this.initializeSettings();
  }

  private initializeSettings(): void {
    this.settings.equipment = _.cloneDeep(this.playerCharacter.characterSettings.equipment);
  }

  useEncumbrance(event: MatCheckboxChange): void {
    this.settings.equipment.useEncumbrance = event.checked;
  }

  calculateCurrencyWeight(event: MatCheckboxChange): void {
    this.settings.equipment.calculateCurrencyWeight = event.checked;
  }

  attackWithUnequipped(event: MatCheckboxChange): void {
    this.settings.equipment.attackWithUnequipped = event.checked;
  }

  enforceAttunedLimit(event: MatCheckboxChange): void {
    this.settings.equipment.enforceAttunedLimit = event.checked;
  }

  maxAttunedItemsChange(input): void {
    this.settings.equipment.maxAttunedItems = parseInt(input.value, 10);
  }

  autoConvertCurrency(event: MatCheckboxChange): void {
    this.settings.equipment.autoConvertCurrency = event.checked;
  }

  hideEmptySlots(event: MatCheckboxChange): void {
    this.settings.equipment.hideEmptySlots = event.checked;
  }
}
