import {Attribute} from './attribute';
import {AttributeType} from './attribute-type.enum';

export class SpellSchool extends Attribute {
  type = 'SpellSchool';

  constructor() {
    super();
    this.attributeType = AttributeType.SPELL_SCHOOL;
  }
}
