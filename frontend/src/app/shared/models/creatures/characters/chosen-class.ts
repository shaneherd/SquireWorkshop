import {CharacterLevel} from '../../character-level';
import {CharacterClass} from '../../characteristics/character-class';
import {HealthGainResult} from './health-gain-result';
import {Spellcasting} from '../../spellcasting';

export class ChosenClass {
  id = '0';
  primary = true;
  characterLevel: CharacterLevel;
  characterClass: CharacterClass;
  subclass: CharacterClass;
  healthGainResults: HealthGainResult[] = [];
  numHitDiceMod = 0;

  spellcastingAbility = '0';
  spellcastingAttack: Spellcasting = null;
  spellcastingSave: Spellcasting = null;
  displaySpellcasting = true;
}
