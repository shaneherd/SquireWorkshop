import {Characteristic} from './characteristic';
import {CasterType} from '../attributes/caster-type';
import {Proficiency} from '../proficiency';
import {DiceCollection} from './dice-collection';
import {ClassSpellPreparation} from './class-spell-preparation';
import {CharacteristicType} from './characteristic-type.enum';

export class CharacterClass extends Characteristic {
  type = 'CharacterClass';
  characteristicType = CharacteristicType.CLASS;
  description: string;
  hpAtFirst = new DiceCollection();
  hitDice = new DiceCollection();
  hpGain = new DiceCollection();
  startingGold = new DiceCollection();
  classSpellPreparation = new ClassSpellPreparation();
  casterType: CasterType;
  armorSecondaryProfs: Proficiency[] = [];
  armorTypeSecondaryProfs: Proficiency[] = [];
  languageSecondaryProfs: Proficiency[] = [];
  savingThrowSecondaryProfs: Proficiency[] = [];
  skillSecondaryProfs: Proficiency[] = [];
  skillSecondaryChoiceProfs: Proficiency[] = [];
  toolCategorySecondaryProfs: Proficiency[] = [];
  toolCategorySecondaryChoiceProfs: Proficiency[] = [];
  toolSecondaryProfs: Proficiency[] = [];
  weaponSecondaryProfs: Proficiency[] = [];
  weaponTypeSecondaryProfs: Proficiency[] = [];
  abilityScoreIncreases: string[] = [];
  numSecondarySkills = 0;
  numSecondaryTools = 0;
  subclasses: CharacterClass[] = [];

  constructor() {
    super();
    this.characteristicType = CharacteristicType.CLASS;
  }
}
