import {Item} from './item';

export class ItemProficiency {
  item: Item;
  proficient = false;
  miscModifier = 0;
  advantage = false;
  disadvantage = false;
  doubleProf = false;
  halfProf = false;
  roundUp = false;
}
