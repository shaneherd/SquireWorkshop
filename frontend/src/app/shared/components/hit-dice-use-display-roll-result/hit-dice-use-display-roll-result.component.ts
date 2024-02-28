import {Component, Input, OnInit} from '@angular/core';
import {Roll} from '../../models/rolls/roll';
import {DiceService} from '../../../core/services/dice.service';

@Component({
  selector: 'app-hit-dice-use-display-roll-result',
  templateUrl: './hit-dice-use-display-roll-result.component.html',
  styleUrls: ['./hit-dice-use-display-roll-result.component.scss']
})
export class HitDiceUseDisplayRollResultComponent implements OnInit {
  @Input() roll: Roll;
  @Input() rollNumber: number;

  tooltip = '';

  constructor(
    private diceService: DiceService
  ) { }

  ngOnInit() {
    this.initializeTooltip();
  }

  private initializeTooltip(): void {
    if (this.roll.results.length > 0 && this.roll.results[0].results.length > 0) {
      const parts = [];
      parts.push(this.diceService.getDiceDisplay(this.roll.results[0].results[0], true));
      parts.push(this.diceService.getDiceValue(this.roll.results[0].results[0]));
      this.tooltip = parts.join('\n');
    }
  }

}
