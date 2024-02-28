import {Attribute} from './attribute';
import {AttributeType} from './attribute-type.enum';

export class ToolCategory extends Attribute {
  type = 'ToolCategory';

  constructor() {
    super();
    this.attributeType = AttributeType.TOOL_CATEGORY;
  }
}
