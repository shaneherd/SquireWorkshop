import {DiceCollection} from '../../characteristics/dice-collection';
import {MonsterAbilityScore} from './monster';
import {ListObject} from '../../list-object';
import {ChallengeRating} from './challenge-rating.enum';

export class MonsterSummary {
  id = '0';
  name = '';
  abilityScores: MonsterAbilityScore[] = [];
  hitDice = new DiceCollection();
  ac = 0;
  spellcastingAbility = '0';
  spellcasterLevel: ListObject;
  innateSpellcasterLevel: ListObject;
  challengeRating: ChallengeRating;
  experience = 0;
  perceptionProficient = false;
  stealthProficient = false;
}
