import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MagicalItemSpellConfiguration} from '../../../../../shared/models/items/magical-item-spell-configuration';
import {Spell} from '../../../../../shared/models/powers/spell';
import {PowerService} from '../../../../../core/services/powers/power.service';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {AttackType} from '../../../../../shared/models/attack-type.enum';
import {MagicalItem} from '../../../../../shared/models/items/magical-item';
import {ItemService} from '../../../../../core/services/items/item.service';
import {Creature} from '../../../../../shared/models/creatures/creature';
import {CreatureType} from '../../../../../shared/models/creatures/creature-type.enum';
import {CharacterService} from '../../../../../core/services/creatures/character.service';
import {PlayerCharacter} from '../../../../../shared/models/creatures/characters/player-character';
import {CreatureConfigurationCollection} from '../../../../../shared/models/creatures/configs/creature-configuration-collection';
import {AbilityService} from '../../../../../core/services/attributes/ability.service';
import {CreatureItemService} from '../../../../../core/services/creatures/creature-item.service';
import {CharacterLevel} from '../../../../../shared/models/character-level';
import {CharacterLevelService} from '../../../../../core/services/character-level.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-magical-item-spell-configuration',
  templateUrl: './magical-item-spell-configuration.component.html',
  styleUrls: ['./magical-item-spell-configuration.component.scss']
})
export class MagicalItemSpellConfigurationComponent implements OnInit {
  @Input() magicalItem: MagicalItem;
  @Input() magicalItemSpellConfiguration: MagicalItemSpellConfiguration;
  @Input() creature: Creature;
  @Input() collection: CreatureConfigurationCollection;
  @Input() editing = false;
  @Input() showCharges = false;
  @Output() close = new EventEmitter();
  @Output() continue = new EventEmitter();
  @Output() remove = new EventEmitter();

  loading = false;
  viewingSpell: Spell = null;
  levels: number[] = [];
  storedLevel = 0;
  casterLevel: CharacterLevel = null;
  casterLevels: CharacterLevel[] = [];
  charges = 0;
  allowCastingAtHigherLevel = false;
  removeOnCasting = false;
  overrideSpellAttackCalculation = false;
  chargesPerLevelAboveStoredLevel = 0;
  maxLevel = 9;
  spellAttackModifier = 0;
  spellAttackModifierDisplay = '';
  spellSaveDC = 0;

  isAttack = false;
  isSave = false;

  constructor(
    private powerService: PowerService,
    private itemService: ItemService,
    private characterService: CharacterService,
    private abilityService: AbilityService,
    private creatureItemService: CreatureItemService,
    private characterLevelService: CharacterLevelService
  ) { }

  ngOnInit() {
    this.initializeLevels();
    this.charges = this.magicalItemSpellConfiguration.charges;
    this.allowCastingAtHigherLevel = this.magicalItemSpellConfiguration.allowCastingAtHigherLevel;
    this.chargesPerLevelAboveStoredLevel = this.magicalItemSpellConfiguration.chargesPerLevelAboveStoredLevel;

    this.maxLevel = this.magicalItemSpellConfiguration.maxLevel;
    this.removeOnCasting = this.magicalItemSpellConfiguration.removeOnCasting;
    this.overrideSpellAttackCalculation = this.magicalItemSpellConfiguration.overrideSpellAttackCalculation;
    this.spellAttackModifier = this.magicalItemSpellConfiguration.spellAttackModifier;
    this.spellSaveDC = this.magicalItemSpellConfiguration.spellSaveDC;

    if (!this.overrideSpellAttackCalculation) {
      const playerCharacter = this.creature == null || this.creature.creatureType !== CreatureType.CHARACTER ? null : this.creature as PlayerCharacter;
      this.spellAttackModifier = this.creatureItemService.getMagicalItemSpellAttack(this.magicalItem, this.magicalItemSpellConfiguration.storedLevel, playerCharacter, this.collection);
      this.spellSaveDC = this.creatureItemService.getMagicalItemSpellSaveDC(this.magicalItem, this.magicalItemSpellConfiguration.storedLevel, playerCharacter, this.collection);
    }

    this.spellAttackModifierDisplay = this.abilityService.convertScoreToString(this.spellAttackModifier);

    this.powerService.getPower(this.magicalItemSpellConfiguration.spell.id).then((spell: Spell) => {
      this.viewingSpell = spell;
      this.isAttack = spell.attackType === AttackType.ATTACK;
      this.isSave = spell.attackType === AttackType.SAVE;
      this.loading = false;
    });
  }

  private initializeLevels(): void {
    this.levels = [];
    this.levels.push(1);
    this.levels.push(2);
    this.levels.push(3);
    this.levels.push(4);
    this.levels.push(5);
    this.levels.push(6);
    this.levels.push(7);
    this.levels.push(8);
    this.levels.push(9);

    this.casterLevels = this.characterLevelService.getLevelsDetailedFromStorage();

    this.storedLevel = this.magicalItemSpellConfiguration.storedLevel;
    if (this.magicalItemSpellConfiguration.spell.level === 0 && this.magicalItemSpellConfiguration.casterLevel != null) {
      this.casterLevel = _.find(this.casterLevels, (level: CharacterLevel) => {
        return level.id === this.magicalItemSpellConfiguration.casterLevel.id;
      });
    }
  }

  levelChange(level: number): void {
    this.storedLevel = level;
    if (this.maxLevel < this.storedLevel) {
      this.maxLevel = this.storedLevel;
    }
  }

  casterLevelChange(level: CharacterLevel): void {
    this.casterLevel = level;
  }

  chargesChange(input): void {
    this.charges = input.value;
  }

  maxLevelChange(level: number): void {
    this.maxLevel = level;
  }

  chargesPerLevelAboveStoredLevelChange(input): void {
    this.chargesPerLevelAboveStoredLevel = input.value;
  }

  allowCastingAtHigherLevelChange(event: MatCheckboxChange): void {
    this.allowCastingAtHigherLevel = event.checked;
  }

  removeOnCastingChange(event: MatCheckboxChange): void {
    this.removeOnCasting = event.checked;
  }

  overrideSpellAttackCalculationChange(event: MatCheckboxChange): void {
    this.overrideSpellAttackCalculation = event.checked;
  }

  spellAttackChange(input): void {
    this.spellAttackModifier = input.value;
  }

  spellSaveDCChange(input): void {
    this.spellSaveDC = input.value;
  }

  continueClick(): void {
    this.magicalItemSpellConfiguration.storedLevel = this.storedLevel;
    this.magicalItemSpellConfiguration.casterLevel = this.viewingSpell.level === 0 ? this.casterLevel : null;
    this.magicalItemSpellConfiguration.charges = this.charges;
    this.magicalItemSpellConfiguration.allowCastingAtHigherLevel = this.allowCastingAtHigherLevel;
    this.magicalItemSpellConfiguration.chargesPerLevelAboveStoredLevel = this.chargesPerLevelAboveStoredLevel;
    this.magicalItemSpellConfiguration.maxLevel = this.maxLevel;
    this.magicalItemSpellConfiguration.removeOnCasting = this.removeOnCasting;
    this.magicalItemSpellConfiguration.overrideSpellAttackCalculation = this.overrideSpellAttackCalculation;
    this.magicalItemSpellConfiguration.spellAttackModifier = this.spellAttackModifier;
    this.magicalItemSpellConfiguration.spellSaveDC = this.spellSaveDC;
    this.continue.emit(this.magicalItemSpellConfiguration);
  }

  removeClick(): void {
    this.remove.emit(this.magicalItemSpellConfiguration);
  }

  cancelClick(): void {
    this.close.emit();
  }

}
