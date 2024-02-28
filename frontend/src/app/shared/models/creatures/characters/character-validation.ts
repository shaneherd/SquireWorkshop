import {ListObject} from '../../list-object';
import {FeatureListObject} from '../../powers/feature-list-object';
import {SpellListObject} from '../../powers/spell-list-object';

export class CharacterValidationItem {
  valid = false;
  characteristic: ListObject = new ListObject();
  subCharacteristic: ListObject = new ListObject();
  level: ListObject = new ListObject();
  features: FeatureListObject[] = [];
  spells: SpellListObject[] = [];
  abilityScoreIncreaseApplicable = false;
  abilityScoreIncreaseApplied = false;
  featSelected = false;
}

export class CharacterValidationResponse {
  items: CharacterValidationResponseItem[] = [];
  ignoredFeatures: FeatureListObject[] = [];
  ignoredSpells: SpellListObject[] = [];
}

export class CharacterValidationResponseItem {
  characterValidationItem: CharacterValidationItem;
  selectedFeat: FeatureListObject;
  selectedAbilityScoreIncreases: CharacterValidationConfigurationASI[] = [];
  ignoreASI = false;
}

export class CharacterValidationConfigurationASI {
  ability: ListObject;
  amount: number;
}

export class CharacterValidationWarning {
  item: CharacterValidationItem;
  pageIndex: number;
  noFeaturesSelected = false;
  missingFeatures = false;
  noSpellsSelected = false;
  missingSpells = false;
  missingASI = false;
  missingFeat = false;
}
