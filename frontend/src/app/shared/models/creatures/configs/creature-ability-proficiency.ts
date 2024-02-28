import {CreatureAbilityScore} from '../creature-ability-score';
import {Ability} from '../../attributes/ability.model';
import {CreatureListProficiency} from '../creature-list-proficiency';
import {CreatureListModifier} from '../creature-list-modifier';
import {PowerModifierConfiguration} from '../../power-modifier-configuration';

export class CreatureAbilityProficiency {
  ability: Ability;
  abilityProficiency: CreatureListProficiency;
  abilityModifier: CreatureListModifier;
  saveProficiency: CreatureListProficiency;
  saveModifier: CreatureListModifier;
  abilityScore: CreatureAbilityScore = new CreatureAbilityScore();

  scoreModifiers = new Map<string, PowerModifierConfiguration>();
  abilityModifiers = new Map<string, PowerModifierConfiguration>();
  saveModifiers = new Map<string, PowerModifierConfiguration>();

  constructor(ability: Ability) {
    this.ability = ability;
    this.abilityScore = new CreatureAbilityScore();

    this.scoreModifiers = new Map<string, PowerModifierConfiguration>();
    this.abilityModifiers = new Map<string, PowerModifierConfiguration>();
    this.saveModifiers = new Map<string, PowerModifierConfiguration>();
  }
}
