import {PowerType} from './power-type.enum';
import {DamageConfiguration} from '../damage-configuration';
import {AttackType} from '../attack-type.enum';
import {Ability} from '../attributes/ability.model';
import {ModifierConfiguration} from '../modifier-configuration';
import {PowerAreaOfEffect} from './power-area-of-effect';
import {LimitedUse} from './limited-use';
import {RangeType} from './range-type.enum';
import {RangeUnit} from './range-unit.enum';

export class Power {
  type = 'Power';
  id = '0';
  name = '';
  sid = 0;
  author = false;
  version = 0;

  powerType: PowerType;
  attackType = AttackType.NONE;
  temporaryHP = false;
  attackMod = 0;
  attackAbilityModifier = '0';
  saveType: Ability = null;
  halfOnSave = false;
  damageConfigurations: DamageConfiguration[] = [];
  extraDamage = false;
  numLevelsAboveBase = 0;
  saveProficiencyModifier = false;
  saveAbilityModifier = '0';
  rangeType = RangeType.OTHER;
  range = 0;
  rangeUnit = RangeUnit.FEET;
  powerAreaOfEffect: PowerAreaOfEffect = new PowerAreaOfEffect();
  limitedUses: LimitedUse[] = [];
  rechargeOnShortRest = false;
  rechargeOnLongRest = false;
  rechargeMin = 0;
  rechargeMax = 0;

  extraDamageConfigurations: DamageConfiguration[] = [];
  advancement = false;
  advancementDamageConfigurations: DamageConfiguration[] = [];

  modifierConfigurations: ModifierConfiguration[] = [];
  extraModifiers = false;
  modifiersNumLevelsAboveBase = 0;
  extraModifierConfigurations: ModifierConfiguration[] = [];
  advancementModifiers = false;
  advancementModifierConfigurations: ModifierConfiguration[] = [];
}
