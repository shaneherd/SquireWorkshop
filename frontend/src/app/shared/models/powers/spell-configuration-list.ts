import {SpellConfiguration} from '../characteristics/spell-configuration';
import {InnateSpellConfiguration} from '../creatures/monsters/monster';

export class SpellConfigurationList {
  configurations: SpellConfiguration[] = [];
  innateConfigurations: InnateSpellConfiguration[] = [];
}
