import {BackgroundTrait} from '../../characteristics/background-trait';
import {Background} from '../../characteristics/background';
import {Spellcasting} from '../../spellcasting';

export class CharacterBackground {
  background: Background;
  chosenTraits: BackgroundTrait[] = [];
  customBackgroundName = '';
  customVariation = '';
  customPersonality = '';
  customIdeal = '';
  customBond = '';
  customFlaw = '';
  bio = '';

  spellcastingAbility = '0';
  spellcastingAttack: Spellcasting = null;
  spellcastingSave: Spellcasting = null;
}
