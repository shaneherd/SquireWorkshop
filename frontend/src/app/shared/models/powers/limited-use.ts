import {LimitedUseType} from '../limited-use-type.enum';
import {ListObject} from '../list-object';
import {DiceSize} from '../dice-size.enum';

export class LimitedUse {
  limitedUseType: LimitedUseType = LimitedUseType.QUANTITY;
  characterLevel: ListObject = null;
  quantity = 0;
  abilityModifier = '0';
  diceSize: DiceSize = DiceSize.ONE;
}
