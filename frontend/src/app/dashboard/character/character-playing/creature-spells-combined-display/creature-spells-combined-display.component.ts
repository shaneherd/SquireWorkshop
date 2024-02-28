import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {CreatureConfigurationCollection} from '../../../../shared/models/creatures/configs/creature-configuration-collection';
import {CreatureSpell} from '../../../../shared/models/creatures/creature-spell';
import {PowerModifier} from '../../../../shared/models/powers/power-modifier';
import {EVENTS} from '../../../../constants';
import {EventsService} from '../../../../core/services/events.service';
import {ChosenClass} from '../../../../shared/models/creatures/characters/chosen-class';
import {CreatureSpellConfiguration} from '../../../../shared/models/creatures/creature-spell-configuration';
import {CharacterService} from '../../../../core/services/creatures/character.service';
import {Subscription} from 'rxjs';
import {CharacteristicType} from '../../../../shared/models/characteristics/characteristic-type.enum';
import {Characteristic} from '../../../../shared/models/characteristics/characteristic';
import * as _ from 'lodash';
import {TranslateService} from '@ngx-translate/core';
import {Creature} from '../../../../shared/models/creatures/creature';
import {CreatureType} from '../../../../shared/models/creatures/creature-type.enum';
import {PlayerCharacter} from '../../../../shared/models/creatures/characters/player-character';
import {BattleMonster} from '../../../../shared/models/creatures/battle-monsters/battle-monster';

@Component({
  selector: 'app-creature-spells-combined-display',
  templateUrl: './creature-spells-combined-display.component.html',
  styleUrls: ['./creature-spells-combined-display.component.scss']
})
export class CreatureSpellsCombinedDisplayComponent implements OnInit, OnDestroy {
  @Input() creature: Creature;
  @Input() collection: CreatureConfigurationCollection;
  @Input() attackModifiers: Map<string, PowerModifier>;
  @Input() saveModifiers: Map<string, PowerModifier>;
  @Input() clickDisabled = false;
  @Input() showAddSpell = true;
  @Output() spellClick = new EventEmitter();
  @Output() addSpells = new EventEmitter<string>();
  @Output() close = new EventEmitter();
  @Output() configuringClick = new EventEmitter();
  @Output() configuringClose = new EventEmitter();

  playerCharacter: PlayerCharacter = null;
  eventSub: Subscription;
  applicableSpells: CreatureSpellConfiguration[] = [];
  spellsMap = new Map<string, CreatureSpellConfiguration[]>();
  characteristics: Characteristic[] = [];

  configuringAbility = false;
  configuringAttack = false;
  configuringSave = false;

  index = 0;
  characteristic: Characteristic = null;

  characteristicId = '0';
  characteristicType: CharacteristicType = null;
  attackModifier: PowerModifier = null;
  saveModifier: PowerModifier = null;

  constructor(
    private eventsService: EventsService,
    private characterService: CharacterService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    if (this.creature != null && this.creature.creatureType === CreatureType.CHARACTER) {
      this.playerCharacter = this.creature as PlayerCharacter;
    }
    this.initializeSpells();

    this.eventSub = this.eventsService.events.subscribe(event => {
      if (event === EVENTS.UpdateSpellList || event === EVENTS.SettingsUpdated) {
        this.initializeSpells();
      }
    });
  }

  ngOnDestroy() {
    this.eventSub.unsubscribe();
  }

  private getCharacteristics(): Characteristic[] {
    const characteristics: Characteristic[] = [];
    if (this.playerCharacter != null) {
      if (this.playerCharacter.characterSettings.spellcasting.displayClassSpellcasting) {
        this.playerCharacter.classes.forEach((chosenClass: ChosenClass) => {
          if (chosenClass.displaySpellcasting) {
            characteristics.push(chosenClass.characterClass);
          }
        });
      }
      if (this.playerCharacter.characterSettings.spellcasting.displayRaceSpellcasting) {
        characteristics.push(this.playerCharacter.characterRace.race);
      }
      if (this.playerCharacter.characterSettings.spellcasting.displayBackgroundSpellcasting &&
        this.playerCharacter.characterBackground.background != null) {
        characteristics.push(this.playerCharacter.characterBackground.background);
      }
      if (this.playerCharacter.characterSettings.spellcasting.displayOtherSpellcasting) {
        const other = new Characteristic();
        other.name = this.translate.instant('Other');
        characteristics.push(other);
      }
    } else if (this.creature.creatureType === CreatureType.MONSTER) {
      const battleMonster = this.creature as BattleMonster;
      if (battleMonster.monster.spellcaster && this.creature.creatureSpellCasting != null) {
        const standard = new Characteristic();
        standard.name = this.translate.instant('Standard');
        characteristics.push(standard);
      }
      if (battleMonster.monster.innateSpellcaster && this.creature.innateSpellCasting != null) {
        const innate = new Characteristic();
        innate.name = this.translate.instant('Innate');
        innate.id = 'innate';
        characteristics.push(innate);
      }
    }

    if (characteristics.length > 1) {
      const all = new Characteristic();
      all.name = this.translate.instant('All');
      all.id = '-1';
      characteristics.push(all);
    }

    return characteristics;
  }

  private initializeSpells(): void {
    this.spellsMap = new Map<string, CreatureSpellConfiguration[]>();
    this.characteristics = this.getCharacteristics();
    const allSpells: CreatureSpellConfiguration[] = [];
    this.creature.creatureSpellCasting.spells.forEach((creatureSpell: CreatureSpell) => {
      if (!creatureSpell.hidden && this.getCharacteristicIndex(creatureSpell.assignedCharacteristic) > -1) {
        const creatureSpellConfiguration = this.characterService.getCreatureSpellConfiguration(this.creature, this.collection, creatureSpell);
        let spells = this.spellsMap.get(creatureSpell.assignedCharacteristic);
        if (spells == null) {
          spells = [];
          this.spellsMap.set(creatureSpell.assignedCharacteristic, spells);
        }
        spells.push(creatureSpellConfiguration);
        allSpells.push(creatureSpellConfiguration);
      }
    });
    this.creature.innateSpellCasting.spells.forEach((creatureSpell: CreatureSpell) => {
      if (!creatureSpell.hidden) {
        creatureSpell.assignedCharacteristic = 'innate';
        const creatureSpellConfiguration = this.characterService.getCreatureSpellConfiguration(this.creature, this.collection, creatureSpell);
        let spells = this.spellsMap.get(creatureSpell.assignedCharacteristic);
        if (spells == null) {
          spells = [];
          this.spellsMap.set(creatureSpell.assignedCharacteristic, spells);
        }
        spells.push(creatureSpellConfiguration);
        allSpells.push(creatureSpellConfiguration);
      }
    });
    this.spellsMap.set('-1', allSpells);

    let index = 0;
    if (this.characteristic != null) {
      index = this.getCharacteristicIndex(this.characteristic.id);
    }
    if (index < 0) {
      index = 0;
    }
    this.setIndex(index);
  }

  private getCharacteristicIndex(id: string): number {
    return _.findIndex(this.characteristics, function(characteristic) { return characteristic.id === id });
  }

  onSpellCLick(creatureSpell: CreatureSpell): void {
    if (!this.clickDisabled) {
      this.spellClick.emit(creatureSpell);
    }
  }

  addSpellClick(): void {
    let id = this.characteristic.id;
    if (id === '-1') {
      id = null;
    }
    this.addSpells.emit(id);
  }

  closeDetails(): void {
    this.close.emit();
  }

  saveConfiguring(): void {
    this.closeConfiguring();
  }

  abilityClick(characteristic: Characteristic): void {
    this.configuringAbility = true;
    this.handleConfiguringClick(characteristic);
  }

  private handleConfiguringClick(characteristic: Characteristic): void {
    this.characteristicId = characteristic.id;
    this.characteristicType = characteristic.characteristicType;
    this.attackModifier = this.attackModifiers.get(this.characteristicId);
    this.saveModifier = this.saveModifiers.get(this.characteristicId);
    this.configuringClick.emit();
  }

  attackClick(characteristic: Characteristic): void {
    this.configuringAttack = true;
    this.handleConfiguringClick(characteristic);
  }

  saveClick(characteristic: Characteristic): void {
    this.configuringSave = true;
    this.handleConfiguringClick(characteristic);
  }

  closeConfiguring(): void {
    this.configuringAbility = false;
    this.configuringAttack = false;
    this.configuringSave = false;
    this.configuringClose.emit();
  }

  onNextPage(): void {
    this.setIndex(this.index + 1);
  }

  onPreviousPage(): void {
    this.setIndex(this.index - 1);
  }

  private setIndex(index: number): void {
    if (index >= 0 && index < this.characteristics.length) {
      this.index = index;
    }
    this.updateSelectedCharacteristic();
  }

  characteristicChange(characteristic: Characteristic): void {
    this.characteristic = characteristic;
    this.index = _.findIndex(this.characteristics, function(_characteristic) { return _characteristic.id === characteristic.id });
    this.updateApplicableSpells();
  }

  private updateSelectedCharacteristic(): void {
    if (this.index < this.characteristics.length) {
      this.characteristic = this.characteristics[this.index];
      this.updateApplicableSpells();
    } else {
      this.characteristic = null;
    }
  }

  private updateApplicableSpells(): void {
    if (this.characteristic != null) {
      this.applicableSpells = this.spellsMap.get(this.characteristic.id);
    } else {
      this.applicableSpells = [];
    }
  }
}
