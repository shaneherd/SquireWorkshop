import {Component, Input, OnInit} from '@angular/core';
import {PlayerCharacter} from '../../../models/creatures/characters/player-character';
import {CharacterSettings} from '../../../models/creatures/characters/character-settings';
import * as _ from 'lodash';
import {MatCheckboxChange} from '@angular/material/checkbox';

@Component({
  selector: 'app-quick-action-settings',
  templateUrl: './quick-action-settings.component.html',
  styleUrls: ['./quick-action-settings.component.scss']
})
export class QuickActionSettingsComponent implements OnInit {
  @Input() playerCharacter: PlayerCharacter;
  @Input() settings: CharacterSettings;

  constructor() { }

  ngOnInit() {
    this.initializeSettings();
  }

  private initializeSettings(): void {
    this.settings.quickActions = _.cloneDeep(this.playerCharacter.characterSettings.quickActions);
  }

  hideUnpreparedSpellsQuickAttacks(event: MatCheckboxChange): void {
    this.settings.quickActions.hideUnpreparedSpells = event.checked;
  }
}
