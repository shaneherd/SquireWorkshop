import {SpeedType} from '../../speed-type.enum';
import {CharacterPage} from './character-page';

export class CharacterSettings {
  restrictToTwenty = false;
  pages: CharacterPage[] = [];
  health: CharacterHealthSettings = new CharacterHealthSettings();
  equipment: CharacterEquipmentSettings = new CharacterEquipmentSettings();
  speed: CharacterSpeedSettings = new CharacterSpeedSettings();
  spellcasting: CharacterSpellcastingSettings = new CharacterSpellcastingSettings();
  features: CharacterFeatureSettings = new CharacterFeatureSettings();
  skills: CharacterSkillSettings = new CharacterSkillSettings();
  validation: CharacterValidationSettings = new CharacterValidationSettings();
  misc: CharacterMiscSettings = new CharacterMiscSettings();
  quickActions: CharacterQuickActionSettings = new CharacterQuickActionSettings();
}

export class BattleMonsterSettings {
  speed: CharacterSpeedSettings = new CharacterSpeedSettings();
}

export class CharacterHealthSettings {
  showHitDice = false;
  highlightValues = true;
  flashLCD = true;
  autoRollConcentrationChecks = true;
  postponeConcentrationChecks = false;
  removeProneOnRevive = false;
  dropItemsWhenDying = true;
}

export class CharacterEquipmentSettings {
  hideEmptySlots = false;
  autoConvertCurrency = false;
  calculateCurrencyWeight = false;
  useEncumbrance = false;
  attackWithUnequipped = false;
  maxAttunedItems = 3; //todo
  enforceAttunedLimit = true; //todo
}

export class CharacterSpeedSettings {
  speedToDisplay: SpeedType = SpeedType.WALK;
  swimming: CharacterSpeedSetting = new CharacterSpeedSetting();
  climbing: CharacterSpeedSetting = new CharacterSpeedSetting();
  crawling: CharacterSpeedSetting = new CharacterSpeedSetting();
}

export class CharacterSpeedSetting {
  useHalf = true;
  roundUp = false;
}

export class CharacterSpellcastingSettings {
  displayClassSpellcasting = true;
  displayRaceSpellcasting = false;
  displayBackgroundSpellcasting = false;
  displayOtherSpellcasting = false;
  displayTags = true;
  highlightActive = true;
}

export class CharacterFeatureSettings {
  displayTags = true;
  highlightActive = true;
  highlightNonActive = true;
}

export class CharacterSkillSettings {
  displayPassive = false;
}

export class CharacterValidationSettings {
  allowFeatSelection = true;
  asiFeatOneOnly = true;
  autoIgnoreUnselectedFeatures = false;
  autoIgnoreUnselectedSpells = false;
  autoIgnoreUnselectedAsi = false;
}

export class CharacterMiscSettings {
  maxColumns = 10;
  showHealthProgressBar = true;
  showLevelProgressBar = true;
  showCarryingProgressBar = true;
}

export class CharacterQuickActionSettings {
  hideUnpreparedSpells = false;
}
