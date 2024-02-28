import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ChosenClass} from '../../../../shared/models/creatures/characters/chosen-class';
import {HealthCalculationType} from '../../../../shared/models/creatures/characters/health-calculation-type.enum';
import {HealthGainResult} from '../../../../shared/models/creatures/characters/health-gain-result';
import {DiceService} from '../../../../core/services/dice.service';
import {DiceSize} from '../../../../shared/models/dice-size.enum';
import {CharacterService} from '../../../../core/services/creatures/character.service';
import {EventsService} from '../../../../core/services/events.service';
import {EVENTS} from '../../../../constants';
import {TranslateService} from '@ngx-translate/core';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-health-class-level',
  templateUrl: './health-class-level.component.html',
  styleUrls: ['./health-class-level.component.scss']
})
export class HealthClassLevelComponent implements OnInit, OnDestroy {
  @Input() healthGainResult: HealthGainResult;
  @Input() chosenClass: ChosenClass;
  @Input() healthCalculationType: HealthCalculationType;
  @Input() hpModifier = 0;
  @Input() conModifier = 0;
  @Input() first = false;

  eventSub: Subscription;
  numDice = 0;
  diceSize: DiceSize = DiceSize.ONE;
  disabled = false;
  modifier = 0;
  tooltip = '';

  constructor(
    private diceService: DiceService,
    private characterService: CharacterService,
    private eventsService: EventsService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.initializeDisabled();
    this.numDice = this.diceService.getClassNumHpGainDice(this.chosenClass.characterClass);
    this.diceSize = this.diceService.getDiceSize(this.chosenClass.characterClass);
    this.updateModifier();
    this.updateTooltip();

    this.eventSub = this.eventsService.events.subscribe(event => {
      if (event === EVENTS.HealthCalculationTypeChange) {
        this.initializeDisabled();
      } else if (event === EVENTS.HpModifierGainChange) {
        this.updateModifier();
        this.updateTooltip();
      }
    });
  }

  ngOnDestroy() {
    this.eventSub.unsubscribe();
  }

  private initializeDisabled(): void {
    this.disabled = this.healthCalculationType !== HealthCalculationType.ROLL;
  }

  private updateTooltip(): void {
    this.tooltip = this.getTooltip();
  }

  private getTooltip(): string {
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

  private updateModifier(): void {
    this.modifier = this.getModifier();
  }

  private getModifier(): number {
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
    this.eventsService.dispatchEvent(EVENTS.HealthGainResultChange);
  }
}
