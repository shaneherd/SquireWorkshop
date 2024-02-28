import {Attribute} from './attribute';
import {ModifierCategory} from '../modifier-category.enum';
import {AttributeType} from './attribute-type.enum';

export class Misc extends Attribute {
  type = 'Misc';
  modifierCategory: ModifierCategory = ModifierCategory.MISC;
  characteristicDependant = false;

  constructor() {
    super();
    this.attributeType = AttributeType.MISC;
  }
}
