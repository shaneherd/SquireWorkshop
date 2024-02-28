import {Attribute} from './attribute';
import {AttributeType} from './attribute-type.enum';

export class DeityCategory extends Attribute {
  type = 'DeityCategory';

  constructor() {
    super();
    this.attributeType = AttributeType.DEITY_CATEGORY;
  }
}
