import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PlayerCharacter} from '../../../../../shared/models/creatures/characters/player-character';
import {CreatureConfigurationCollection} from '../../../../../shared/models/creatures/configs/creature-configuration-collection';
import {CharacterSettings} from '../../../../../shared/models/creatures/characters/character-settings';
import {CharacterService} from '../../../../../core/services/creatures/character.service';
import * as _ from 'lodash';
import {EVENTS} from '../../../../../constants';
import {EventsService} from '../../../../../core/services/events.service';

@Component({
  selector: 'app-character-equipment-settings',
  templateUrl: './character-equipment-settings.component.html',
  styleUrls: ['./character-equipment-settings.component.scss']
})
export class CharacterEquipmentSettingsComponent implements OnInit {
  @Input() playerCharacter: PlayerCharacter;
  @Input() collection: CreatureConfigurationCollection;
  @Output() save = new EventEmitter();
  @Output() close = new EventEmitter();

  settings = new CharacterSettings();

  constructor(
    private characterService: CharacterService,
    private eventsService: EventsService
  ) { }

  ngOnInit() {
    this.settings = _.cloneDeep(this.playerCharacter.characterSettings);
  }

  closeDetails(): void {
    this.close.emit();
  }

  saveSettings(): void {
    const settings = _.cloneDeep(this.playerCharacter.characterSettings);
    settings.equipment = this.settings.equipment;

    this.characterService.updateCharacterSettings(this.playerCharacter, settings).then(() => {
      this.playerCharacter.characterSettings.equipment = settings.equipment;
      this.eventsService.dispatchEvent(EVENTS.SettingsUpdated);
    });
    this.save.emit();
  }

}
