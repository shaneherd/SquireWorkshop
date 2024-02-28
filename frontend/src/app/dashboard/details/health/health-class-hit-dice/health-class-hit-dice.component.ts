import {Component, Input, OnInit} from '@angular/core';
import {DiceSize} from '../../../../shared/models/dice-size.enum';
import {HealthConfigurationClass} from '../health-configuration-details/health-configuration-details.component';
import {EventsService} from '../../../../core/services/events.service';
import {EVENTS} from '../../../../constants';

@Component({
  selector: 'app-health-class-hit-dice',
  templateUrl: './health-class-hit-dice.component.html',
  styleUrls: ['./health-class-hit-dice.component.scss']
})
export class HealthClassHitDiceComponent implements OnInit {
  @Input() healthConfiguration: HealthConfigurationClass;
  @Input() numLevels = 0;

  diceSize: DiceSize = DiceSize.ONE;

  constructor(
    private eventsService: EventsService
  ) { }

  ngOnInit() {
    this.diceSize = this.getHitDiceSize();
  }

  private getHitDiceSize(): DiceSize {
    if (this.healthConfiguration.chosenClass.characterClass == null) {
      return DiceSize.ONE;
    }
    return this.healthConfiguration.chosenClass.characterClass.hitDice.diceSize;
  }

  onHitDiceModChange(input): void {
    this.healthConfiguration.hitDiceMod = parseInt(input.value, 10);
    this.eventsService.dispatchEvent(EVENTS.HitDiceChange);
  }

}
