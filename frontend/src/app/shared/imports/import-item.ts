import {ListObject} from '../models/list-object';
import {MatMenuPanel} from '@angular/material/menu/typings/menu-panel';

export class ImportItem {
  importId: string;
  name: string;
  subName = '';
  type: ImportItemType;
  duplicates: ListObject[] = [];
  selectedDuplicate: ListObject = null;
  duplicateConfirmed = false;
  links: string[] = [];
  linked = true;
  selectedAction: ImportActionEvent = 'INSERT_AS_NEW';
  status: ImportStatus = 'NOT_SUPPORTED'
  finalId: string;
  children: ImportItem[] = [];
  ancestorCount = 0;
  expanded = true;
}

export class ImportItemConfiguration {
  importItem: ImportItem;
  menuActions: ImportAction[] = [];
  parent: ImportItemConfiguration;
  children: ImportItemConfiguration[] = [];
  dependencies: ImportItemConfiguration[] = [];
  links: ImportItemConfiguration[] = [];
  descendentCount = 0;
  cascadeParentAction = false;
  skipDisabled = false;
  useExistingDisabled = false;
  insertAsNewDisabled = false;
}

export class ImportAction {
  event: ImportActionEvent = 'INSERT_AS_NEW';
  disabled: boolean;
  icon: string;
  childMenu: MatMenuPanel;

  constructor(event: ImportActionEvent, icon: string, disabled: boolean = false) {
    this.event = event;
    this.icon = icon;
    this.disabled = disabled;
  }
}

export declare type ImportStatus = 'READY'
  | 'COMPLETE'
  | 'ERROR'
  | 'NOT_SUPPORTED'
  | 'MISSING_PROPERTIES'
  | 'DEPENDENCIES_NOT_COMPLETE';

export declare type ImportActionEvent = 'VIEW'
  | 'USE_EXISTING'
  | 'REPLACE_EXISTING'
  | 'INSERT_AS_NEW'
  | 'SKIP_ENTRY';

export declare type ImportItemCategory =
    'ArmorType'
  | 'DamageType'
  | 'AreaOfEffect'
  | 'CasterType'
  | 'Condition'
  | 'Language'
  | 'Skill'
  | 'WeaponProperty'
  | 'Background'
  | 'CharacterClass'
  | 'Race'
  | 'Feature'
  | 'Spell'
  | 'Equipment'
  | 'Pack'
  | 'Character'
  | 'Monster';

export declare type ImportItemType = 'ArmorType'
  | 'DamageType'
  | 'AreaOfEffect'
  | 'Background'
  | 'CasterType'
  | 'CharacterClass'
  | 'Subclass'
  | 'Condition'
  | 'Feature'
  | 'AmmoCategory'
  | 'Ammo'
  | 'BasicAmmo'
  | 'ArmorCategory'
  | 'Armor'
  | 'BasicArmor'
  | 'ContainerCategory'
  | 'GearCategory'
  | 'Gear'
  | 'MountCategory'
  | 'Mount'
  | 'BasicMount'
  | 'Tool'
  | 'ToolCategory'
  | 'ToolCategoryType'
  | 'WeaponCategory'
  | 'Weapon'
  | 'BasicWeapon'
  | 'MagicalItem'
  | 'MagicalItemCategory'
  | 'Treasure'
  | 'TreasureCategory'
  | 'Pack'
  | 'PackCategory'
  | 'EmptySlotItem'
  | 'Language'
  | 'Race'
  | 'Skill'
  | 'Spell'
  | 'WeaponProperty'
  | 'Character'
  | 'Monster'
  | 'MonsterAction'
  | 'MonsterFeature';

export class ImportListObject {
  id: number;
  name: string;
  description: string;
}

export class ImportLevel {
  id: number;
  level: number;
  minExp: number;
  profBonus: number;
}

export class ImportAbility {
  name: string;
  abbr: string;
  id: number;
}

export class ImportAbilityModifier {
  name: string;
  abbr: string;
  id: number;
  miscModifier: number;
  raceModifier: number;
  roll: number;
}

export class ImportAdvantage extends ImportItem {
  advantage: boolean;
  disadvantage: boolean;
}

export class ImportArmorType extends ImportItem {
  doff: number;
  doffTimeUnit: ImportTimeUnit;
  don: number;
  donTimeUnit: ImportTimeUnit;
}

export declare type ImportTimeUnit = ''
  | 'standard action(s)'
  | 'move action(s)'
  | 'free action(s)'
  | 'second(s)'
  | 'minute(s)'
  | 'hour(s)'

export class ImportCasterType extends ImportItem {
  id: number;
  multiClassWeight: number;
  roundUp: boolean;
  spellSlots: ImportSpellSlots[]
}

export class ImportSpellSlots extends ImportItem {
  level: ImportLevel;
  slot1: number;
  slot2: number;
  slot3: number;
  slot4: number;
  slot5: number;
  slot6: number;
  slot7: number;
  slot8: number;
  slot9: number;
}

export class ImportCondition extends ImportItem {
  description: string;
}

export class ImportLanguage extends ImportItem {
  script: string;
  hash: string;
}

export class ImportSkill extends ImportItem {
  abilityModifier: ImportAbility;
  description: string;
  id: number;
}

export class ImportCreatureSkill extends ImportItem {
  abilityModifier: ImportAbilityModifier;
  description: string;
  id: number;
  prof: boolean;
  miscModifier: number;
  advantage: ImportAdvantage;
  doubleProf: boolean;
  halveProf: boolean;
  roundUp: boolean;
}

export class ImportWeaponProperty extends ImportItem {
  description: string;
}

export class ImportBackgroundDetail {
  backgroundDetailType: ImportBackgroundDetailType;
  description: string;
  id: number
}

export declare type ImportBackgroundDetailType = 'VARIATION'
  | 'PERSONALITY'
  | 'IDEAL'
  | 'BOND'
  | 'FLAW';

export class ImportBackground extends ImportItem {
  description: string;
  variations: ImportBackgroundDetail[];
  personalities: ImportBackgroundDetail[];
  ideals: ImportBackgroundDetail[];
  bonds: ImportBackgroundDetail[];
  flaws: ImportBackgroundDetail[];
  armorProfs: ImportListObject[];
  armorTypeProfs: ImportListObject[];
  languageProfs: ImportListObject[];
  numLanguages: number;
  toolProfs: ImportListObject[];
  toolCategoriesToChooseFrom: ImportListObject[];
  numTools: number;
  savingThrowProfs: ImportListObject[];
  skillProfs: ImportListObject[];
  weaponProfs: ImportListObject[];
  weaponTypeProfs: ImportListObject[];
  parentBackground: ImportBackground;
  skills: ImportSkill[];
}

export class ImportSpellConfiguration {
  alwaysPrepared: boolean;
  countTowardsPrepared: boolean;
  id: number;
  levelGained: number;
  notes: string;
  spell: ImportListObject;
}

export class ImportSubClass extends ImportItem {
  // "type" : "Subclass",
  casterType: ImportCasterType;
  configurations: ImportSpellConfiguration[];
  description: string;
  id: number;
}

export class ImportCharacterClass extends ImportItem {
  casterType: ImportCasterType;

  armorProfs: ImportListObject[];
  armorSecondaryProfs: ImportListObject[];
  armorTypeProfs: ImportListObject[];
  armorTypeSecondaryProfs: ImportListObject[];
  languageProfs: ImportListObject[];
  languageSecondaryProfs: ImportListObject[];
  toolProfs: ImportListObject[];
  toolSecondaryProfs: ImportListObject[];
  toolCategoriesToChooseFrom: ImportListObject[];
  numTools: number;
  savingThrowProfs: ImportListObject[];
  savingThrowSecondaryProfs: ImportListObject[];
  skillProfs: ImportListObject[];
  skillSecondaryProfs: ImportListObject[];
  numSkills: number;
  weaponProfs: ImportListObject[];
  weaponSecondaryProfs: ImportListObject[];
  weaponTypeProfs: ImportListObject[];
  weaponTypeSecondaryProfs: ImportListObject[];

  skills: ImportSkill[];
  secondarySkills: ImportSkill[];
  classSkills: ImportSkill[];

  classSpells: ImportListObject[];

  abilityScoreIncreases: number[];
  goldDiceSize: ImportDiceSize;
  hitDice: number;
  hitDiceSize: ImportDiceSize;
  hpAtFirst: number;
  hpAtFirstModifierId: number;
  hpGainDice: number;
  hpGainDiceSize: ImportDiceSize;
  hpGainModifierId: number;
  id: number;
  numGoldDice: number;
  numGoldMod: number;
  prepareAbilityId: number;
  prepareClassLevel: boolean;
  prepareMod: number;
  requiresSpellPreparation: boolean;
  spellCastingAbilityId: number;

  subclasses: ImportSubClass[];
}

export declare type ImportSize = 'Tiny'
  | 'Small'
  | 'Medium'
  | 'Large'
  | 'Huge'
  | 'Gargantuan';

export class ImportRace extends ImportItem {
  strMod: number;
  dexMod: number;
  intMod: number;
  conMod: number;
  wisMod: number;
  chaMod: number;
  speed: number;
  crawlingSpeed: number;
  climbingSpeed: number;
  swimmingSpeed: number;
  burrowSpeed: number;
  flyingSpeed: number;
  size: ImportSize;
  armorProfs: ImportListObject[];
  armorTypeProfs: ImportListObject[];
  languageProfs: ImportListObject[];
  numLanguages: number;
  toolProfs: ImportListObject[];
  savingThrowProfs: ImportListObject[];
  numAbilities: number;
  skillProfs: ImportListObject[];
  weaponProfs: ImportListObject[];
  weaponTypeProfs: ImportListObject[];
  skills: ImportSkill[];
  parentRace: ImportRace;
}

export class ImportAreaOfEffect extends ImportItem {
  // "type" : "AreaOfEffect",
  description: string;
}

export declare type ImportFeatureCategory = 'FEAT'
  | 'CLASS'
  | 'RACE'
  | 'BACKGROUND';

export class ImportFeature extends ImportItem {
  // "type" : "Feature",
  hasAreaOfEffect: boolean;
  areaOfEffect: ImportAreaOfEffect;
  background: ImportListObject;
  category: ImportFeatureCategory;
  characterClass: ImportListObject;
  description: string;
  id: number;
  minimumLevel: number;
  race: ImportListObject;
  ranged: boolean
  range: string;
  subclass: ImportListObject;
}

export declare type ImportCastingTimeUnit = 'action'
  | 'bonus action'
  | 'reaction'
  | 'second'
  | 'seconds'
  | 'minute'
  | 'minutes'
  | 'hour'
  | 'hours';

export class ImportSpellSchool extends ImportItem {
  // "type" : "School",
  description: string;
  // id: number;
}

export class ImportSpell extends ImportItem {
  // "type" : "Spell",
  level: number;
  school: ImportSpellSchool;
  ritual: boolean;
  castingTime: number;
  castingTimeUnits: ImportCastingTimeUnit;
  reactionTrigger: string;
  range: string;
  hasAreaOfEffect: boolean;
  areaOfEffect: ImportAreaOfEffect;
  v: boolean;
  s: boolean;
  m: boolean;
  components: string;
  classes: ImportListObject[];
  duration: string;
  instantaneous: boolean;
  concentration: boolean;
  description: string;
  higherLevels: string;
  preparedClassId: number;
  spellTags: number[];
}

export class ImportSpellTag {
  // "type" : "SpellTag",
  color: string;
  id: number;
  name: string;
}

export declare type ImportCostUnit = 'PP'
  | 'GP'
  | 'EP'
  | 'SP'
  | 'CP';

export declare type ImportDiceSize = 0
  | 1
  | 2
  | 3
  | 4
  | 6
  | 8
  | 10
  | 12
  | 20
  | 100;

export declare type ImportDiceSizeEnum =
  'ONE'
  | 'TWO'
  | 'THREE'
  | 'FOUR'
  | 'SIX'
  | 'EIGHT'
  | 'TEN'
  | 'TWELVE'
  | 'TWENTY'
  | 'ONE_HUNDRED';

export declare type ImportDamageType = ''
  | 'acid'
  | 'bludgeoning'
  | 'cold'
  | 'fire'
  | 'force'
  | 'lightning'
  | 'necrotic'
  | 'piercing'
  | 'poison'
  | 'psychic'
  | 'radiant'
  | 'slashing'
  | 'thunder';

export declare type ImportConditionId =
  1 //Blinded
  | 2 //Charmed
  | 3 //Deafened
  | 4 //Frightened
  | 5 //Grappled
  | 6 //Incapacitated
  | 7 //Invisible
  | 8 //Paralyzed
  | 9 //Petrified
  | 10 //Poisoned
  | 11 //Prone
  | 12 //Restrained
  | 13 //Stunned
  | 14 //Unconscious
  | 15; //Exhaustion

export class ImportDamageTypeItem extends ImportItem {
}

export class ImportEquipment extends ImportItem {
}

export class ImportEquipmentObject extends ImportEquipment {
  quantity: number;
  characterItemId: number;
  containerId: number;
  dropped: boolean;
  poisoned: boolean;
  silvered: boolean;
  attuned: boolean;
  cursed: boolean;
  charges: number;
  equippedSlot: ImportEquipmentSlot;
}

export class ImportEquipmentSlot {
  id: number;
  name: string;
  equipmentSlotType: ImportEquipmentSlotType;
}

export class ImportAmmoCategory extends ImportEquipment {
  // "type" : "AmmoCategory",
  cost: number;
  costUnits: ImportCostUnit;
  id: number;
  notes: string;
  weight: number;
}

export class ImportAmmoObject extends ImportEquipmentObject {
  category: ImportAmmoCategory;
}

export class ImportBasicAmmo extends ImportAmmoObject {
  // "type" : "BasicAmmo",
  constructor(name: string, category: ImportAmmoCategory) {
    super();
    this.type = 'BasicAmmo';
    this.name = name;
    this.category = category;
  }
}

export class ImportAmmo extends ImportAmmoObject {
  // "type" : "Ammo",
  id: number;
  attackMod: number;
  cost: number;
  costUnits: ImportCostUnit;
  damageMod: number;
  damageType: ImportDamageType;
  damageTypeImportItem: ImportDamageTypeItem;
  notes: string;
  weight: number;
}

export class ImportArmorCategory extends ImportEquipment {
  // "type" : "ArmorCategory",
  ac: number;
  armorType: ImportArmorType;
  cost: number;
  costUnits: ImportCostUnit;
  equipmentSlotType: ImportEquipmentSlotType;
  id: number;
  ignoreWeightOfContents: boolean;
  maxDexMod: number;
  minStr: number;
  notes: string;
  savingThrowMod: number;
  stealthDisadvantage: boolean;
  weight: number;
  container: boolean;
}

export class ImportArmorObject extends ImportEquipmentObject {
  category: ImportArmorCategory;
  container: ImportContainerObject;
}

export class ImportBasicArmor extends ImportArmorObject {
  // "type" : "BasicArmor",

  constructor(name: string, category: ImportArmorCategory) {
    super();
    this.type = 'BasicArmor';
    this.name = name;
    this.category = category;
  }
}

export class ImportArmor extends ImportArmorObject {
  // "type" : "Armor",
  acMod: number;
  cost: number;
  costUnits: ImportCostUnit;
  id: number;
  notes: string;
  savingThrowMod: number;
  weight: number;
}

export class ImportGearCategory extends ImportEquipment {
  // "type" : "GearCategory",
  cost: number;
  costUnits: ImportCostUnit;
  equipmentSlotType: ImportEquipmentSlotType;
  equippable: boolean;
  id: number;
  ignoreWeightOfContents: boolean;
  notes: string;
  useable: boolean;
  weight: number;
  container: boolean;
}

export class ImportGear extends ImportEquipmentObject {
  // "type" : "Gear",
  category: ImportGearCategory;
  container: ImportContainerObject;

  constructor(name: string, category: ImportGearCategory) {
    super();
    this.type = 'Gear';
    this.name = name;
    this.category = category;
  }
}

export class ImportToolCategoryType extends ImportItem {
  // "type" : "ToolCategoryType",
  description: string;
  id: number;
}

export class ImportToolCategory extends ImportEquipment {
  // "type" : "ToolCategory",
  categoryType: ImportToolCategoryType;
  cost: number;
  costUnits: ImportCostUnit;
  equipmentSlotType: ImportEquipmentSlotType;
  equippable: boolean;
  id: number;
  ignoreWeightOfContents: boolean;
  notes: string;
  useable: boolean;
  weight: number;
  container: boolean;
}

export class ImportTool extends ImportEquipmentObject {
  // "type" : "Tool",
  category: ImportToolCategory;
  container: ImportContainerObject;

  constructor(name: string, category: ImportToolCategory) {
    super();
    this.type = 'Tool';
    this.name = name;
    this.category = category;
  }
}

export class ImportEquipmentSlotType {
  // "type" : "EquipSlotType",
  name: ImportEquipmentSlotTypeName;
}

export declare type ImportEquipmentSlotTypeName = 'None'
  | 'Hand'
  | 'Body'
  | 'Back'
  | 'Neck'
  | 'Gloves'
  | 'Finger'
  | 'Head'
  | 'Waist'
  | 'Feet'
  | 'Mount'

export class ImportWeaponType extends ImportItem {
  // "type" : "WeaponType",
  name: ImportWeaponTypeName;
}

export declare type ImportWeaponTypeName = 'Simple'
  | 'Martial'

export class ImportWeaponCategory extends ImportEquipment {
  // "type" : "WeaponCategory",
  ammo: ImportAmmoCategory;
  cost: number;
  costUnits: ImportCostUnit;
  damageDice: number;
  damageDiceSize: ImportDiceSize;
  damageType: ImportDamageType;
  damageTypeImportItem: ImportDamageTypeItem;
  equipmentSlotType: ImportEquipmentSlotType;
  id: number;
  melee: boolean;
  notes: string;
  properties: ImportListObject[];
  propertyItems: ImportWeaponProperty[];
  rangeLong: number;
  rangeNormal: number;
  versatileDamageDice: number;
  versatileDamageDiceSize: ImportDiceSize;
  weaponType: ImportWeaponType;
  weight: number;
}

export class ImportWeaponObject extends ImportEquipmentObject {
  category: ImportWeaponCategory;
}

export class ImportBasicWeapon extends ImportWeaponObject {
  // "type" : "BasicWeapon",
  constructor(name: string, category: ImportWeaponCategory) {
    super();
    this.type = 'BasicWeapon';
    this.name = name;
    this.category = category;
  }
}

export class ImportWeapon extends ImportWeaponObject {
  // "type" : "Weapon",
  ammo: ImportAmmoCategory;
  attackModifier: number;
  cost: number;
  costUnits: ImportCostUnit;
  damageModifier: number;
  id: number;
  notes: string;
  properties: ImportListObject[];
  propertyItems: ImportWeaponProperty[];
  rangeLong: number;
  rangeNormal: number;
  versatileDamageDice: number;
  versatileDamageDiceSize: ImportDiceSize;
  weight: number;
}

export class ImportMountCategory extends ImportEquipment {
  // "type" : "MountCategory",
  carryingCapacity: number;
  cost: number;
  costUnits: ImportCostUnit;
  equipmentSlotType: ImportEquipmentSlotType;
  id: number;
  notes: string;
  speed: number;
}

export class ImportMountObject extends ImportEquipmentObject {
  category: ImportMountCategory;
  container: ImportContainerObject;
}

export class ImportBasicMount extends ImportMountObject {
  // "type" : "BasicMount",
  constructor(name: string, category: ImportMountCategory) {
    super();
    this.type = 'BasicMount';
    this.name = name;
    this.category = category;
  }
}

export class ImportMount extends ImportMountObject {
  // "type" : "Mount",
  carryingCapacityMod: number;
  cost: number;
  costUnits: ImportCostUnit;
  id: number;
  notes: string;
  speedMod: number;
}

export class ImportTreasureCategory extends ImportEquipment {
  // "type" : "TreasureCategory",
  cost: number;
  costUnits: ImportCostUnit;
  id: number;
  notes: string;
  weight: number;
}

export class ImportTreasure extends ImportEquipmentObject {
  // "type" : "Treasure",
  category: ImportTreasureCategory;

  constructor(name: string, category: ImportTreasureCategory) {
    super();
    this.type = 'Treasure';
    this.name = name;
    this.category = category;
  }
}

export class ImportPackCategory extends ImportEquipment {
  // "type" : "PackCategory",
  id: number;
  items: ImportEquipmentObject[];
}

export class ImportPack extends ImportEquipmentObject {
  // "type" : "Pack",
  category: ImportPackCategory;

  constructor(name: string, category: ImportPackCategory) {
    super();
    this.type = 'Pack';
    this.name = name;
    this.category = category;
  }
}

export declare type ImportAttackType =
  1 //MELEE_ATTACK
  | 2 //RANGED_ATTACK
  | 3 //THROWN_ATTACK

export declare type ImportAttackTypeEnum =
  'ATTACK'
  | 'RANGED'
  | 'THROWN'
  | 'SAVE'
  | 'HEAL';

export class ImportAttackDamage {
  // "type" : "AttackDamage",
  attackType: ImportAttackType;
  damageAbility: ImportAbility;
  damageMod: number;
  damageType: ImportDamageType;
  damageTypeImportItem: ImportDamageTypeItem;
  diceSize: ImportDiceSizeEnum;
  numDice: number;
  quickAttackId: number;
}

export declare type ImportRarity =
  'COMMON'
  | 'UNCOMMON'
  | 'RARE'
  | 'VERY_RARE'
  | 'LEGENDARY';

export declare type ImportMagicalItemType =
  'ARMOR'
  | 'POTION'
  | 'RING'
  | 'ROD'
  | 'SCROLL'
  | 'STAFF'
  | 'WAND'
  | 'WEAPON'
  | 'WONDROUS';

export class ImportMagicalItemCategory extends ImportEquipment {
  // "type" : "MagicalItemCategory",
  acMod: number;
  additionalSpells: boolean;
  armorCategories: ImportListObject[];
  armorTypes: ImportListObject[];
  attackDamages: ImportAttackDamage[];
  attackMod: number;
  attunement: boolean;
  chanceOfDestruction: boolean;
  cost: number;
  costUnits: ImportCostUnit;
  curseEffect: string;
  cursed: boolean;
  equipmentSlotType: ImportEquipmentSlotType;
  equippable: boolean;
  hasCharges: boolean;
  id: number;
  ignoreWeightOfContents: boolean;
  maxCharges: number;
  notes: string;

  rarity: ImportRarity;
  rechargeRateDiceSize: ImportDiceSize;
  rechargeRateMod: number;
  rechargeRateNumDice: number;
  rechargeable: boolean;
  spells: ImportSpell[];
  tableContent: string; //"H1<COLUMN_BREAK>H2<ROW_BREAK>A<COLUMN_BREAK>C<ROW_BREAK>B<COLUMN_BREAK>D";
  magicalItemType: ImportMagicalItemType;
  useable: boolean;
  weaponCategories: ImportListObject[];
  weaponTypes: ImportListObject[];
  weight: number;
  container: boolean;
  vehicle: boolean;
}

export class ImportStoredSpell {
  spell: ImportSpell;
  level: number;
}

export class ImportMagicalItem extends ImportEquipmentObject {
  // "type" : "MagicalItem",
  category: ImportMagicalItemCategory;
  container: ImportContainerObject;

  spells: ImportStoredSpell[];
  chosenWeapon: ImportWeaponObject;
  chosenAmmo: ImportAmmoObject;
  chosenArmor: ImportArmorObject;

  constructor(name: string, category: ImportMagicalItemCategory) {
    super();
    this.type = 'MagicalItem';
    this.name = name;
    this.category = category;
  }
}

export class ImportContainerCategory extends ImportEquipment {
  // "type" : "ContainerCategory",
  id: number;
  name: string;
  cost: number;
  costUnits: string;
  weightEmpty: number;
  weightFull: number;
  ignoreWeightOfContents: boolean;
  notes: string;
  capacity: string;
}

export class ImportContainerObject extends ImportEquipmentObject {
  // "type" : "ContainerObject",
  category: ImportContainerCategory;
}

export class ImportEmptySlotItem extends ImportEquipmentObject {
  // "type" : "EmptySlotItem",
  id: number;
}

export class ImportInUseItem extends ImportEquipmentObject {
  equipmentSlot: ImportEquipmentSlot;
  name: string;
  otherObject: ImportEquipmentObject;
}

export declare type ImportEquipmentFrom = 'EQUIPPED'
  | 'CARRIED'
  | 'DROPPED'
  | 'AMMO'
  | 'MOUNT'
  | 'MOUNT_STABLED'
  | 'ADD'
  | 'CHOOSE_FROM_SPELLS'
  | 'CHOOSE_FROM_FEATURES'
  | 'MANAGE_MODE'
  | 'VEHICLES'
  | 'EXPENDED_AMMO'
  | 'MAGICAL_ITEM';

export declare type ImportEquipmentType = 'BASIC_WEAPON'
  | 'WEAPON'
  | 'BASIC_ARMOR'
  | 'ARMOR'
  | 'GEAR'
  | 'TOOL'
  | 'BASIC_AMMO'
  | 'AMMO'
  | 'BASIC_MOUNT'
  | 'MOUNT'
  | 'EMPTY'
  | 'IN_USE'
  | 'CONTAINER'
  | 'MAGICAL_ITEM'
  | 'TREASURE'
  | 'PACK';

export class ImportCreature extends ImportItem {
  str: ImportAbilityModifier;
  dex: ImportAbilityModifier;
  con: ImportAbilityModifier;
  intelligence: ImportAbilityModifier;
  wis: ImportAbilityModifier;
  cha: ImportAbilityModifier;
  wealth: ImportWealth;
  skillProfs: ImportCreatureSkill[];
  alignment: ImportAlignment;
  conditionImmunities: ImportConditionId[];
  damageModifiers: ImportDamageModifier[];
  items: ImportEquipmentObject[];
  languageProfs: ImportListObject[];
  spells: ImportSpell[];
}

export declare type ImportDamageModifierType =
  'NORMAL'
  | 'RESISTANT'
  | 'IMMUNE'
  | 'VULNERABLE';

export declare type ImportGender =
  'Male'
  | 'Female'
  | 'Neutral';

export declare type ImportCreatureState =
  'Conscious'
  | 'Unconscious'
  | 'Dead'
  | 'Removed'
  | 'Unstable'
  | 'Stable';

export declare type ImportAlignment =
  'Lawful Good'
  | 'Neutral Good'
  | 'Chaotic Good'
  | 'Lawful Neutral'
  | 'Neutral'
  | 'Chaotic Neutral'
  | 'Lawful Evil'
  | 'Neutral Evil'
  | 'Chaotic Evil';

export class ImportDamageModifier {
  // "type" : "DamageModifier",
  condition: string;
  damageModifierType: ImportDamageModifierType;
  damageType: ImportDamageType;
}

export class ImportSpeedModifier {
  burrowSpeedModifier: number;
  climbingRoundUp: boolean;
  climbingSpeedModifier: number;
  climbingUseHalf: boolean;
  crawlingRoundUp: boolean;
  crawlingSpeedModifier: number;
  crawlingUseHalf: boolean;
  flyingSpeedModifier: number;
  speedModifier: number;
  swimmingRoundUp: boolean;
  swimmingSpeedModifier: number;
  swimmingUseHalf: boolean;
}

export class ImportWealth {
  cp: number;
  ep: number;
  gp: number;
  pp: number;
  sp: number;
}

export class ImportChosenClassSubclass {
  // "type" : "ChosenClassSubclass",
  characterClass: ImportCharacterClass;
  classLevel: number;
  healthGainResults: number[];
  hitDiceMod: number;
  subclass: ImportSubClass;
}

export class ImportCompanion {
  currentHp: number;
  id: number;
  killedStatus: ImportCreatureState;
  maxHP: number;
  maxHpMod: number;
  monster: ImportMonster;
  name: string;
  numDeathSaveThrowFailures: number;
  numDeathSaveThrowSuccesses: number;
  tempHp: number;
}

export declare type ImportFeatureAbilityType =
  'QUANTITY'
  | 'DICE'
  | 'COUNTER';

export class ImportFeatureAbility {
  // "type" : "FeatureAbility",
  diceSize: ImportDiceSize;
  featureAbilityType: ImportFeatureAbilityType;
  featureId: number;
  maxQuantity: number;
  name: string;
  quantityRemaining: number;
  regainOnLongRest: boolean;
  regainOnShortRest: boolean;
}

export declare type ImportLimitedUseType =
  'NUM_PER_DAY'
  | 'RECHARGE_RANGE';

export class ImportLimitedUse {
  limitedUse: boolean;
  limitedUseType: ImportLimitedUseType;
  numPerDay: number;
  numUsesRemaining: number;
  rechargeMax: number;
  rechargeMin: number;
  rechargeOnLongRest: boolean;
  rechargeOnShortRest: boolean;
}

export class ImportInnateSpell {
  // "type" : "InnateSpell",
  limitedUse: ImportLimitedUse;
  spell: ImportSpell;
}

export declare type ImportQuickAttackType =
  'WEAPON'
  | 'SPELL'
  | 'FEATURE'
  | 'OTHER'
  | 'MAGIC_ITEM'
  | 'INNATE_SPELL';

export class ImportQuickAttack {
  name: string;
  quickAttackType: ImportQuickAttackType;
  attackDamages: ImportAttackDamage[];
  secondaryId: number;
  attackMod: number;
}

export class ImportQuickAttackSpell extends ImportQuickAttack {
  // "type" : "QuickAttackSpell",
  baseLevelSlot: number;
  extraDamages: ImportAttackDamage[];
  halfOnMissSave: false;
  innate: false;
  numLevelsAbove: number;
  saveType: ImportAbility;
  spell: ImportSpell;
  spellCastingAbility: ImportAbility;
}

export class ImportQuickAttackFeature extends ImportQuickAttack {
  // "type" : "QuickAttackFeature",
  ability: ImportAbility;
  addProf: boolean;
  attackType: ImportAttackTypeEnum;
  feature: ImportFeature;
  halfOnMissSave: boolean;
  saveType: ImportAbility;
}

export class ImportQuickAttackWeapon extends ImportQuickAttack {
  // "type" : "QuickAttackWeapon",
  item: ImportEquipmentObject;
  meleeAbility: ImportAbility;
  rangedAbility: ImportAbility;
  thrownAbility: ImportAbility;
  useProf: boolean;
  useTwoHands: boolean;
}

export class ImportQuickAttackMagicalItem extends ImportQuickAttack {
  // "type" : "QuickAttackMagicalItem",
  ability: ImportAbility;
  addProf: boolean;
  attackType: ImportAttackTypeEnum;
  baseSpellLevel: number;
  expendSpell: boolean;
  extraDamages: ImportAttackDamage[];
  halfOnMissSave: boolean;
  magicalItem: ImportMagicalItem;
  numChargesAbove: number;
  numChargesUsed: number;
  saveType: ImportAbility;
  stored: boolean;
  spell: ImportSpell;
}

export class ImportDeity extends ImportItem {
}

export class ImportPlayerCharacter extends ImportCreature {
  // "type" : "Character",
  age: number;
  armorProfs: ImportListObject[];
  armorTypeProfs: ImportListObject[];
  background: string;
  bio: string;
  bonds: string;
  carryMod: number;
  carryingWeightModifier: number;
  chaMod: number;
  chaRaceModified: boolean;
  chaSaveAdvantage: ImportAdvantage;
  chaSaveMod: number;
  chosenBackground: ImportBackground;
  chosenBond: number;
  chosenClassSubclasses: ImportChosenClassSubclass[];
  chosenFlaw: number;
  chosenIdeal: number;
  chosenPersonality: number;
  chosenPersonalityTwo: number;
  chosenVariation: number;
  classPreparationModifiers: Map<number, number>;
  companions: ImportCompanion[];
  conMod: number;
  conRaceModified: boolean;
  conSaveAdvantage: ImportAdvantage;
  conSaveMod: number;
  conditionFilters: ImportCondition[];
  conditionsList: ImportCondition[];
  currentHP: number;
  currentState: ImportCreatureState;
  customSpellCastingAbilityId: number;
  deity: string;
  dexMod: number;
  dexRaceModified: boolean;
  dexSaveAdvantage: ImportAdvantage;
  dexSaveMod: number;
  exhaustionLevel: number;
  exp: number;
  eyes: string;
  featureAbilities: ImportFeatureAbility[];
  features: ImportFeature[];
  flaws: string;
  gender: ImportGender;
  hair: string;
  height: string;
  hitDiceModifier: number;
  hitDiceRemaining: number[];
  hpAtFirstModifier: number;
  hpGainModifier: number;
  ideals: string;
  initAdvantage: ImportAdvantage;
  initMod: number;
  innateSpellAttackAdvantage: ImportAdvantage;
  innateSpellAttackModifier: number;
  innateSpellCastingAbilityId: number;
  innateSpellSaveDCModifier: number;
  innateSpells: ImportInnateSpell[];
  inspiration: boolean;
  intMod: number;
  intRaceModified: boolean;
  intSaveAdvantage: ImportAdvantage;
  intSaveMod: number;
  level: ImportLevel;
  maxHpModifier: number;
  notes: ImportListObject[];
  numDeathSaveThrowFailures: number;
  numDeathSaveThrowSuccesses: number;
  passiveInvestigationMod: number;
  passivePerceptionMod: number;
  personality: string;
  profMod: number;
  pushMod: number;
  quickAttacks: ImportQuickAttack[];
  race: ImportRace;
  restrictToTwenty: boolean;
  resurrectionPenalty: 0;
  savingThrowProfs: ImportListObject[];
  showAutoLevelUpPopup: boolean;
  skillFilters: ImportListObject[];
  skin: string;
  speedModifiers: ImportSpeedModifier;
  spellAttackAdvantage: ImportAdvantage;
  spellAttackModifier: number;
  spellSaveDCModifier: number;
  spellSlotModifiers: number[];
  spellSlotsAvailable: number[];
  spellTags: ImportSpellTag[];
  strMod: number;
  strRaceModified: boolean;
  strSaveAdvantage: ImportAdvantage;
  strSaveMod: number;
  tempHP: number;
  toolProfs: ImportListObject[];
  useHalfMaxResult: boolean;
  useMax: boolean;
  usedArcaneRecovery: boolean;
  weaponProfs: ImportListObject[];
  weaponTypeProfs: ImportListObject[];
  weight: number;
  wisMod: number;
  wisRaceModified: boolean;
  wisSaveAdvantage: ImportAdvantage;
  wisSaveMod: number;
  autoConvertCurrency: boolean;
  calculateCurrencyWeight: boolean;
  acMod: number;
  applyWeightPenalties: boolean;
}

export declare type ImportMonsterActionType =
  'NORMAL'
  | 'LEGENDARY'
  | 'LAIR'
  | 'REACTION';

export declare type ImportMonsterActionAttackType =
  'WEAPON_MELEE'
  | 'WEAPON_RANGED'
  | 'SPELL'
  | 'OTHER';

export class ImportMonsterAction extends ImportItem {
  attack: boolean;
  attackDamages: ImportAttackDamage[];
  attackMod: number;
  attackType: ImportAttackTypeEnum;
  baseLevelSlot: number;
  extraDamages: ImportAttackDamage[];
  halfOnMissSave: boolean;
  innate: boolean;
  legendaryCost: number;
  limitedUse: boolean;
  limitedUseType: ImportLimitedUseType;
  monsterActionAttackType: ImportMonsterActionAttackType;
  monsterActionType: ImportMonsterActionType;
  nonAttackSpell: boolean;
  notes: string;
  numLevelsAbove: number;
  numPerDay: number;
  numUsesRemaining: number;
  range: string;
  rechargeMax: number;
  rechargeMin: number;
  rechargeOnLongRest: boolean;
  rechargeOnShortRest: boolean;
  saveMod: number;
  saveType: ImportAbility;
  ammo: ImportAmmoObject;
  spell: ImportSpell;
}

export declare type ImportChallengeRating =
  'ZERO'
  | 'EIGHTH'
  | 'QUARTER'
  | 'HALF'
  | 'ONE'
  | 'TWO'
  | 'THREE'
  | 'FOUR'
  | 'FIVE'
  | 'SIX'
  | 'SEVEN'
  | 'EIGHT'
  | 'NINE'
  | 'TEN'
  | 'ELEVEN'
  | 'TWELVE'
  | 'THIRTEEN'
  | 'FOURTEEN'
  | 'FIFTEEN'
  | 'SIXTEEN'
  | 'SEVENTEEN'
  | 'EIGHTEEN'
  | 'NINETEEN'
  | 'TWENTY'
  | 'TWENTY_ONE'
  | 'TWENTY_TWO'
  | 'TWENTY_THREE'
  | 'TWENTY_FOUR'
  | 'TWENTY_FIVE'
  | 'TWENTY_SIX'
  | 'TWENTY_SEVEN'
  | 'TWENTY_EIGHT'
  | 'TWENTY_NINE'
  | 'THIRTY';

export class ImportMonsterFeature extends ImportItem {
  limitedUse: boolean;
  limitedUseType: ImportLimitedUseType;
  notes: string;
  numPerDay: number;
  numUsesRemaining: number;
  rechargeMax: number;
  rechargeMin: number;
  rechargeOnLongRest: boolean;
  rechargeOnShortRest: boolean;
}

export class ImportMonsterType {
  // "type" : "MonsterType",
  id: number;
  name: string;
}

export declare type ImportCreatureSenseType =
  'Blindsight'
  | 'Darkvision'
  | 'Telepathy'
  | 'Tremorsense'
  | 'Truesight';

export class ImportCreatureSense {
  // "type" : "MonsterSense",
  range: number;
  type: ImportCreatureSenseType;
}

export class ImportMonster extends ImportCreature {
  // "type" : "Monster",
  ac: number;
  actions: ImportMonsterAction[];
  speed: number;
  crawling: number;
  climbing: number;
  swimming: number;
  burrow: number;
  flying: number;
  hover: false;
  challengeRating: ImportChallengeRating;
  exp: number;
  features: ImportMonsterFeature[];
  hpDiceSize: ImportDiceSizeEnum;
  hpMod: number;
  hpNumDice: number;
  innateSpellAttackMod: number;
  innateSpellSaveDCMod: number;
  innateSpellcastingAbilityId: number;
  innateSpells: ImportSpell[];
  legendaryPoints: number;
  monsterType: ImportMonsterType;
  savingThrowProfs: number[];
  senses: ImportCreatureSense[];
  size: ImportSize;
  spellAttackMod: number;
  spellSaveDCMod: number;
  spellSlots: ImportSpellSlots;
  spellcaster: boolean;
  spellcastingAbilityId: number;
  typeVariation: string;
}
