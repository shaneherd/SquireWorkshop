import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PlayerCharacter} from '../../../models/creatures/characters/player-character';
import {CharacterSettings} from '../../../models/creatures/characters/character-settings';
import {EventsService} from '../../../../core/services/events.service';
import {TranslateService} from '@ngx-translate/core';
import {CharacterService} from '../../../../core/services/creatures/character.service';
import * as _ from 'lodash';
import {EVENTS} from '../../../../constants';

@Component({
  selector: 'app-skill-settings-slide-in',
  templateUrl: './skill-settings-slide-in.component.html',
  styleUrls: ['./skill-settings-slide-in.component.scss']
})
export class SkillSettingsSlideInComponent implements OnInit {
  @Input() playerCharacter: PlayerCharacter;
  @Output() close = new EventEmitter();
  @Output() continue = new EventEmitter();

  settings: CharacterSettings = new CharacterSettings();

  constructor(
    private eventsService: EventsService,
    private translate: TranslateService,
    private characterService: CharacterService
  ) { }

  ngOnInit() {
    this.initializeSettings();
  }

  private initializeSettings(): void {
    this.settings = _.cloneDeep(this.playerCharacter.characterSettings);
  }

  continueClick(): void {
    const self = this;
    const settings = _.cloneDeep(this.playerCharacter.characterSettings);
    settings.skills = this.settings.skills;

    this.characterService.updateCharacterSettings(this.playerCharacter, settings).then(() => {
      this.playerCharacter.characterSettings.skills = settings.skills;
      this.eventsService.dispatchEvent(EVENTS.SettingsUpdated);
      self.continue.emit();
    });
  }

  cancelClick(): void {
    this.close.emit();
  }
}
