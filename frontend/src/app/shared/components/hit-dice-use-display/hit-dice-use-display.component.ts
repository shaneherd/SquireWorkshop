import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CreatureHitDiceModification} from '../../models/creatures/creature-hit-dice-modification';
import {Roll} from '../../models/rolls/roll';
import {DiceSize} from '../../models/dice-size.enum';
import {RollRequest} from '../../models/rolls/roll-request';
import {RollType} from '../../models/rolls/roll-type.enum';
import {CreatureService} from '../../../core/services/creatures/creature.service';
import {DiceService} from '../../../core/services/dice.service';
import {TranslateService} from '@ngx-translate/core';
import {Creature} from '../../models/creatures/creature';

@Component({
  selector: 'app-hit-dice-use-display',
  templateUrl: './hit-dice-use-display.component.html',
  styleUrls: ['./hit-dice-use-display.component.scss']
})
export class HitDiceUseDisplayComponent {
  @Input() creature: Creature;
  @Input() conModifier: number;
  @Input() hitDice: CreatureHitDiceModification[] = [];
  @Output() applyHitDiceResults = new EventEmitter();

  constructor(
    private creatureService: CreatureService,
    private diceService: DiceService,
    private translate: TranslateService
  ) { }

  rollHitDice(creatureHitDiceModification: CreatureHitDiceModification): void {
    if (creatureHitDiceModification.remaining === 0) {
      return;
    }
    this.creatureService.rollStandard(this.creature, this.getHitDiceRollRequest(creatureHitDiceModification.diceSize)).then((roll: Roll) => {
      creatureHitDiceModification.results.push(roll);
      creatureHitDiceModification.remaining--;
      if (creatureHitDiceModification.remaining < 0) {
        creatureHitDiceModification.remaining = 0;
      }
      this.applyHitDiceResults.emit(roll);
    });
  }

  private getHitDiceRollRequest(diceSize: DiceSize): RollRequest {
    return this.diceService.getRollRequest(
      RollType.STANDARD,
      this.translate.instant('HitDiceReason', {
        diceSize: this.translate.instant('DiceSize.' + diceSize)
      }),
      diceSize,
      this.conModifier,
      false,
      false,
      false
    );
  }
}
