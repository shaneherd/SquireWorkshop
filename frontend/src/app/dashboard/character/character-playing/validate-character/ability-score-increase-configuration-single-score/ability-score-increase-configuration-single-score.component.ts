import {Component, EventEmitter, Input, Output} from '@angular/core';
import {AbilityScoreIncreaseConfiguration} from '../ability-score-increase-configuration/ability-score-increase-configuration.component';

@Component({
  selector: 'app-ability-score-increase-configuration-single-score',
  templateUrl: './ability-score-increase-configuration-single-score.component.html',
  styleUrls: ['./ability-score-increase-configuration-single-score.component.scss']
})
export class AbilityScoreIncreaseConfigurationSingleScoreComponent {
  @Input() config: AbilityScoreIncreaseConfiguration;
  @Output() amountChange = new EventEmitter();

  constructor() { }

  step(amount: number): void {
    this.config.adjustmentAmount += amount;
    this.amountChange.emit();
  }
}
