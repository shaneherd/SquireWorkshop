import {Attribute} from './attributes/attribute';
import {AttributeType} from './attributes/attribute-type.enum';

export class CharacterLevel extends Attribute {
  type = 'CharacterLevel';
  minExp = 0;
  profBonus = 0;

  constructor() {
    super();
    this.attributeType = AttributeType.LEVEL;
  }
}
