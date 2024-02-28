import {Attribute} from '../attributes/attribute';
import {AttributeType} from '../attributes/attribute-type.enum';

export class WeaponType extends Attribute {
  type = 'WeaponType';

  constructor() {
    super();
    this.attributeType = AttributeType.WEAPON_TYPE;
  }
}
