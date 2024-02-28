import {Ability} from '../attributes/ability.model';

export class CreatureAbilityScore {
  ability: Ability = new Ability();
  value = 0;
  miscModifier = 0;
  asiModifier = 0;
}

export class CreatureAbilityScoreDisplay {
  ability = '';
  score = 0;
  modifier = 0;
  modifierDisplay = '';
  saveModifier = 0;
  saveDisplay = '';
}
