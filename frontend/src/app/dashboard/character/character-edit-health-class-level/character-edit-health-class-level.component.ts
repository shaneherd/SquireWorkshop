import {Component, Input} from '@angular/core';
import {ChosenClass} from '../../../shared/models/creatures/characters/chosen-class';
import {DiceSize} from '../../../shared/models/dice-size.enum';
import {HealthGainResult} from '../../../shared/models/creatures/characters/health-gain-result';
import {DiceService} from '../../../core/services/dice.service';
import {HealthCalculationType} from '../../../shared/models/creatures/characters/health-calculation-type.enum';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-character-edit-health-class-level',
  templateUrl: './character-edit-health-class-level.component.html',
  styleUrls: ['./character-edit-health-class-level.component.scss']
})
export class CharacterEditHealthClassLevelComponent {
  @Input() chosenClass: ChosenClass;
  @Input() healthCalculationType: HealthCalculationType;
  @Input() hpModifier = 0;
  @Input() conModifier = 0;
  @Input() healthGainResult: HealthGainResult;
  @Input() first = false;

  constructor(
    private diceService: DiceService,
    private translate: TranslateService
  ) { }

  isDisabled(): boolean {
    return this.healthCalculationType !== HealthCalculationType.ROLL;
  }

  getNumDice(): number {
    return this.diceService.getClassNumHpGainDice(this.chosenClass.characterClass);
  }

  getDiceSize(): DiceSize {
    return this.diceService.getDiceSize(this.chosenClass.characterClass);
  }

  getTooltip(): string {
    if (this.chosenClass.characterClass == null) {
      return '';
    }
    const parts = [];
    if (this.first && this.chosenClass.primary) {
      parts.push(this.translate.instant('Labels.Base') + ' ' + this.chosenClass.characterClass.hpAtFirst.numDice);
    }
    parts.push(this.translate.instant('Labels.ConModifier') + ' ' + this.conModifier);
    if (this.hpModifier > 0) {
      parts.push(this.translate.instant('Labels.HpModifier') + ' ' + this.hpModifier);
    }
    return parts.join('\n');
  }

  getModifier(): number {
    if (this.chosenClass.characterClass == null) {
      return 0;
    }
    let modifier = this.conModifier + this.hpModifier;
    if (this.first && this.chosenClass.primary) {
      modifier += this.chosenClass.characterClass.hpAtFirst.numDice;
    }
    return modifier;
  }

  gainResultChange(value): void {
    this.healthGainResult.value = value;
  }

}
