import {CharacterValidationWarning} from '../../../shared/models/creatures/characters/character-validation';

export class ValidateCharacterIgnoreFeaturesDialogData {
  warnings: CharacterValidationWarning[] = [];
  hasMultiplePages = false;
  autoIgnoreUnselectedFeatures = false;
  autoIgnoreUnselectedSpells = false;
  autoIgnoreUnselectedAsi = false;
  continue: any;
  goToPage: any;
}
