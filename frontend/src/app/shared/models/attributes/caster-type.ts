import {SpellSlots} from '../spell-slots';
import {Attribute} from './attribute';
import {ListObject} from '../list-object';
import {AttributeType} from './attribute-type.enum';

export class CasterType extends Attribute {
  type = 'CasterType';
  multiClassWeight: number;
  roundUp: boolean;
  spellSlots: SpellSlots[];

  constructor(levels: ListObject[]) {
    super();
    this.attributeType = AttributeType.CASTER_TYPE;
    this.multiClassWeight = 0;
    this.roundUp = false;
    this.spellSlots = [];

    if (levels != null) {
      for (let i = 0; i < levels.length; i++) {
        const level = new ListObject(levels[i].id, levels[i].name, levels[i].sid);
        this.spellSlots.push(new SpellSlots(level));
      }
    }
  }
}
