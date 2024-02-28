import {CreatureListProficiency} from '../creature-list-proficiency';
import {CreatureListModifierValue} from '../creature-list-modifier-value';
import {CreatureChoiceProficiency} from './creature-choice-proficiency';
import {CreatureSkillListProficiency} from '../creature-skill-list-proficiency';
import {CreatureAbilityProficiency} from './creature-ability-proficiency';

export class CreatureProficiencyCollection {
  abilities: CreatureAbilityProficiency[] = [];
  abilityProficiencies: CreatureListProficiency[] = [];
  savingThrowProficiencies: CreatureListProficiency[] = [];
  armorProficiencies: CreatureListProficiency[] = [];
  languageProficiencies: CreatureListProficiency[] = [];
  skillProficiencies: CreatureSkillListProficiency[] = [];
  toolProficiencies: CreatureListProficiency[] = [];
  weaponProficiencies: CreatureListProficiency[] = [];
  miscProficiencies: CreatureListProficiency[] = [];

  skillChoiceProficiencies: CreatureChoiceProficiency[] = [];
  toolChoiceProficiencies: CreatureChoiceProficiency[] = [];

  numSavingThrows: CreatureListModifierValue[] = [];
  numAbilities: CreatureListModifierValue[] = [];
  numLanguages: CreatureListModifierValue[] = [];
}
