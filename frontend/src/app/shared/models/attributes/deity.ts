import {Attribute} from './attribute';
import {DeityCategory} from './deity-category';
import {Alignment} from './alignment';
import {AttributeType} from './attribute-type.enum';

export class Deity extends Attribute {
  type = 'Deity';
  deityCategory: DeityCategory = new DeityCategory();
  alignment: Alignment = new Alignment();
  symbol = '';

  constructor() {
    super();
    this.attributeType = AttributeType.DEITY;
  }
}
