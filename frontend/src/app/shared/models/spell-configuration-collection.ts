import {InnateSpellConfigurationCollectionItem, SpellConfigurationCollectionItem} from './spell-configuration-collection-item';
import {ListObject} from './list-object';

export class SpellConfigurationCollection {
  spellConfigurations: SpellConfigurationCollectionItem[] = [];
  innateSpellConfigurations: InnateSpellConfigurationCollectionItem[] = [];
  spellcastingAbility = '0';
  innateSpellcastingAbility = '0';
  casterType = '0';
  levels: ListObject[] = [];
}
