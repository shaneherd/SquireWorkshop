import {Component, Input, OnInit} from '@angular/core';
import {PlayerCharacter} from '../../../models/creatures/characters/player-character';
import {CharacterSettings} from '../../../models/creatures/characters/character-settings';
import * as _ from 'lodash';
import {MatCheckboxChange} from '@angular/material/checkbox';

@Component({
  selector: 'app-feature-settings',
  templateUrl: './feature-settings.component.html',
  styleUrls: ['./feature-settings.component.scss']
})
export class FeatureSettingsComponent implements OnInit {
  @Input() playerCharacter: PlayerCharacter;
  @Input() settings: CharacterSettings;

  constructor() { }

  ngOnInit() {
    this.initializeSettings();
  }

  private initializeSettings(): void {
    this.settings.features = _.cloneDeep(this.playerCharacter.characterSettings.features);
  }

  displayTags(event: MatCheckboxChange): void {
    this.settings.features.displayTags = event.checked;
  }

  highlightActive(event: MatCheckboxChange): void {
    this.settings.features.highlightActive = event.checked;
  }

  highlightNonActive(event: MatCheckboxChange): void {
    this.settings.features.highlightNonActive = event.checked;
  }

}
