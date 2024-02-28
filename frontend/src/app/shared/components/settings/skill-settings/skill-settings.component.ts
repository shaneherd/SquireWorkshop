import {Component, Input, OnInit} from '@angular/core';
import {PlayerCharacter} from '../../../models/creatures/characters/player-character';
import {CharacterSettings} from '../../../models/creatures/characters/character-settings';
import * as _ from 'lodash';
import {MatCheckboxChange} from '@angular/material/checkbox';

@Component({
  selector: 'app-skill-settings',
  templateUrl: './skill-settings.component.html',
  styleUrls: ['./skill-settings.component.scss']
})
export class SkillSettingsComponent implements OnInit {
  @Input() playerCharacter: PlayerCharacter;
  @Input() settings: CharacterSettings;

  constructor() { }

  ngOnInit() {
    this.initializeSettings();
  }

  private initializeSettings(): void {
    this.settings.skills = _.cloneDeep(this.playerCharacter.characterSettings.skills);
  }

  displayPassive(event: MatCheckboxChange): void {
    this.settings.skills.displayPassive = event.checked;
  }

}
