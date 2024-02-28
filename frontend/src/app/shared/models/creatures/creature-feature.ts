import {FeatureListObject} from '../powers/feature-list-object';
import {CreaturePower} from './creature-power';
import {Action} from '../action.enum';

export class CreatureFeature extends CreaturePower {
  feature: FeatureListObject;
  action: Action;
}
