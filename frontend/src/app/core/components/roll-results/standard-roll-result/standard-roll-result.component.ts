import {Component, Input} from '@angular/core';
import {Roll} from '../../../../shared/models/rolls/roll';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-standard-roll-result',
  templateUrl: './standard-roll-result.component.html',
  styleUrls: ['./standard-roll-result.component.scss']
})
export class StandardRollResultComponent {
  @Input() roll: Roll;
  @Input() showDetails = false;

  constructor(
    private translate: TranslateService
  ) { }

  getResultTooltip(): string {
    if (this.roll.advantage && !this.roll.disadvantage) {
      return this.translate.instant('Tooltips.AdvantageRollResult');
    } else if (this.roll.disadvantage && !this.roll.advantage) {
      return this.translate.instant('Tooltips.DisdvantageRollResult');
    }
    return '';
  }

}
