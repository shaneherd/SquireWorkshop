import {Component, Input, OnInit} from '@angular/core';
import {Roll} from '../../../../shared/models/rolls/roll';
import {RollType} from '../../../../shared/models/rolls/roll-type.enum';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-attack-roll-result',
  templateUrl: './attack-roll-result.component.html',
  styleUrls: ['./attack-roll-result.component.scss']
})
export class AttackRollResultComponent implements OnInit {
  @Input() roll: Roll;
  @Input() showDetails = false;

  attack = false;
  save = false;
  heal = false;
  damageLabel = '';
  damageOnly = false;

  constructor(
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.attack = this.roll.rollType === RollType.ATTACK;
    this.save = this.roll.rollType === RollType.SAVE;
    this.heal = this.roll.rollType === RollType.HEAL;
    this.damageOnly = this.roll.rollType === RollType.DAMAGE;

    if (!this.heal) {
      this.damageLabel = this.translate.instant('Labels.Damage');
    } else {
      this.damageLabel = this.translate.instant('Labels.Healing');
    }
  }

  getResultTooltip(): string {
    if (this.roll.advantage && !this.roll.disadvantage) {
      return this.translate.instant('Tooltips.AdvantageRollResult');
    } else if (this.roll.disadvantage && !this.roll.advantage) {
      return this.translate.instant('Tooltips.DisdvantageRollResult');
    }
    return '';
  }

}
