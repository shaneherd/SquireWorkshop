import {Attribute} from './attribute';
import {ListObject} from '../list-object';
import {AttributeType} from './attribute-type.enum';

export class Condition extends Attribute {
  type = 'Condition';
  connectingConditions: ListObject[] = [];

  constructor() {
    super();
    this.attributeType = AttributeType.CONDITION;
  }
}
