import {Proficiency} from '../proficiency';
import {CharacteristicType} from './characteristic-type.enum';
import {Modifier} from '../modifier';
import {SpellConfiguration} from './spell-configuration';
import {DamageModifier} from './damage-modifier';
import {ListObject} from '../list-object';
import {SenseValue} from '../sense-value';
import {StartingEquipment} from '../startingEquipment/starting-equipment';

export class Characteristic {
  id = '0';
  name: string;
  parent: Characteristic;
  characteristicType: CharacteristicType;
  sid = 0;
  author = false;
  version = 0;

  armorProfs: Proficiency[] = [];
  armorTypeProfs: Proficiency[] = [];
  languageProfs: Proficiency[] = [];
  savingThrowProfs: Proficiency[] = [];
  skillProfs: Proficiency[] = [];
  skillChoiceProfs: Proficiency[] = [];
  toolCategoryProfs: Proficiency[] = [];
  toolCategoryChoiceProfs: Proficiency[] = [];
  toolProfs: Proficiency[] = [];
  weaponProfs: Proficiency[] = [];
  weaponTypeProfs: Proficiency[] = [];

  abilityModifiers: Modifier[] = [];
  conditionImmunities: ListObject[] = [];
  senses: SenseValue[] = [];
  miscModifiers: Modifier[] = [];

  numSavingThrows = 0;
  numAbilities = 0;
  numLanguages = 0;
  numSkills = 0;
  numTools = 0;

  spellCastingAbility = '0';
  spellConfigurations: SpellConfiguration[] = [];
  damageModifiers: DamageModifier[] = [];
  startingEquipment: StartingEquipment[] = [];
}
