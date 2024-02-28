import {DamageType} from '../attributes/damage-type';
import {DamageModifierType} from './damage-modifier-type.enum';

export class DamageModifier {
  damageType: DamageType;
  damageModifierType: DamageModifierType;
  condition = '';
}
