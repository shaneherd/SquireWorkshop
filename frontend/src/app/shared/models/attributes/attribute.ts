import {AttributeType} from './attribute-type.enum';

export class Attribute {
  type = 'Attribute';
  id = '0';
  sid = 0;
  name = '';
  description = '';
  attributeType: AttributeType;
  author = false;
  version = 0;

  constructor() {
    this.id = '0';
    this.name = '';
    this.sid = 0;
    this.description = '';
    this.attributeType = AttributeType.NONE;
    this.author = false;
    this.version = 0;
  }
}
