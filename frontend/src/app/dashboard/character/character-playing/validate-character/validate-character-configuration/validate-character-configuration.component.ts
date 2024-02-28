import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PlayerCharacter} from '../../../../../shared/models/creatures/characters/player-character';
import {CharacterSettings} from '../../../../../shared/models/creatures/characters/character-settings';
import * as _ from 'lodash';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {CharacterService} from '../../../../../core/services/creatures/character.service';

@Component({
  selector: 'app-validate-character-configuration',
  templateUrl: './validate-character-configuration.component.html',
  styleUrls: ['./validate-character-configuration.component.scss']
})
export class ValidateCharacterConfigurationComponent implements OnInit {
  @Input() playerCharacter: PlayerCharacter;
  @Output() cancel = new EventEmitter();
  @Output() save = new EventEmitter();

  settings = new CharacterSettings();
  resetIgnoredFeatures = false;

  constructor(
    private characterService: CharacterService
  ) { }

  ngOnInit() {
    this.settings = _.cloneDeep(this.playerCharacter.characterSettings);
  }

  closeDetails(): void {
    this.cancel.emit();
  }

  saveClick(): void {
    const settings = _.cloneDeep(this.playerCharacter.characterSettings);
    settings.validation = this.settings.validation;
    this.characterService.updateCharacterSettings(this.playerCharacter, settings).then(() => {
      this.playerCharacter.characterSettings.validation = settings.validation;
      this.save.emit(this.resetIgnoredFeatures);
    });
  }

  resetChange(event: MatCheckboxChange): void {
    this.resetIgnoredFeatures = event.checked;
  }
}
