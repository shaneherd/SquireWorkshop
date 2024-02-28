import {Component, Input, OnInit} from '@angular/core';
import {DiceResult} from '../../../../shared/models/rolls/dice-result';
import {DiceService} from '../../../services/dice.service';

@Component({
  selector: 'app-roll-result-details',
  templateUrl: './roll-result-details.component.html',
  styleUrls: ['./roll-result-details.component.scss']
})
export class RollResultDetailsComponent implements OnInit {
  @Input() diceResult: DiceResult;
  @Input() healing = false;

  diceDisplay = '';
  diceValue = '';

  constructor(
    private diceService: DiceService
  ) { }

  ngOnInit(): void {
    this.diceDisplay = this.getDiceDisplay();
    this.diceValue = this.getDiceValue();
  }

  getDiceDisplay(): string {
    return this.diceService.getDiceDisplay(this.diceResult, this.healing);
  }

  getDiceValue(): string {
    return this.diceService.getDiceValue(this.diceResult);
  }
}
