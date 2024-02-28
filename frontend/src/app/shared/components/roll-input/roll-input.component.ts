import {Component, EventEmitter, Input, Output} from '@angular/core';
import {DiceSize} from '../../models/dice-size.enum';
import {DiceService} from '../../../core/services/dice.service';
import {NotificationService} from '../../../core/services/notification.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-roll-input',
  templateUrl: './roll-input.component.html',
  styleUrls: ['./roll-input.component.scss']
})
export class RollInputComponent {
  @Input() numDice = 0;
  @Input() diceSize: DiceSize = DiceSize.ONE;
  @Input() disabled = false;
  @Input() value = 0;
  @Output() valueChange = new EventEmitter();

  constructor(
    private diceService: DiceService,
    private notificationService: NotificationService,
    private translate: TranslateService
  ) { }

  getMaxValue(): number {
    return this.diceService.getMaxResult(this.numDice, this.diceSize);
  }

  valueChanged(input): void {
    this.value = parseInt(input.value, 10);
    this.valueChange.emit(this.value);
  }

  onKeyPress(event: KeyboardEvent): void {
    if ((event.key === 'r' || event.key === 'R') && event.shiftKey) {
      const roll = this.roll();
      this.valueChange.emit(roll);
    }
  }

  private roll(): number {
    const rolls: number[] = this.diceService.getRolls(this.numDice, this.diceSize);
    const rollResult =  this.diceService.getTotalRoll(rolls);
    this.notificationService.info(this.translate.instant('RollResult', {result: rollResult}));
    return rollResult;
  }

}
