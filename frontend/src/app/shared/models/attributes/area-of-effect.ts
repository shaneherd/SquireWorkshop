import {Attribute} from './attribute';
import {AttributeType} from './attribute-type.enum';

export class AreaOfEffect extends Attribute {
  type = 'AreaOfEffect';
  radius = false;
  width = false;
  height = false;
  length = false;

  constructor() {
    super();
    this.attributeType = AttributeType.AREA_OF_EFFECT;
  }
}
