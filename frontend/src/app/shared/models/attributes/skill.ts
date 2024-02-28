import {Ability} from './ability.model';
import {Attribute} from './attribute';
import {AttributeType} from './attribute-type.enum';

export class Skill extends Attribute {
  type = 'Skill';
  ability: Ability;

  constructor() {
    super();
    this.attributeType = AttributeType.SKILL;
  }
}
