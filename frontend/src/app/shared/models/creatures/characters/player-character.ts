import {Creature} from '../creature';
import {CharacterSettings} from './character-settings';
import {Characteristics} from './characteristics';
import {CharacterBackground} from './character-background';
import {ChosenClass} from './chosen-class';
import {ListObject} from '../../list-object';
import {HealthCalculationType} from './health-calculation-type.enum';
import {CharacterNote} from './character-note';
import {CharacterRace} from './character-race';
import {CreatureFeatures} from '../creature-features';
import {CreatureAction} from '../creature-action';
import {CreatureType} from '../creature-type.enum';
import {CompanionListObject} from '../companions/companion-list-object';
import {SquireImage} from '../../squire-image';

export class PlayerCharacter extends Creature {
  type = 'PlayerCharacter';
  characterRace: CharacterRace = new CharacterRace();
  exp = 0;
  classes: ChosenClass[] = [];
  characterBackground: CharacterBackground = new CharacterBackground();
  characteristics: Characteristics = new Characteristics();
  abilitiesToIncreaseByOne: ListObject[] = [];
  characterSettings: CharacterSettings = new CharacterSettings();
  inspiration = false;
  hpGainModifier = 0;
  healthCalculationType: HealthCalculationType = HealthCalculationType.ROLL;
  characterNotes: CharacterNote[] = [];
//  spells: SpellListObject[] = [];
//   features: CreatureFeature[] = [];
  creatureFeatures: CreatureFeatures;
  favoriteActions: CreatureAction[] = [];
  companions: CompanionListObject[] = [];
  campaignToken: string = null;
  image: SquireImage = null;

  constructor() {
    super();
    const defaultClass = new ChosenClass();
    this.classes = [];
    this.classes.push(defaultClass);
    this.healthCalculationType = HealthCalculationType.ROLL;
    this.creatureType = CreatureType.CHARACTER;
  }
}
