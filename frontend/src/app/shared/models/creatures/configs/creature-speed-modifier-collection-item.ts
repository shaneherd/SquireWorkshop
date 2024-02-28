import {SpeedType} from '../../speed-type.enum';
import {CreatureListProficiency} from '../creature-list-proficiency';
import {LabelValue} from '../../label-value';

export class CreatureSpeedModifierCollectionItem {
  speedType: SpeedType;
  creatureListProficiency: CreatureListProficiency;

  base = 0;
  baseTooltip = '';
  modifiers = 0;
  modifiersDisplay: LabelValue[] = [];
  misc = 0;
  miscDisplays: string[] = [];
  penalties = 0;
  immobilized = false;
  halved = false;
  penaltyDisplays: string[] = [];

  applyGeneric = false;
  useHalfApplicable = true;
  useHalf = false;
  roundUp = false;
}
