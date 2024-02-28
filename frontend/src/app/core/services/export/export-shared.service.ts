import {Injectable} from '@angular/core';
import {SID} from '../../../constants';
import {ListObject} from '../../../shared/models/list-object';
import {CostUnit} from '../../../shared/models/items/cost-unit';
import {EquipmentSlotType} from '../../../shared/models/items/equipment-slot-type.enum';
import {DiceSize} from '../../../shared/models/dice-size.enum';
import {CastingTimeUnit} from '../../../shared/models/casting-time-unit.enum';
import {RangeType} from '../../../shared/models/powers/range-type.enum';
import {RangeUnit} from '../../../shared/models/powers/range-unit.enum';
import {MagicalItemType} from '../../../shared/models/items/magical-item-type.enum';
import {Size} from '../../../shared/models/size.enum';
import {ChallengeRating} from '../../../shared/models/creatures/monsters/challenge-rating.enum';
import {DamageModifierType} from '../../../shared/models/characteristics/damage-modifier-type.enum';
import {Sense} from '../../../shared/models/sense.enum';
import {LimitedUse} from '../../../shared/models/powers/limited-use';
import {LimitedUseType} from '../../../shared/models/limited-use-type.enum';
import {AttackType} from '../../../shared/models/attack-type.enum';
import {WeaponRangeType} from '../../../shared/models/items/weapon-range-type.enum';
import {Action} from '../../../shared/models/action.enum';
import {Rarity} from '../../../shared/models/items/rarity.enum';
import {CharacterLevel} from '../../../shared/models/character-level';
import {EquipmentSlot} from '../../../shared/models/items/equipment-slot';
import {min} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ExportSharedService {

  constructor() { }

  getAbilityId(sid: number): number {
    switch (sid) {
      case SID.ABILITIES.STRENGTH:
        return 1;
      case SID.ABILITIES.DEXTERITY:
        return 2;
      case SID.ABILITIES.CONSTITUTION:
        return 3;
      case SID.ABILITIES.INTELLIGENCE:
        return 4;
      case SID.ABILITIES.WISDOM:
        return 5;
      case SID.ABILITIES.CHARISMA:
        return 6;
    }
    return -1;
  }

  getArmorTypeId(sid: number): number {
    switch (sid) {
      case SID.ARMOR_TYPES.LIGHT:
        return 1;
      case SID.ARMOR_TYPES.MEDIUM:
        return 2;
      case SID.ARMOR_TYPES.HEAVY:
        return 3;
      case SID.ARMOR_TYPES.SHIELD:
        return 4;
    }
    return 0;
  }

  getArmorId(sid: number): number {
    switch (sid) {
      case SID.ARMORS.PADDED:
        return 1;
      case SID.ARMORS.LEATHER:
        return 2;
      case SID.ARMORS.STUDDED_LEATHER:
        return 3;
      case SID.ARMORS.HIDE_ARMOR:
        return 4;
      case SID.ARMORS.CHAIN_SHIRT:
        return 5;
      case SID.ARMORS.SCALE_MAIL:
        return 6;
      case SID.ARMORS.BREASTPLATE:
        return 7;
      case SID.ARMORS.HALF_PLATE:
        return 8;
      case SID.ARMORS.RING_MAIL:
        return 9;
      case SID.ARMORS.CHAIN_MAIL:
        return 10;
      case SID.ARMORS.SPLINT:
        return 11;
      case SID.ARMORS.PLATE:
        return 12;
      case SID.ARMORS.SHIELD:
        return 13;
    }
    return 0;
  }

  getWeaponTypeId(sid: number): number {
    switch (sid) {
      case SID.WEAPON_TYPES.SIMPLE:
        return 1;
      case SID.WEAPON_TYPES.MARTIAL:
        return 2;
    }
    return 0;
  }

  getAmmoId(sid: number): number {
    switch (sid) {
      case SID.AMMOS.ARROW:
        return 15;
      case SID.AMMOS.BLOWGUN_NEEDLE:
        return 16;
      case SID.AMMOS.CROSSBOW_BOLT:
        return 17;
      case SID.AMMOS.SLING_BULLET:
        return 18;
    }
  }

  getWeaponId(sid: number): number {
    switch (sid) {
      case SID.WEAPONS.CLUB:
        return 170;
      case SID.WEAPONS.DAGGER:
        return 171;
      case SID.WEAPONS.GREATCLUB:
        return 172;
      case SID.WEAPONS.HANDAXE:
        return 173;
      case SID.WEAPONS.JAVELIN:
        return 174;
      case SID.WEAPONS.LIGHT_HAMMER:
        return 175;
      case SID.WEAPONS.MACE:
        return 176;
      case SID.WEAPONS.QUARTERSTAFF:
        return 177;
      case SID.WEAPONS.SICKLE:
        return 178;
      case SID.WEAPONS.SPEAR:
        return 179;
      case SID.WEAPONS.UNARMED:
        return 180;
      case SID.WEAPONS.LIGHT_CROSSBOW:
        return 181;
      case SID.WEAPONS.DART:
        return 182;
      case SID.WEAPONS.SHORTBOW:
        return 183;
      case SID.WEAPONS.SLING:
        return 184;
      case SID.WEAPONS.BATTLEAXE:
        return 185;
      case SID.WEAPONS.FLAIL:
        return 186;
      case SID.WEAPONS.GLAIVE:
        return 187;
      case SID.WEAPONS.GREATAXE:
        return 188;
      case SID.WEAPONS.GREATSWORD:
        return 189;
      case SID.WEAPONS.HALBERD:
        return 190;
      case SID.WEAPONS.LANCE:
        return 191;
      case SID.WEAPONS.LONGSWORD:
        return 192;
      case SID.WEAPONS.MAUL:
        return 193;
      case SID.WEAPONS.MORNINGSTAR:
        return 194;
      case SID.WEAPONS.PIKE:
        return 195;
      case SID.WEAPONS.RAPIER:
        return 196;
      case SID.WEAPONS.SCIMITAR:
        return 197;
      case SID.WEAPONS.SHORTSWORD:
        return 198;
      case SID.WEAPONS.TRIDENT:
        return 199;
      case SID.WEAPONS.WAR_PICK:
        return 200;
      case SID.WEAPONS.WARHAMMER:
        return 201;
      case SID.WEAPONS.WHIP:
        return 202;
      case SID.WEAPONS.BLOWGUN:
        return 203;
      case SID.WEAPONS.HAND_CROSSBOW:
        return 204;
      case SID.WEAPONS.HEAVY_CROSSBOW:
        return 205;
      case SID.WEAPONS.LONGBOW:
        return 206;
      case SID.WEAPONS.NET:
        return 207;
    }
    return 0;
  }

  getToolCategoryId(sid: number): number {
    switch (sid) {
      case SID.TOOL_CATEGORIES.ARTISANS_TOOLS:
        return 1;
      case SID.TOOL_CATEGORIES.GAMING_SET:
        return 2;
      case SID.TOOL_CATEGORIES.MUSICAL_INSTRUMENT:
        return 3;
      case SID.TOOL_CATEGORIES.VEHICLES:
        return 4;
      case SID.TOOL_CATEGORIES.KITS:
        return 5;
      case SID.TOOL_CATEGORIES.PROFESSIONAL_TOOLS:
        return 6;
    }
    return 0;
  }

  getToolId(sid: number): number {
    switch (sid) {
      case SID.TOOLS.ALCHEMISTS_SUPPLIES:
        return 122;
      case SID.TOOLS.BREWERS_SUPPLIES:
        return 123;
      case SID.TOOLS.CALLIGRAPHERS_SUPPLIES:
        return 124;
      case SID.TOOLS.CARPENTERS_TOOLS:
        return 125;
      case SID.TOOLS.CARTOGRAPHERS_TOOLS:
        return 126;
      case SID.TOOLS.COBBLERS_TOOLS:
        return 127;
      case SID.TOOLS.COOKS_UTENSILES:
        return 128;
      case SID.TOOLS.GLASSBLOWERS_TOOLS:
        return 129;
      case SID.TOOLS.JEWELERS_TOOLS:
        return 130;
      case SID.TOOLS.LEATHERWORKERS_TOOLS:
        return 131;
      case SID.TOOLS.MASONS_TOOLS:
        return 132;
      case SID.TOOLS.PAINTERS_SUPPLIES:
        return 133;
      case SID.TOOLS.POTTERS_TOOLS:
        return 134;
      case SID.TOOLS.SMITHS_TOOLS:
        return 135;
      case SID.TOOLS.TINKERS_TOOLS:
        return 136;
      case SID.TOOLS.WEAVERS_TOOLS:
        return 137;
      case SID.TOOLS.WOODCARVERS_TOOLS:
        return 138;
      case SID.TOOLS.DISGUISE_KIT:
        return 139;
      case SID.TOOLS.FORGERY_KIT:
        return 140;
      case SID.TOOLS.DICE_SET:
        return 141;
      case SID.TOOLS.DRAGON_CHESS_SET:
        return 142;
      case SID.TOOLS.PLAYING_CARD_SET:
        return 143;
      case SID.TOOLS.THREE_DRAGON_ANTE_SET:
        return 144;
      case SID.TOOLS.HERBALISM_KIT:
        return 145;
      case SID.TOOLS.BAGPIPES:
        return 146;
      case SID.TOOLS.DRUM:
        return 147;
      case SID.TOOLS.DULCIMER:
        return 148;
      case SID.TOOLS.FLUTE:
        return 149;
      case SID.TOOLS.LUTE:
        return 150;
      case SID.TOOLS.LYRE:
        return 151;
      case SID.TOOLS.HORN:
        return 152;
      case SID.TOOLS.PAN_FLUTE:
        return 153;
      case SID.TOOLS.SHAWM:
        return 154;
      case SID.TOOLS.VIOL:
        return 155;
      case SID.TOOLS.NAVIGATORS_TOOLS:
        return 156;
      case SID.TOOLS.POISONERS_KIT:
        return 157;
      case SID.TOOLS.THIEVES_TOOLS:
        return 158;
      case SID.TOOLS.CARRIAGE:
        return 159;
      case SID.TOOLS.CART:
        return 160;
      case SID.TOOLS.CHARIOT:
        return 161;
      case SID.TOOLS.SLED:
        return 162;
      case SID.TOOLS.WAGON:
        return 163;
      case SID.TOOLS.GALLEY:
        return 164;
      case SID.TOOLS.KEELBOAT:
        return 165;
      case SID.TOOLS.LONGSHIP:
        return 166;
      case SID.TOOLS.ROWBOAT:
        return 167;
      case SID.TOOLS.SAILING_SHIP:
        return 168;
      case SID.TOOLS.WARSHIP:
        return 169;
    }
    return 0;
  }

  getSpellId(sid: number): number {
    // switch (sid) {
    //   case SID.SPELLS.ACID_ARROW:
    //     return 0;
    // }
    return 0;
  }

  getLanguageId(sid: number): number {
    switch (sid) {
      case SID.LANGUAGES.COMMON:
        return 1;
      case SID.LANGUAGES.DWARVISH:
        return 2;
      case SID.LANGUAGES.ELVISH:
        return 3;
      case SID.LANGUAGES.GIANT:
        return 4;
      case SID.LANGUAGES.GNOMISH:
        return 5;
      case SID.LANGUAGES.GOBLIN:
        return 6;
      case SID.LANGUAGES.HALFLING:
        return 7;
      case SID.LANGUAGES.ORC:
        return 8;
      case SID.LANGUAGES.ABYSALL:
        return 9;
      case SID.LANGUAGES.CELESTIAL:
        return 10;
      case SID.LANGUAGES.DRACONIC:
        return 11;
      case SID.LANGUAGES.DEEP_SPEECH:
        return 12;
      case SID.LANGUAGES.INFERNAL:
        return 13;
      case SID.LANGUAGES.PRIMORDIAL:
        return 14;
      case SID.LANGUAGES.SYLVAN:
        return 15;
      case SID.LANGUAGES.UNDERCOMMON:
        return 16;
      case SID.LANGUAGES.DRUIDIC:
        return 17;
      case SID.LANGUAGES.THIEVES_CANT:
        return 18;
    }
    return 0;
  }

  getSkillId(sid: number): number {
    switch (sid) {
      case SID.SKILLS.ACROBATICS:
        return 1;
      case SID.SKILLS.ANIMAL_HANDLING:
        return 2;
      case SID.SKILLS.ARCANA:
        return 3;
      case SID.SKILLS.ATHLETICS:
        return 4;
      case SID.SKILLS.DECEPTION:
        return 5;
      case SID.SKILLS.HISTORY:
        return 6;
      case SID.SKILLS.INSIGHT:
        return 7;
      case SID.SKILLS.INTIMIDIATION:
        return 8;
      case SID.SKILLS.INVESTIGATION:
        return 9;
      case SID.SKILLS.MEDICINE:
        return 10;
      case SID.SKILLS.NATURE:
        return 11;
      case SID.SKILLS.PERCEPTION:
        return 12;
      case SID.SKILLS.PERFORMANCE:
        return 13;
      case SID.SKILLS.PERSUASION:
        return 14;
      case SID.SKILLS.RELIGION:
        return 15;
      case SID.SKILLS.SLEIGHT_OF_HAND:
        return 16;
      case SID.SKILLS.STEALTH:
        return 17;
      case SID.SKILLS.SURVIVAL:
        return 18;
    }
    return 0;
  }

  getTimeUnit(timeUnit: string): string {
    switch (timeUnit) {
      case 'STANDARD':
        return 'standard action(s)';
      case 'MOVE':
        return 'move action(s)';
      case 'FREE':
        return 'free action(s)';
      case 'SECOND':
        return 'second(s)';
      case 'MINUTE':
        return 'minute(s)';
      case 'HOUR':
        return 'hour(s)';
      default:
        return '';
    }
  }

  processLevel(characterLevel: ListObject): object {
    const level = parseInt(characterLevel.name, 10);
    return this.processLevelByValue(level);
  }

  processLevelByValue(level: number): object {
    let minExp = 0;
    let profBonus = 0;
    switch (level) {
      case 1:
        minExp = 0;
        profBonus = 2;
        break;
      case 2:
        minExp = 300;
        profBonus = 2;
        break;
      case 3:
        minExp = 900;
        profBonus = 2;
        break;
      case 4:
        minExp = 2700;
        profBonus = 2;
        break;
      case 5:
        minExp = 6500;
        profBonus = 3;
        break;
      case 6:
        minExp = 14000;
        profBonus = 3;
        break;
      case 7:
        minExp = 23000;
        profBonus = 3;
        break;
      case 8:
        minExp = 34000;
        profBonus = 3;
        break;
      case 9:
        minExp = 48000;
        profBonus = 4;
        break;
      case 10:
        minExp = 64000;
        profBonus = 4;
        break;
      case 11:
        minExp = 85000;
        profBonus = 4;
        break;
      case 12:
        minExp = 100000;
        profBonus = 4;
        break;
      case 13:
        minExp = 120000;
        profBonus = 5;
        break;
      case 14:
        minExp = 140000;
        profBonus = 5;
        break;
      case 15:
        minExp = 165000;
        profBonus = 5;
        break;
      case 16:
        minExp = 195000;
        profBonus = 5;
        break;
      case 17:
        minExp = 225000;
        profBonus = 6;
        break;
      case 18:
        minExp = 265000;
        profBonus = 6;
        break;
      case 19:
        minExp = 305000;
        profBonus = 6;
        break;
      case 20:
        minExp = 355000;
        profBonus = 6;
        break;
    }

    return {
      'type': 'Level',
      'id': level,
      'level': level,
      'minExp': minExp,
      'profBonus': profBonus
    };
  }

  getLevel(characterLevel: CharacterLevel): number {
    if (characterLevel == null) {
      return 1;
    }
    return parseInt(characterLevel.name, 10);
  }

  getCostUnit(costUnit: CostUnit): string {
    return costUnit.abbreviation;
  }

  getEquipmentSlotType(slot: EquipmentSlotType): string {
    switch (slot) {
      case EquipmentSlotType.NONE:
        return 'None';
      case EquipmentSlotType.HAND:
        return 'Hand';
      case EquipmentSlotType.BODY:
        return 'Body';
      case EquipmentSlotType.BACK:
        return 'Back';
      case EquipmentSlotType.NECK:
        return 'Neck';
      case EquipmentSlotType.GLOVES:
        return 'Gloves';
      case EquipmentSlotType.FINGER:
        return 'Finger';
      case EquipmentSlotType.HEAD:
        return 'Head';
      case EquipmentSlotType.WAIST:
        return 'Waist';
      case EquipmentSlotType.FEET:
        return 'Feet';
      case EquipmentSlotType.MOUNT:
        return 'Mount';
    }
    return 'None'
  }

  getDiceSize(diceSize: DiceSize, minimum: number = 1): number {
    switch (diceSize) {
      case DiceSize.ONE:
        return minimum <= 1 ? 1 : minimum;
      case DiceSize.TWO:
        return minimum <= 2 ? 2 : minimum;
      case DiceSize.THREE:
        return minimum <= 3 ? 3 : minimum;
      case DiceSize.FOUR:
        return 4;
      case DiceSize.SIX:
        return 6;
      case DiceSize.EIGHT:
        return 8;
      case DiceSize.TEN:
        return 10;
      case DiceSize.TWELVE:
        return 12;
      case DiceSize.TWENTY:
        return 20;
      case DiceSize.HUNDRED:
        return 100;
    }
    return 4;
  }

  getDamageType(sid: number): string {
    switch (sid) {
      case SID.DAMAGE_TYPES.ACID:
        return 'acid';
      case SID.DAMAGE_TYPES.BLUDGEONING:
        return 'bludgeoning';
      case SID.DAMAGE_TYPES.COLD:
        return 'cold';
      case SID.DAMAGE_TYPES.FIRE:
        return 'fire';
      case SID.DAMAGE_TYPES.FORCE:
        return 'force';
      case SID.DAMAGE_TYPES.LIGHTNING:
        return 'lightning';
      case SID.DAMAGE_TYPES.NECROTIC:
        return 'necrotic';
      case SID.DAMAGE_TYPES.PIERCING:
        return 'piercing';
      case SID.DAMAGE_TYPES.POISON:
        return 'poison';
      case SID.DAMAGE_TYPES.PSYCHIC:
        return 'psychic';
      case SID.DAMAGE_TYPES.RADIANT:
        return 'radiant';
      case SID.DAMAGE_TYPES.SLASHING:
        return 'slashing';
      case SID.DAMAGE_TYPES.THUNDER:
        return 'thunder';
    }
    return '';
  }

  getCastingTimeUnit(castingTimeUnit: CastingTimeUnit, amount: number): string {
    switch (castingTimeUnit) {
      case CastingTimeUnit.ACTION:
        return 'action';
      case CastingTimeUnit.BONUS_ACTION:
        return 'bonus action';
      case CastingTimeUnit.REACTION:
        return 'reaction';
      case CastingTimeUnit.SECOND:
        return amount === 1 ? 'second' : 'seconds';
      case CastingTimeUnit.MINUTE:
        return amount === 1 ? 'minute' : 'minutes';
      case CastingTimeUnit.HOUR:
        return amount === 1 ? 'hour' : 'hours';
    }
  }

  getRange(rangeType: RangeType, range: number, rangeUnit: RangeUnit): string {
    switch (rangeType) {
      case RangeType.SELF:
        return 'self';
      case RangeType.TOUCH:
        return 'touch';
      case RangeType.SIGHT:
        return 'sight';
      case RangeType.UNLIMITED:
        return 'unlimited';
      case RangeType.OTHER:
        return `${range} ${this.getRangeUnit(rangeUnit)}`;
    }
  }

  getRangeUnit(rangeUnit: RangeUnit): string {
    switch (rangeUnit) {
      case RangeUnit.FEET:
        return 'ft';
      case RangeUnit.MILE:
        return 'mile';
    }
  }

  getSpellSchoolId(sid: number): number {
    switch (sid) {
      case SID.SCHOOLS.ABJURATION:
        return 1;
      case SID.SCHOOLS.CONJURATION:
        return 2;
      case SID.SCHOOLS.DEVINATION:
        return 3;
      case SID.SCHOOLS.ENCHANTMENT:
        return 4;
      case SID.SCHOOLS.EVOCATION:
        return 5;
      case SID.SCHOOLS.ILLUSION:
        return 6;
      case SID.SCHOOLS.NECROMANCY:
        return 7;
      case SID.SCHOOLS.TRANSMUTATION:
        return 8;
    }

    return 0;
  }

  getMagicalItemType(type: MagicalItemType): string {
    switch (type) {
      case MagicalItemType.AMMO:
        return 'WEAPON';
      case MagicalItemType.ARMOR:
        return 'ARMOR';
      case MagicalItemType.POTION:
        return 'POTION';
      case MagicalItemType.RING:
        return 'RING';
      case MagicalItemType.ROD:
        return 'ROD';
      case MagicalItemType.SCROLL:
        return 'SCROLL';
      case MagicalItemType.STAFF:
        return 'STAFF';
      case MagicalItemType.WAND:
        return 'WAND';
      case MagicalItemType.WEAPON:
        return 'WEAPON';
      case MagicalItemType.WONDROUS:
        return 'WONDROUS';
    }

    return 'WONDROUS';
  }

  getSize(size: Size): string {
    switch (size) {
      case Size.TINY:
        return 'Tiny';
      case Size.SMALL:
        return 'Small';
      case Size.MEDIUM:
        return 'Medium';
      case Size.LARGE:
        return 'Large';
      case Size.HUGE:
        return 'Huge';
      case Size.GARGUANTUAN:
        return 'Gargantuan';
    }
    return 'Medium';
  }

  getChallengeRating(challengeRating: ChallengeRating): string {
    switch (challengeRating) {
      case ChallengeRating.ZERO:
        return 'ZERO';
      case ChallengeRating.EIGHTH:
        return 'EIGHTH';
      case ChallengeRating.QUARTER:
        return 'QUARTER';
      case ChallengeRating.HALF:
        return 'HALF';
      case ChallengeRating.ONE:
        return 'ONE';
      case ChallengeRating.TWO:
        return 'TWO';
      case ChallengeRating.THREE:
        return 'THREE';
      case ChallengeRating.FOUR:
        return 'FOUR';
      case ChallengeRating.FIVE:
        return 'FIVE';
      case ChallengeRating.SIX:
        return 'SIX';
      case ChallengeRating.SEVEN:
        return 'SEVEN';
      case ChallengeRating.EIGHT:
        return 'EIGHT';
      case ChallengeRating.NINE:
        return 'NINE';
      case ChallengeRating.TEN:
        return 'TEN';
      case ChallengeRating.ELEVEN:
        return 'ELEVEN';
      case ChallengeRating.TWELVE:
        return 'TWELVE';
      case ChallengeRating.THIRTEEN:
        return 'THIRTEEN';
      case ChallengeRating.FOURTEEN:
        return 'FOURTEEN';
      case ChallengeRating.FIFTEEN:
        return 'FIFTEEN';
      case ChallengeRating.SIXTEEN:
        return 'SIXTEEN';
      case ChallengeRating.SEVENTEEN:
        return 'SEVENTEEN';
      case ChallengeRating.EIGHTEEN:
        return 'EIGHTEEN';
      case ChallengeRating.NINETEEN:
        return 'NINETEEN';
      case ChallengeRating.TWENTY:
        return 'TWENTY';
      case ChallengeRating.TWENTY_ONE:
        return 'TWENTY_ONE';
      case ChallengeRating.TWENTY_TWO:
        return 'TWENTY_TWO';
      case ChallengeRating.TWENTY_THREE:
        return 'TWENTY_THREE';
      case ChallengeRating.TWENTY_FOUR:
        return 'TWENTY_FOUR';
      case ChallengeRating.TWENTY_FIVE:
        return 'TWENTY_FIVE';
      case ChallengeRating.TWENTY_SIX:
        return 'TWENTY_SIX';
      case ChallengeRating.TWENTY_SEVEN:
        return 'TWENTY_SEVEN';
      case ChallengeRating.TWENTY_EIGHT:
        return 'TWENTY_EIGHT';
      case ChallengeRating.TWENTY_NINE:
        return 'TWENTY_NINE';
      case ChallengeRating.THIRTY:
        return 'THIRTY';
    }
  }

  getAlignment(sid: number): string {
    switch (sid) {
      case SID.ALIGNMENTS.LAWFUL_GOOD:
        return 'Lawful Good';
      case SID.ALIGNMENTS.NEUTRAL_GOOD:
        return 'Neutral Good';
      case SID.ALIGNMENTS.CHAOTIC_GOOD:
        return 'Chaotic Good';
      case SID.ALIGNMENTS.LAWFUL_NEUTRAL:
        return 'Lawful Neutral';
      case SID.ALIGNMENTS.NEUTRAL:
        return 'Neutral';
      case SID.ALIGNMENTS.CHAOTIC_NEUTRAL:
        return 'Chaotic Neutral';
      case SID.ALIGNMENTS.LAWFUL_EVIL:
        return 'Lawful Evil';
      case SID.ALIGNMENTS.NEUTRAL_EVIL:
        return 'Neutral Evil';
      case SID.ALIGNMENTS.CHAOTIC_EVIL:
        return 'Chaotic Evil';
    }
    return 'Unaligned';
  }

  getEquipmentSlot(equipmentSlot: EquipmentSlot): object {
    let typeName = '';
    let id = 0;
    let name = '';
    switch (equipmentSlot.equipmentSlotType) {
      case EquipmentSlotType.NONE:
        typeName = 'None';
        name = 'None';
        id = 1;
        break;
      case EquipmentSlotType.HAND:
        typeName = 'Hand';
        if (equipmentSlot.name === 'Main Hand') {
          name = 'Main Hand';
          id = 2;
        } else {
          name = 'Off Hand';
          id = 3;
        }
        break;
      case EquipmentSlotType.BODY:
        typeName = 'Body';
        name = 'Body';
        id = 4;
        break;
      case EquipmentSlotType.BACK:
        typeName = 'Back';
        name = 'Back';
        id = 5;
        break;
      case EquipmentSlotType.NECK:
        typeName = 'Neck';
        name = 'Neck';
        id = 6;
        break;
      case EquipmentSlotType.GLOVES:
        typeName = 'Gloves';
        name = 'Gloves';
        id = 7;
        break;
      case EquipmentSlotType.FINGER:
        typeName = 'Finger';
        if (equipmentSlot.name === 'Left Finger') {
          name = 'Left Finger';
          id = 8;
        } else {
          name = 'Right Finger';
          id = 9;
        }
        break;
      case EquipmentSlotType.HEAD:
        typeName = 'Head';
        name = 'Head';
        id = 10;
        break;
      case EquipmentSlotType.WAIST:
        typeName = 'Waist';
        name = 'Waist';
        id = 11;
        break;
      case EquipmentSlotType.FEET:
        typeName = 'Feet';
        name = 'Feet';
        id = 12;
        break;
      case EquipmentSlotType.MOUNT:
        typeName = 'Mount';
        name = 'Mount';
        id = 13;
        break;
    }

    return {
      'type': 'EquipSlot',
      'equipmentSlotType': {
        'type': 'EquipSlotType',
        'name' : typeName
      },
      'id': id,
      'name': name
    };
  }

  getDamageModifierType(type: DamageModifierType): string {
    switch (type) {
      case DamageModifierType.NORMAL:
        return 'NORMAL';
      case DamageModifierType.VULNERABLE:
        return 'VULNERABLE';
      case DamageModifierType.RESISTANT:
        return 'RESISTANT';
      case DamageModifierType.IMMUNE:
        return 'IMMUNE';
    }
  }

  getConditionId(sid: number): number {
    switch (sid) {
      case SID.CONDITIONS.BLINDED:
        return 1;
      case SID.CONDITIONS.CHARMED:
        return 2;
      case SID.CONDITIONS.DEAFENED:
        return 3;
      case SID.CONDITIONS.FRIGHTENED:
        return 4;
      case SID.CONDITIONS.GRAPPLED:
        return 5;
      case SID.CONDITIONS.INCAPACITATED:
        return 6;
      case SID.CONDITIONS.INVISIBLE:
        return 7;
      case SID.CONDITIONS.PARALYZED:
        return 8;
      case SID.CONDITIONS.PETRIFIED:
        return 9;
      case SID.CONDITIONS.POISONED:
        return 10;
      case SID.CONDITIONS.PRONE:
        return 11;
      case SID.CONDITIONS.RESTRAINED:
        return 12;
      case SID.CONDITIONS.STUNNED:
        return 13;
      case SID.CONDITIONS.UNCONSCIOUS:
        return 14;
      case SID.CONDITIONS.EXHAUSTION:
        return 15;
    }
    return 0;
  }

  getSenseType(sense: Sense): string {
    switch (sense) {
      case Sense.DARKVISION:
        return 'Darkvision';
      case Sense.BLINDSIGHT:
        return 'Blindsight';
      case Sense.TELEPATHY:
        return 'Telepathy';
      case Sense.TREMORSENSE:
        return 'Tremorsense';
      case Sense.TRUESIGHT:
        return 'Truesight';
    }
  }

  getLimitedUseType(limitedUse: LimitedUse): string {
    if (limitedUse == null) {
      return 'NUM_PER_DAY';
    }
    switch (limitedUse.limitedUseType) {
      case LimitedUseType.QUANTITY:
      case LimitedUseType.DICE:
      case LimitedUseType.LEVEL:
        return 'NUM_PER_DAY';
      case LimitedUseType.RECHARGE:
        return 'RECHARGE_RANGE';
    }
  }

  getAttackType(type: AttackType, rangeType: WeaponRangeType): string {
    switch (type) {
      case AttackType.ATTACK:
        if (rangeType === WeaponRangeType.MELEE) {
          return 'ATTACK';
        } else {
          return 'RANGED';
        }
      case AttackType.SAVE:
        return 'SAVE';
      case AttackType.HEAL:
        return 'HEAL';
      // case AttackType.NONE:
      //   return 'ATTACK';
      // case AttackType.DAMAGE:
      //   return 'ATTACK';
    }
    return 'ATTACK';
  }

  getSpellAttackType(type: AttackType, rangeType: RangeType): string {
    switch (type) {
      case AttackType.ATTACK:
        if (rangeType === RangeType.SELF || rangeType === RangeType.TOUCH) {
          return 'ATTACK';
        } else {
          return 'RANGED';
        }
      case AttackType.SAVE:
        return 'SAVE';
      case AttackType.HEAL:
        return 'HEAL';
    }
    return 'ATTACK';
  }

  getMonsterActionType(action: Action): string {
    switch (action) {
      case Action.STANDARD:
        return 'NORMAL';
      case Action.REACTION:
        return 'REACTION';
      case Action.LEGENDARY:
        return 'LEGENDARY';
      case Action.LAIR:
        return 'LAIR';
    }
    return 'NORMAL';
  }

  getMonsterCastingTimeAction(castingTime: CastingTimeUnit): string {
    switch (castingTime) {
      case CastingTimeUnit.ACTION:
      case CastingTimeUnit.BONUS_ACTION:
      case CastingTimeUnit.SECOND:
      case CastingTimeUnit.MINUTE:
      case CastingTimeUnit.HOUR:
        return 'NORMAL';
      case CastingTimeUnit.REACTION:
        return 'REACTION';
    }
    return 'NORMAL';
  }

  getClassId(sid: number): number {
    switch (sid) {
      case SID.CLASSES.BARBARIAN:
        return 1;
      case SID.CLASSES.BARD:
        return 2;
      case SID.CLASSES.CLERIC:
        return 3;
      case SID.CLASSES.DRUID:
        return 4;
      case SID.CLASSES.FIGHTER:
        return 5;
      case SID.CLASSES.MONK:
        return 6;
      case SID.CLASSES.PALADIN:
        return 7;
      case SID.CLASSES.RANGER:
        return 8;
      case SID.CLASSES.ROGUE:
        return 9;
      case SID.CLASSES.SORCERER:
        return 10;
      case SID.CLASSES.WARLOCK:
        return 11;
      case SID.CLASSES.WIZARD:
        return 12;
    }
    return 0;
  }

  getRarity(rarity: Rarity): string {
    switch (rarity) {
      case Rarity.COMMON:
        return 'COMMON';
      case Rarity.UNCOMMON:
        return 'UNCOMMON';
      case Rarity.RARE:
        return 'RARE';
      case Rarity.VERY_RARE:
        return 'VERY_RARE';
      case Rarity.LEGENDARY:
        return 'LEGENDARY';
    }
    return 'COMMON';
  }
}
