import {Attribute} from './attribute';
import {AttributeType} from './attribute-type.enum';

export class Ability extends Attribute {
  type = 'Ability';
  abbr: string;

  constructor() {
    super();
    this.attributeType = AttributeType.ABILITY;
  }
}
