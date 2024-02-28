import {Item} from './item';
import {ItemType} from './item-type.enum';
import {ItemTypeValue} from '../../../constants';
import {ListObject} from '../list-object';
import {MagicalItemType} from './magical-item-type.enum';
import {Rarity} from './rarity.enum';
import {DamageConfiguration} from '../damage-configuration';
import {DiceCollection} from '../characteristics/dice-collection';
import {MagicalItemApplicability} from './magical-item-applicability';
import {AttackType} from '../attack-type.enum';
import {MagicalItemSpellConfiguration} from './magical-item-spell-configuration';
import {MagicalItemSpellAttackCalculationType} from './magical-item-spell-attack-calculation-type.enum';
import {MagicalItemAttunementType} from './magical-item-attunement-type.enum';
import {MagicalItemTable} from './magical-item-table';

export class MagicalItem extends Item {
  type: ItemTypeValue = 'MagicalItem';
  itemType: ItemType = ItemType.MAGICAL_ITEM;

  magicalItemType: MagicalItemType = MagicalItemType.WONDROUS;
  rarity: Rarity = Rarity.COMMON;
  tables: MagicalItemTable[] = [];
  requiresAttunement = false;
  attunementType: MagicalItemAttunementType = MagicalItemAttunementType.ANY;
  attunementClasses: ListObject[] = [];
  attunementRaces: ListObject[] = [];
  attunementAlignments: ListObject[] = [];
  cursed = false;
  curseEffect = '';
  hasCharges = false;
  maxCharges = 0;
  rechargeable = false;
  rechargeRate: DiceCollection = new DiceCollection();
  rechargeOnLongRest = false;
  chanceOfDestruction = false;

  spells: MagicalItemSpellConfiguration[] = [];
  additionalSpells = false;
  additionalSpellsRemoveOnCasting = false;

  acMod = 0;
  applicableWeapons: MagicalItemApplicability[] = [];
  applicableAmmos: MagicalItemApplicability[] = [];
  applicableArmors: MagicalItemApplicability[] = [];
  applicableSpells: MagicalItemApplicability[] = [];

  attackType: AttackType = AttackType.NONE;
  temporaryHP = false;
  attackMod = 0;
  saveType: ListObject = new ListObject();
  halfOnSave: boolean;
  damages: DamageConfiguration[] = [];

  spellAttackCalculationType: MagicalItemSpellAttackCalculationType = MagicalItemSpellAttackCalculationType.NONE;
  spellAttackModifier = 5;
  spellSaveDC = 13;
}
