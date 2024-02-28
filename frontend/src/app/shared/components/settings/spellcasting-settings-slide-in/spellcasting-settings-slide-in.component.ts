import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PlayerCharacter} from '../../../models/creatures/characters/player-character';
import {CharacterSettings} from '../../../models/creatures/characters/character-settings';
import {EventsService} from '../../../../core/services/events.service';
import {TranslateService} from '@ngx-translate/core';
import {CharacterService} from '../../../../core/services/creatures/character.service';
import {EVENTS} from '../../../../constants';
import * as _ from 'lodash';

@Component({
  selector: 'app-spellcasting-settings-slide-in',
  templateUrl: './spellcasting-settings-slide-in.component.html',
  styleUrls: ['./spellcasting-settings-slide-in.component.scss']
})
export class SpellcastingSettingsSlideInComponent implements OnInit {
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
    this.settings = _.cloneDeep(this.playerCharacter.characterSettings);
    this.character = _.cloneDeep(this.playerCharacter);
  }

  continueClick(): void {
    const self = this;
    const settings = _.cloneDeep(this.playerCharacter.characterSettings);
    settings.spellcasting = this.settings.spellcasting;

    const promises: Promise<any>[] = [];
    promises.push(this.characterService.updateCharacterSettings(this.playerCharacter, settings));
    promises.push(this.characterService.updateChosenClassesSpellcasting(this.character, this.character.classes));
    Promise.all(promises).then(() => {
      this.playerCharacter.classes = this.character.classes;
      this.playerCharacter.characterSettings.spellcasting = settings.spellcasting;
      this.eventsService.dispatchEvent(EVENTS.SettingsUpdated);
      self.continue.emit();
    });
  }

  cancelClick(): void {
    this.close.emit();
  }
}
