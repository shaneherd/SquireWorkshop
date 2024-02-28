import {Attribute} from './attribute';
import {AttributeType} from './attribute-type.enum';

export class DamageType extends Attribute {
  type = 'DamageType';

  constructor() {
    super();
    this.attributeType = AttributeType.DAMAGE_TYPE;
  }
}
