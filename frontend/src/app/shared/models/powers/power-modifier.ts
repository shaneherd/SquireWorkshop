import {Proficiency} from '../proficiency';
import {CreatureAbilityProficiency} from '../creatures/configs/creature-ability-proficiency';
import {AttackType} from '../attack-type.enum';
import {PowerModifierConfiguration} from '../power-modifier-configuration';

export class PowerModifier {
  proficiency: Proficiency = new Proficiency();
  ability: CreatureAbilityProficiency;
  abilityModifier = 0;
  profModifier = 0;
  attackType = AttackType.ATTACK;
  modifiers = new Map<string, PowerModifierConfiguration>();
}
