import {Attribute} from './attribute';
import {AttributeType} from './attribute-type.enum';

export class ArmorType extends Attribute {
  type = 'ArmorType';
  don: number;
  donTimeUnit = 'STANDARD';
  doff: number;
  doffTimeUnit = 'STANDARD';

  constructor() {
    super();
    this.attributeType = AttributeType.ARMOR_TYPE;
  }
}
