import {Attribute} from './attribute';
import {AttributeType} from './attribute-type.enum';

export class Alignment extends Attribute {
  type = 'Alignment';

  constructor() {
    super();
    this.attributeType = AttributeType.ALIGNMENT;
  }
}
