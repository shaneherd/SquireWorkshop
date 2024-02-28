import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CreatureSpell} from '../../models/creatures/creature-spell';
import {TranslateService} from '@ngx-translate/core';
import {CreatureSpellConfiguration} from '../../models/creatures/creature-spell-configuration';
import {Characteristic} from '../../models/characteristics/characteristic';
import {CharacterClass} from '../../models/characteristics/character-class';
import {Creature} from '../../models/creatures/creature';
import {CreatureType} from '../../models/creatures/creature-type.enum';
import {PlayerCharacter} from '../../models/creatures/characters/player-character';
import {BattleMonster} from '../../models/creatures/battle-monsters/battle-monster';

@Component({
  selector: 'app-spell-card',
  templateUrl: './spell-card.component.html',
  styleUrls: ['./spell-card.component.scss']
})
export class SpellCardComponent implements OnInit {
  @Input() creature: Creature;
  @Input() creatureSpellConfiguration: CreatureSpellConfiguration;
  @Input() creatureSpell: CreatureSpell;
  @Input() clickDisabled = false;
  @Input() displaySpellTagging = false;
  @Input() displayClass = false;
  @Input() displayPrepared = true;
  @Input() displaySpellTags = false;
  @Input() highlightActive = false;
  @Output() spellClick = new EventEmitter();

  level = '';
  characteristic: Characteristic = null;
  alwaysPrepared = false;
  countTowardsPrepared = true;

  constructor(
    private translate: TranslateService
  ) { }

  ngOnInit() {
    if (this.creatureSpellConfiguration == null) {
      this.creatureSpellConfiguration = new CreatureSpellConfiguration();
      this.creatureSpellConfiguration.creatureSpell = this.creatureSpell;
    }
    this.level = this.creatureSpellConfiguration.creatureSpell.spell.level === 0 ?
      this.translate.instant('Cantrip') :
      this.creatureSpellConfiguration.creatureSpell.spell.level.toString(10);

    this.initializeClass();
    this.initializePrepared();
  }

  private initializeClass(): void {
    if (this.creature == null) {
      return;
    }
    if (this.creature.creatureType === CreatureType.CHARACTER) {
      const playerCharacter = this.creature as PlayerCharacter;
      let characterClass: CharacterClass = null;
      for (let i = 0; i < playerCharacter.classes.length; i++) {
        const chosenClass = playerCharacter.classes[i];
        if (chosenClass.characterClass.id === this.creatureSpellConfiguration.creatureSpell.assignedCharacteristic) {
          characterClass = chosenClass.characterClass;
          break;
        }
      }

      if (characterClass != null) {
        this.characteristic = characterClass;
      } else if (playerCharacter.characterRace.race.id === this.creatureSpellConfiguration.creatureSpell.assignedCharacteristic) {
        this.characteristic = playerCharacter.characterRace.race;
      } else if (playerCharacter.characterBackground.background != null && playerCharacter.characterBackground.background.id === this.creatureSpellConfiguration.creatureSpell.assignedCharacteristic) {
        this.characteristic = playerCharacter.characterBackground.background;
      }
    } else if (this.creature.creatureType === CreatureType.MONSTER) {
      const battleMonster = this.creature as BattleMonster;
      if (this.creatureSpellConfiguration.creatureSpell.assignedCharacteristic === 'innate') {
        this.characteristic = new Characteristic();
        this.characteristic.name = this.translate.instant('Innate');
      }
    }
  }

  private initializePrepared(): void {
    if (this.creatureSpellConfiguration.configuration != null) {
      this.alwaysPrepared = this.creatureSpellConfiguration.configuration.alwaysPrepared;
      this.countTowardsPrepared = this.creatureSpellConfiguration.configuration.countTowardsPrepared;
    }
  }

  onSpellCLick(creatureSpell: CreatureSpell): void {
    if (!this.clickDisabled) {
      this.spellClick.emit(creatureSpell);
    }
  }
}
