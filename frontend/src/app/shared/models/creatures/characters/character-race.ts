import {Race} from '../../characteristics/race';
import {Spellcasting} from '../../spellcasting';

export class CharacterRace {
  race: Race;
  spellcastingAbility = '0';
  spellcastingAttack: Spellcasting = null;
  spellcastingSave: Spellcasting = null;
}
