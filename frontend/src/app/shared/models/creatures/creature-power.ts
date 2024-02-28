import {LimitedUse} from '../powers/limited-use';
import {PowerType} from '../powers/power-type.enum';
import {CharacteristicType} from '../characteristics/characteristic-type.enum';
import {ModifierConfiguration} from '../modifier-configuration';

export class CreaturePower {
  id = '0';
  powerId = '0';
  powerName = '';
  powerType: PowerType;
  characteristicType: CharacteristicType;
  assignedCharacteristic = '0';
  active = false;
  activeTargetCreatureId = '0';
  hidden = false;
  usesRemaining = 0;
  calculatedMax = 0;
  rechargeOnShortRest = false;
  rechargeOnLongRest = false;
  limitedUses: LimitedUse[] = [];

  modifierConfigurations: ModifierConfiguration[] = [];
  extraModifiers = false;
  modifiersNumLevelsAboveBase = 0;
  extraModifierConfigurations: ModifierConfiguration[] = [];
  advancementModifiers = false;
  advancementModifierConfigurations: ModifierConfiguration[] = [];
}
