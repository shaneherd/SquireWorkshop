import {Sense} from '../../sense.enum';
import {InheritedSense} from './inherited-sense';

export class CreatureSenseCollectionItem {
  sense: Sense;
  range = 0;
  inheritedSenses: InheritedSense[] = [];
}
