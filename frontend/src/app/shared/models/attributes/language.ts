import {Attribute} from './attribute';
import {AttributeType} from './attribute-type.enum';

export class Language extends Attribute {
  type = 'Language';
  script: string;

  constructor() {
    super();
    this.attributeType = AttributeType.LANGUAGE;
  }
}
