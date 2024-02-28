import {PowerModifierConfiguration} from '../../power-modifier-configuration';

export class CreatureCharacteristicConfigurationCollectionItem {
  characteristicId = '0';
  spellAttackModifiers = new Map<string, PowerModifierConfiguration>();
  spellSaveModifiers = new Map<string, PowerModifierConfiguration>();
  spellPreparationModifiers = new Map<string, PowerModifierConfiguration>();
  hitDiceModifiers = new Map<string, PowerModifierConfiguration>();
  maxHpModifiers = new Map<string, PowerModifierConfiguration>();
}
