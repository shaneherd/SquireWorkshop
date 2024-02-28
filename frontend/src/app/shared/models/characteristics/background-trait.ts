import {BackgroundTraitType} from './background-trait-type.enum';

export class BackgroundTrait {
  id = '0';
  backgroundTraitType = BackgroundTraitType.NONE;
  description = '';

  constructor(backgroundTraitType: BackgroundTraitType) {
    this.backgroundTraitType = backgroundTraitType;
    this.description = '';
  }
}
