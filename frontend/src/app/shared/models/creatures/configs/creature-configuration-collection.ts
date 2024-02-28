import {CreatureProficiencyCollection} from './creature-proficiency-collection';
import {CreatureSensesCollection} from './creature-senses-collection';
import {CreatureConditionImmunityCollection} from './creature-condition-immunity-collection';
import {CreatureDamageModifierCollection} from './creature-damage-modifier-collection';
import {CharacterBackgroundTraitCollection} from '../characters/configs/character-background-trait-collection';
import {CharacterLevel} from '../../character-level';
import {MappedSpellConfigurationCollection} from '../../mapped-spell-configuration-collection';
import {CreatureCharacteristicConfigurationCollection} from './creature-characteristic-configuration-collection';
import {ProficiencyCollection} from '../../proficiency-collection';
import {SpellConfigurationCollection} from '../../spell-configuration-collection';
import {DamageModifierCollection} from '../../damage-modifier-collection';
import {ConditionImmunityConfigurationCollection} from '../../condition-immunity-configuration-collection';
import {SenseConfigurationCollection} from '../../sense-configuration-collection';

export class CreatureConfigurationCollection {
  proficiencyCollection: CreatureProficiencyCollection = new CreatureProficiencyCollection();
  damageModifierCollection: CreatureDamageModifierCollection = new CreatureDamageModifierCollection();
  conditionImmunityConfigurationCollection: CreatureConditionImmunityCollection = new CreatureConditionImmunityCollection();
  senseConfigurationCollection: CreatureSensesCollection = new CreatureSensesCollection();
  backgroundConfigurationCollection: CharacterBackgroundTraitCollection = new CharacterBackgroundTraitCollection();
  totalLevel: CharacterLevel = new CharacterLevel();
  profBonus = 0;
  characteristicSpellConfigurations = new Map<string, MappedSpellConfigurationCollection>();
  characteristicConfigurationCollection: CreatureCharacteristicConfigurationCollection = new CreatureCharacteristicConfigurationCollection();
}

export class MonsterConfigurationCollection {
  proficiencyCollection: ProficiencyCollection = new ProficiencyCollection();
  spellConfigurationCollection: SpellConfigurationCollection = new SpellConfigurationCollection();
  damageModifierCollection: DamageModifierCollection = new DamageModifierCollection();
  conditionImmunityConfigurationCollection: ConditionImmunityConfigurationCollection = new ConditionImmunityConfigurationCollection();
  senseConfigurationCollection: SenseConfigurationCollection = new SenseConfigurationCollection();
}
