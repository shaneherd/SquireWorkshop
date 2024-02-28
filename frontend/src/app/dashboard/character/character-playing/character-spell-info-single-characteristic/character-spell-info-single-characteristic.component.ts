import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {PlayerCharacter} from '../../../../shared/models/creatures/characters/player-character';
import {ClassSpellPreparation} from '../../../../shared/models/characteristics/class-spell-preparation';
import {CreatureSpell} from '../../../../shared/models/creatures/creature-spell';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {CreatureConfigurationCollection} from '../../../../shared/models/creatures/configs/creature-configuration-collection';
import {ChosenClass} from '../../../../shared/models/creatures/characters/chosen-class';
import {CharacterService} from '../../../../core/services/creatures/character.service';
import {CreatureService} from '../../../../core/services/creatures/creature.service';
import {CreatureAbilityProficiency} from '../../../../shared/models/creatures/configs/creature-ability-proficiency';
import {CreatureSpellConfiguration} from '../../../../shared/models/creatures/creature-spell-configuration';

@Component({
  selector: 'app-character-spell-info-single-characteristic',
  templateUrl: './character-spell-info-single-characteristic.component.html',
  styleUrls: ['./character-spell-info-single-characteristic.component.scss']
})
export class CharacterSpellInfoSingleCharacteristicComponent implements OnInit, OnChanges {
  @Input() playerCharacter: PlayerCharacter;
  @Input() collection: CreatureConfigurationCollection;
  @Input() spells: CreatureSpell[];
  @Input() label: string;
  @Input() characteristicId: string;
  @Input() classSpellPreparation: ClassSpellPreparation = null;
  @Output() spellClick = new EventEmitter();

  spellsKnown = 0;
  cantripsKnown = 0;
  prepared = 0;
  maxPrepared = 0;
  maxPreparedTooltip = '';
  applicableSpells: CreatureSpellConfiguration[] = [];

  constructor(
    private creatureService: CreatureService,
    private characterService: CharacterService
  ) { }

  ngOnInit() {
    this.initializeMaxSpells();
    this.initializeSpellCounts();
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        if (propName === 'spells') {
          this.initializeMaxSpells();
          this.initializeSpellCounts();
        }
      }
    }
  }

  private initializeMaxSpells(): void {
    const chosenClass = this.getChosenClass();
    this.maxPrepared = this.characterService.getMaxPrepared(this.classSpellPreparation, chosenClass, this.collection);
    this.maxPreparedTooltip = this.characterService.getMaxPreparedTooltip(this.classSpellPreparation, chosenClass, this.collection);
  }

  private getChosenClass(): ChosenClass {
    for (let i = 0; i < this.playerCharacter.classes.length; i++) {
      const chosenClass = this.playerCharacter.classes[i];
      if (chosenClass.characterClass.id === this.characteristicId) {
        return chosenClass;
      }
    }
    return null;
  }

  private initializeSpellCounts(): void {
    this.applicableSpells = [];
    this.cantripsKnown = 0;
    this.spellsKnown = 0;
    this.prepared = 0;

    this.spells.forEach((creatureSpell: CreatureSpell) => {
      if (creatureSpell.assignedCharacteristic === this.characteristicId) {
        if (creatureSpell.spell.level === 0) {
          this.cantripsKnown++;
        } else {
          const configuration = this.characterService.getCreatureSpellConfiguration(this.playerCharacter, this.collection, creatureSpell);
          this.applicableSpells.push(configuration);
          this.spellsKnown++;
          if (creatureSpell.prepared || (configuration.configuration != null && configuration.configuration.alwaysPrepared)) {
            if (configuration.configuration == null || configuration.configuration.countTowardsPrepared) {
              this.prepared++;
            }
          }
        }
      }
    });
  }

  onSpellCLick(creatureSpell: CreatureSpell): void {
    this.spellClick.emit(creatureSpell);
  }

  checkChange(event: MatCheckboxChange, configuration: CreatureSpellConfiguration): void {
    if (configuration.creatureSpell.spell.level === 0) {
      return;
    }
    if (event.checked) {
      configuration.creatureSpell.prepared = true;
      if (configuration.configuration != null && configuration.configuration.countTowardsPrepared) {
        this.prepared++;
      }
    } else {
      configuration.creatureSpell.prepared = false;
      if (configuration.configuration != null && configuration.configuration.countTowardsPrepared) {
        this.prepared--;
      }

      if (this.prepared < 0) {
        this.prepared = 0;
      }
    }
  }

}
