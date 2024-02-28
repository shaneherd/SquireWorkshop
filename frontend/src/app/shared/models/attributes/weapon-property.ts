import {Attribute} from './attribute';
import {AttributeType} from './attribute-type.enum';

export class WeaponProperty extends Attribute {
  type = 'WeaponProperty';

  constructor() {
    super();
    this.attributeType = AttributeType.WEAPON_PROPERTY;
  }
}
