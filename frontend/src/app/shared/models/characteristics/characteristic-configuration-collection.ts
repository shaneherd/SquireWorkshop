import {ProficiencyCollection} from '../proficiency-collection';
import {SpellConfigurationCollection} from '../spell-configuration-collection';
import {DamageModifierCollection} from '../damage-modifier-collection';
import {ConditionImmunityConfigurationCollection} from '../condition-immunity-configuration-collection';
import {SenseConfigurationCollection} from '../sense-configuration-collection';
import {StartingEquipmentConfigurationCollection} from '../startingEquipment/starting-equipment-configuration-collection';
import {MiscModifierConfigurationCollection} from '../misc-modifier-configuration-collection';

export class CharacteristicConfigurationCollection {
  proficiencyCollection: ProficiencyCollection = new ProficiencyCollection();
  spellConfigurationCollection: SpellConfigurationCollection = new SpellConfigurationCollection();
  damageModifierCollection: DamageModifierCollection = new DamageModifierCollection();
  startingEquipmentCollection: StartingEquipmentConfigurationCollection = new StartingEquipmentConfigurationCollection();
  conditionImmunityConfigurationCollection: ConditionImmunityConfigurationCollection = new ConditionImmunityConfigurationCollection();
  senseConfigurationCollection: SenseConfigurationCollection = new SenseConfigurationCollection();
  miscModifierCollection: MiscModifierConfigurationCollection = new MiscModifierConfigurationCollection();
}
