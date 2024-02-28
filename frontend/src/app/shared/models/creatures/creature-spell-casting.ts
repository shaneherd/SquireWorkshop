import {CreatureSpell} from './creature-spell';
import {CreatureSpellSlot} from './creature-spell-slot';
import {SpellConfiguration} from '../characteristics/spell-configuration';
import {Spellcasting} from '../spellcasting';
import {Tag} from '../tag';

export class CreatureSpellCasting {
  spellcastingAbility = '0';
  spellcastingAttack: Spellcasting = new Spellcasting();
  spellcastingSave: Spellcasting = new Spellcasting();
  spells: CreatureSpell[] = [];
  spellSlots: CreatureSpellSlot[] = [];
  spellConfigurations: SpellConfiguration[] = [];
  tags: Tag[] = [];
}
