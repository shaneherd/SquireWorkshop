import {CreatureType} from './creature-type.enum';
import {CreatureSpellCasting} from './creature-spell-casting';
import {CreatureWealth} from './creature-wealth';
import {ListObject} from '../list-object';
import {CreatureHealth} from './creature-health';
import {DamageModifier} from '../characteristics/damage-modifier';
import {SenseValue} from '../sense-value';
import {CreatureItem} from './creature-item';
import {ItemProficiency} from '../items/item-proficiency';
import {CreatureAbilityScore} from './creature-ability-score';
import {Proficiency} from '../proficiency';
import {ActiveCondition} from './active-condition';
import {CreatureFilter} from './creature-filter';
import {CreatureSort} from './creature-sort';

export class Creature {
  id = '0';
  name = '';
  creatureType: CreatureType;
  sid = 0;
  version = 0;
  abilityScores: CreatureAbilityScore[] = [];
  creatureSpellCasting: CreatureSpellCasting = new CreatureSpellCasting();
  innateSpellCasting: CreatureSpellCasting = new CreatureSpellCasting();
  creatureWealth: CreatureWealth = new CreatureWealth();
  alignment: ListObject;
  creatureHealth: CreatureHealth = new CreatureHealth();
  attributeProfs: Proficiency[] = [];
  itemProfs: ItemProficiency[] = [];
  damageModifiers: DamageModifier[] = [];
  conditionImmunities: ListObject[] = [];
  senses: SenseValue[] = [];
  activeConditions: ActiveCondition[] = [];
  items: CreatureItem[] = [];
  filters: CreatureFilter[] = [];
  sorts: CreatureSort[] = [];

  //attributes
  conditions: ListObject[] = [];
  skills: ListObject[] = [];
  acAbilities: ListObject[] = [];
}
