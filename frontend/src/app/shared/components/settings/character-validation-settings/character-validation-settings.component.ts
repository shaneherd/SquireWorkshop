import {Component, Input, OnInit} from '@angular/core';
import {PlayerCharacter} from '../../../models/creatures/characters/player-character';
import {CharacterSettings} from '../../../models/creatures/characters/character-settings';
import * as _ from 'lodash';
import {MatCheckboxChange} from '@angular/material/checkbox';

@Component({
  selector: 'app-character-validation-settings',
  templateUrl: './character-validation-settings.component.html',
  styleUrls: ['./character-validation-settings.component.scss']
})
export class CharacterValidationSettingsComponent implements OnInit {
  @Input() playerCharacter: PlayerCharacter;
  @Input() settings: CharacterSettings;

  constructor() { }

  ngOnInit() {
    this.initializeSettings();
  }

  private initializeSettings(): void {
    this.settings.validation = _.cloneDeep(this.playerCharacter.characterSettings.validation);
  }

  allowFeatSelection(event: MatCheckboxChange): void {
    this.settings.validation.allowFeatSelection = event.checked;
  }

  asiFeatOneOnly(event: MatCheckboxChange): void {
    this.settings.validation.asiFeatOneOnly = event.checked;
  }

  autoIgnoreUnselectedFeatures(event: MatCheckboxChange): void {
    this.settings.validation.autoIgnoreUnselectedFeatures = event.checked;
  }

  autoIgnoreUnselectedSpells(event: MatCheckboxChange): void {
    this.settings.validation.autoIgnoreUnselectedSpells = event.checked;
  }

  autoIgnoreUnselectedAsi(event: MatCheckboxChange): void {
    this.settings.validation.autoIgnoreUnselectedAsi = event.checked;
  }

}
