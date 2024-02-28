import {Component, Input, OnInit} from '@angular/core';
import {CharacterSettings} from '../../../models/creatures/characters/character-settings';
import {PlayerCharacter} from '../../../models/creatures/characters/player-character';
import * as _ from 'lodash';
import {MatCheckboxChange} from '@angular/material/checkbox';

@Component({
  selector: 'app-health-settings',
  templateUrl: './health-settings.component.html',
  styleUrls: ['./health-settings.component.scss']
})
export class HealthSettingsComponent implements OnInit {
  @Input() playerCharacter: PlayerCharacter;
  @Input() settings: CharacterSettings;

  constructor() { }

  ngOnInit() {
    this.initializeSettings();
  }

  private initializeSettings(): void {
    this.settings.health = _.cloneDeep(this.playerCharacter.characterSettings.health);
  }

  showHitDice(event: MatCheckboxChange): void {
    this.settings.health.showHitDice = event.checked;
  }

  highlightValues(event: MatCheckboxChange): void {
    this.settings.health.highlightValues = event.checked;
  }

  flashLCD(event: MatCheckboxChange): void {
    this.settings.health.flashLCD = event.checked;
  }

  autoRollConcentrationChecks(event: MatCheckboxChange): void {
    this.settings.health.autoRollConcentrationChecks = event.checked;
  }

  postponeConcentrationChecks(event: MatCheckboxChange): void {
    this.settings.health.postponeConcentrationChecks = event.checked;
  }

  removeProneOnRevive(event: MatCheckboxChange): void {
    this.settings.health.removeProneOnRevive = event.checked;
  }

  dropItemsWhenDying(event: MatCheckboxChange): void {
    this.settings.health.dropItemsWhenDying = event.checked;
  }

}
