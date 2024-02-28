import {ListObject} from '../../list-object';
import {InheritedFrom} from '../inherited-from';
import {PowerModifierConfiguration} from '../../power-modifier-configuration';

export class CreatureConditionImmunityCollectionItem {
  condition: ListObject;
  immune = false;
  inheritedFrom: InheritedFrom[] = [];
  modifiers = new Map<string, PowerModifierConfiguration>();
}
