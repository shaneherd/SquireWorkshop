import {Size} from '../../size.enum';
import {DiceCollection} from '../../characteristics/dice-collection';
import {MonsterType} from './monster-type.enum';
import {ChallengeRating} from './challenge-rating.enum';
import {DiceSize} from '../../dice-size.enum';
import {Speed} from '../../speed';
import {SpeedType} from '../../speed-type.enum';
import {ModifierConfiguration} from '../../modifier-configuration';
import {LimitedUse} from '../../powers/limited-use';
import {AttackType} from '../../attack-type.enum';
import {DamageConfiguration} from '../../damage-configuration';
import {WeaponRangeType} from '../../items/weapon-range-type.enum';
import {ListObject} from '../../list-object';
import {Action} from '../../action.enum';
import {SpellSlots} from '../../spell-slots';
import {Proficiency} from '../../proficiency';
import {ItemProficiency} from '../../items/item-proficiency';
import {DamageModifier} from '../../characteristics/damage-modifier';
import {SenseValue} from '../../sense-value';
import {SpellConfiguration} from '../../characteristics/spell-configuration';
import {Ability} from '../../attributes/ability.model';
import {ItemQuantity} from '../../items/item-quantity';

export class Monster {
  id = '0';
  name = '';
  sid = 0;
  version = 0;

  alignment: ListObject;
  attributeProfs: Proficiency[] = [];
  itemProfs: ItemProficiency[] = [];
  damageModifiers: DamageModifier[] = [];
  conditionImmunities: ListObject[] = [];
  senses: SenseValue[] = [];
  abilityScores: MonsterAbilityScore[] = [];

  monsterType: MonsterType = MonsterType.HUMANOID;
  typeVariation = '';
  size: Size = Size.MEDIUM;
  challengeRating: ChallengeRating = ChallengeRating.ZERO;
  experience = 10;
  hover = false;
  legendaryPoints = 0;

  author = false;
  description = '';
  ac = 0;
  hitDice = new DiceCollection(DiceSize.EIGHT);
  speeds: Speed[] = [
    new Speed(SpeedType.WALK, 30),
    new Speed(SpeedType.CRAWL, 0),
    new Speed(SpeedType.CLIMB, 0),
    new Speed(SpeedType.SWIM, 0),
    new Speed(SpeedType.FLY, 0),
    new Speed(SpeedType.BURROW, 0)
  ];

  spellcaster = false;
  casterType: ListObject;
  spellcasterLevel: ListObject;
  spellAttackModifier = 0;
  spellSaveModifier = 0;
  spellSlots: SpellSlots = new SpellSlots();
  spellcastingAbility = '0';
  spells: SpellConfiguration[] = [];

  innateSpellcaster = false;
  innateSpellcasterLevel: ListObject;
  innateSpellcastingAbility = '0';
  innateSpellAttackModifier = 0;
  innateSpellSaveModifier = 0;
  innateSpells: InnateSpellConfiguration[] = [];

  items: ItemQuantity[] = [];
}

export class InnateSpellConfiguration {
  spell: ListObject;
  limitedUse: LimitedUse;
  slot = 0;
  author = false;
}

export class MonsterAbilityScore {
  ability: Ability = new Ability();
  value = 0;
}

export enum MonsterPowerType {
  ACTION = 'ACTION',
  FEATURE = 'FEATURE',
}

export class MonsterPower {
  id = '0';
  name = '';
  author = false;
  sid = 0;
  version = 0;
  limitedUse: LimitedUse = null;
  rechargeMin = 0;
  rechargeMax = 0;
  modifierConfigurations: ModifierConfiguration[] = [];
  monsterPowerType: MonsterPowerType;
}

export class MonsterAction extends MonsterPower {
  type = 'Action';
  description = '';
  monsterPowerType = MonsterPowerType.ACTION;
  actionType: Action = Action.STANDARD;
  legendaryCost = 0;
  rangeType: WeaponRangeType = WeaponRangeType.MELEE;
  reach = 5;
  normalRange = 20;
  longRange = 60;
  ammoType: ListObject = null;
  attackType: AttackType = AttackType.NONE;
  temporaryHP = false;
  attackMod = 0;
  attackAbilityModifier = '0';
  saveType: ListObject = null;
  saveProficiencyModifier = false;
  saveAbilityModifier = '0';
  halfOnSave = false;
  damageConfigurations: DamageConfiguration[] = [];
}

export class MonsterFeature extends MonsterPower {
  type = 'Feature';
  description = '';
  monsterPowerType = MonsterPowerType.FEATURE;
}

export class MonsterActionList {
  actions: MonsterAction[] = [];
}

export class MonsterFeatureList {
  features: MonsterFeature[] = [];
}
