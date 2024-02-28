import {Attribute} from './attributes/attribute';
import {ModifierCategory} from './modifier-category.enum';
import {ListObject} from './list-object';
import {ModifierSubCategory} from './modifier-sub-category.enum';

export class ModifierConfiguration {
  attribute: Attribute = null;
  modifierCategory: ModifierCategory = ModifierCategory.MISC;
  modifierSubCategory: ModifierSubCategory = ModifierSubCategory.OTHER;
  characteristicDependant = false;
  value = 0;
  adjustment = true;
  proficient = false;
  halfProficient = false;
  roundUp = false;
  advantage = false;
  disadvantage = false;
  extra = false;
  characterAdvancement = false;
  level: ListObject;
  abilityModifier: ListObject;
  useLevel = false;
  useHalfLevel = false;
}
