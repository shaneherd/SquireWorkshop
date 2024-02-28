import {Ability} from '../attributes/ability.model';

export class ClassSpellPreparation {
  requirePreparation = false;
  numToPrepareAbilityModifier = new Ability();
  numToPrepareIncludeLevel = false;
  numToPrepareIncludeHalfLevel = false;
  numToPrepareMiscModifier = 0;
}
