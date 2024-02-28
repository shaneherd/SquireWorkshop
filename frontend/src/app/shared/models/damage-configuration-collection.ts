import {AttackType} from './attack-type.enum';
import {DamageConfiguration} from './damage-configuration';
import {ListObject} from './list-object';

export class DamageConfigurationCollection {
  attackType: AttackType = AttackType.NONE;
  temporaryHP = false;
  attackMod = 0;
  attackAbilityMod = '0';
  attackModTooltip = '';
  saveProficiencyModifier = false;
  saveAbilityModifier = '0';
  saveType = new ListObject('0', '');
  halfOnSave = false;
  damageConfigurations: DamageConfiguration[]  = [];
  extraDamage = false;
  numLevelsAboveBase = 0;
  extraDamageConfigurations: DamageConfiguration[] = [];
  advancement = false;
  advancementDamageConfigurations: DamageConfiguration[] = [];
}
