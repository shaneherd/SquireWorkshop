import {ModifierConfiguration} from './modifier-configuration';

export class ModifierConfigurationCollection {
  modifierConfigurations: ModifierConfiguration[]  = [];
  extraModifiers = false;
  numLevelsAboveBase = 0;
  extraModifierConfigurations: ModifierConfiguration[] = [];
  advancementModifiers = false;
  advancementModifierConfigurations: ModifierConfiguration[] = [];
}
