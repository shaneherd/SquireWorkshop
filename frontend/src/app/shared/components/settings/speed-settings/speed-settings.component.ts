import {Component, Input, OnInit} from '@angular/core';
import {PlayerCharacter} from '../../../models/creatures/characters/player-character';
import {CharacterSettings} from '../../../models/creatures/characters/character-settings';
import * as _ from 'lodash';
import {SpeedType} from '../../../models/speed-type.enum';

@Component({
  selector: 'app-speed-settings',
  templateUrl: './speed-settings.component.html',
  styleUrls: ['./speed-settings.component.scss']
})
export class SpeedSettingsComponent implements OnInit {
  @Input() playerCharacter: PlayerCharacter;
  @Input() settings: CharacterSettings;

  configuringSpeeds: SpeedType[] = [];

  constructor() { }

  ngOnInit() {
    this.initializeSettings();
  }

  private initializeSettings(): void {
    this.settings.speed = _.cloneDeep(this.playerCharacter.characterSettings.speed);
    this.configuringSpeeds.push(SpeedType.CRAWL);
    this.configuringSpeeds.push(SpeedType.CLIMB);
    this.configuringSpeeds.push(SpeedType.SWIM);
  }
}
