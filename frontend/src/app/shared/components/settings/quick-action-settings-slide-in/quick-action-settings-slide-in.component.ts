import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PlayerCharacter} from '../../../models/creatures/characters/player-character';
import {CharacterSettings} from '../../../models/creatures/characters/character-settings';
import {EventsService} from '../../../../core/services/events.service';
import {TranslateService} from '@ngx-translate/core';
import {CharacterService} from '../../../../core/services/creatures/character.service';
import {EVENTS} from '../../../../constants';
import * as _ from 'lodash';

@Component({
  selector: 'app-quick-action-settings-slide-in',
  templateUrl: './quick-action-settings-slide-in.component.html',
  styleUrls: ['./quick-action-settings-slide-in.component.scss']
})
export class QuickActionSettingsSlideInComponent implements OnInit {
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
    settings.quickActions = this.settings.quickActions;

    this.characterService.updateCharacterSettings(this.playerCharacter, settings).then(() => {
      this.playerCharacter.characterSettings.quickActions = settings.quickActions;
      this.eventsService.dispatchEvent(EVENTS.SettingsUpdated);
      self.continue.emit();
    });
  }

  cancelClick(): void {
    this.close.emit();
  }
}
