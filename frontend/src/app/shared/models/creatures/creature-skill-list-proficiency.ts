import {CreatureListProficiency} from './creature-list-proficiency';
import {Skill} from '../attributes/skill';
import {CreatureAbilityProficiency} from './configs/creature-ability-proficiency';

export class CreatureSkillListProficiency extends CreatureListProficiency {
  skill: Skill;
  abilityProficiency: CreatureAbilityProficiency;
}
