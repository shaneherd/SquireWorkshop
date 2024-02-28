import {CompanionType} from './companion-type.enum';
import {Creature} from '../creature';
import {CompanionModifier} from './companion-modifier';
import {CompanionScoreModifier} from './companion-score-modifier';
import {MonsterSummary} from '../monsters/monster-summary';

export class Companion extends Creature {
  type = 'Companion';
  companionType: CompanionType = CompanionType.BEAST;
  monster: MonsterSummary = null;

  maxHp = 0;
  rollOverDamage = false;
  acModifier: CompanionModifier = new CompanionModifier();
  savingThrowModifier: CompanionModifier = new CompanionModifier();
  skillCheckModifier: CompanionModifier = new CompanionModifier();
  attackModifier: CompanionModifier = new CompanionModifier();
  damageModifier: CompanionModifier = new CompanionModifier();
  includeCharacterSaves = false;
  includeCharacterSkills = false;
  abilityScoreModifiers: CompanionScoreModifier[] = [];
}
