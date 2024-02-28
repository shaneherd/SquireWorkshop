import {Attribute} from './attributes/attribute';
import {ModifierCategory} from './modifier-category.enum';

export class ModifierType {
  attribute: Attribute;
  modifierCategory: ModifierCategory = ModifierCategory.MISC;
  characteristicDependant = false;
}
