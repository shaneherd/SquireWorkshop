import {Item} from './item';
import {ArmorType} from '../attributes/armor-type';
import {Ability} from '../attributes/ability.model';
import {ItemType} from './item-type.enum';
import {ItemTypeValue} from '../../../constants';

export class Armor extends Item {
  type: ItemTypeValue = 'Armor';
  itemType: ItemType = ItemType.ARMOR;
  armorType: ArmorType;
  ac = 0;
  abilityModifier: Ability;
  maxAbilityModifier = 0;
  minStrength = 0;
  stealthDisadvantage = false;
}
