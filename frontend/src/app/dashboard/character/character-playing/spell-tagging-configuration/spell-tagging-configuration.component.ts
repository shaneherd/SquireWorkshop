import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CreatureSpellTagConfigurationCollection} from '../../../../shared/models/creatures/creature-spell-tag-configuration-collection';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {CreatureSpellTagConfiguration} from '../../../../shared/models/creatures/creature-spell-tag-configuration';
import {PlayerCharacter} from '../../../../shared/models/creatures/characters/player-character';
import {Creature} from '../../../../shared/models/creatures/creature';

@Component({
  selector: 'app-spell-tagging-configuration',
  templateUrl: './spell-tagging-configuration.component.html',
  styleUrls: ['./spell-tagging-configuration.component.scss']
})
export class SpellTaggingConfigurationComponent {
  @Input() creature: Creature;
  @Input() tagCollection: CreatureSpellTagConfigurationCollection;
  @Output() tagClick = new EventEmitter();
  @Output() spellClick = new EventEmitter();

  constructor() { }

  inputClick(event: MouseEvent): void {
    event.stopPropagation();
  }

  onTagClick(): void {
    this.tagClick.emit(this.tagCollection);
  }

  onSpellClick(configuration: CreatureSpellTagConfiguration): void {
    this.spellClick.emit(configuration.creatureSpell);
  }

  checkChange(event: MatCheckboxChange, configuration: CreatureSpellTagConfiguration): void {
    configuration.checked = event.checked;
  }
}
