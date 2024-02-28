import {InheritedFrom} from './inherited-from';
import {ListObject} from '../list-object';
import {Proficiency} from '../proficiency';
import {PowerModifierConfiguration} from '../power-modifier-configuration';

export class CreatureListProficiency {
  item: ListObject;
  proficient = false;
  inheritedFrom: InheritedFrom[] = [];
  parentProficiency: CreatureListProficiency;
  childrenProficiencies: CreatureListProficiency[] = [];
  proficiency: Proficiency = new Proficiency();
  modifiers = new Map<string, PowerModifierConfiguration>();
  passiveModifiers = new Map<string, PowerModifierConfiguration>();

  constructor(item: ListObject) {
    this.item = item;
    this.proficient = false;
    this.inheritedFrom = [];
    this.parentProficiency = null;
    this.childrenProficiencies = [];
    this.proficiency = new Proficiency();
    this.modifiers = new Map<string, PowerModifierConfiguration>();
    this.passiveModifiers = new Map<string, PowerModifierConfiguration>();
  }
}
