import {Component, Input, OnInit} from '@angular/core';
import {PlayerCharacter} from '../../../models/creatures/characters/player-character';
import {CharacterSettings} from '../../../models/creatures/characters/character-settings';
import * as _ from 'lodash';
import {MatCheckboxChange} from '@angular/material/checkbox';

@Component({
  selector: 'app-misc-settings',
  templateUrl: './misc-settings.component.html',
  styleUrls: ['./misc-settings.component.scss']
})
export class MiscSettingsComponent implements OnInit {
  @Input() playerCharacter: PlayerCharacter;
  @Input() settings: CharacterSettings;

  constructor() { }

  ngOnInit() {
    this.initializeSettings();
  }

  private initializeSettings(): void {
    this.settings.misc = _.cloneDeep(this.playerCharacter.characterSettings.misc);
  }

  maxColumnChange(input): void {
    this.settings.misc.maxColumns = parseInt(input.value, 10);
  }

  showHealthProgressBar(event: MatCheckboxChange): void {
    this.settings.misc.showHealthProgressBar = event.checked;
  }

  showLevelProgressBar(event: MatCheckboxChange): void {
    this.settings.misc.showLevelProgressBar = event.checked;
  }

  showCarryingProgressBar(event: MatCheckboxChange): void {
    this.settings.misc.showCarryingProgressBar = event.checked;
  }
}
