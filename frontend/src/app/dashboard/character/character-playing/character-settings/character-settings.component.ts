import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PlayerCharacter} from '../../../../shared/models/creatures/characters/player-character';
import {EventsService} from '../../../../core/services/events.service';
import {TranslateService} from '@ngx-translate/core';
import {CharacterService} from '../../../../core/services/creatures/character.service';
import {CharacterSettings} from '../../../../shared/models/creatures/characters/character-settings';
import {EVENTS} from '../../../../constants';
import * as _ from 'lodash';

@Component({
  selector: 'app-character-settings',
  templateUrl: './character-settings.component.html',
  styleUrls: ['./character-settings.component.scss']
})
export class CharacterSettingsComponent implements OnInit {
  loading = false;
  @Input() playerCharacter: PlayerCharacter;
  @Output() close = new EventEmitter();
  @Output() continue = new EventEmitter();

  settings: CharacterSettings = new CharacterSettings();
  character: PlayerCharacter = new PlayerCharacter();

  constructor(
    private eventsService: EventsService,
    private translate: TranslateService,
    private characterService: CharacterService
  ) { }

  ngOnInit() {
    this.initializeSettings();
  }

  private initializeSettings(): void {
    this.settings = new CharacterSettings();
    this.settings.restrictToTwenty = this.playerCharacter.characterSettings.restrictToTwenty;
    this.settings.pages = this.playerCharacter.characterSettings.pages;
    this.character = _.cloneDeep(this.playerCharacter);
  }

  continueClick(): void {
    const self = this;
    const promises: Promise<any>[] = [];
    promises.push(this.characterService.updateCharacterSettings(this.playerCharacter, this.settings));
    promises.push(this.characterService.updateChosenClassesSpellcasting(this.character, this.character.classes));
    Promise.all(promises).then(() => {
      this.playerCharacter.classes = this.character.classes;
      this.playerCharacter.characterSettings = this.settings;
      this.eventsService.dispatchEvent(EVENTS.SettingsUpdated);
      self.continue.emit();
    });
  }

  cancelClick(): void {
    this.close.emit();
  }
}
