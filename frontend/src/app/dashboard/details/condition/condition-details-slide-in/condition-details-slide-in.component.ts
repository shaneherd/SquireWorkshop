import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Condition} from '../../../../shared/models/attributes/condition';
import {CreatureService} from '../../../../core/services/creatures/creature.service';
import {ActiveCondition} from '../../../../shared/models/creatures/active-condition';
import {EVENTS, SID} from '../../../../constants';
import {ConditionService} from '../../../../core/services/attributes/condition.service';
import {EventsService} from '../../../../core/services/events.service';
import {Subscription} from 'rxjs';
import {Creature} from '../../../../shared/models/creatures/creature';

@Component({
  selector: 'app-condition-details-slide-in',
  templateUrl: './condition-details-slide-in.component.html',
  styleUrls: ['./condition-details-slide-in.component.scss']
})
export class ConditionDetailsSlideInComponent implements OnInit, OnDestroy {
  @Input() condition: Condition;
  @Input() creature: Creature;
  @Output() save = new EventEmitter();
  @Output() close = new EventEmitter();

  configuring = false;
  active = false;
  disabled = false;
  immune = false;
  eventSub: Subscription;

  constructor(
    private creatureService: CreatureService,
    private conditionService: ConditionService,
    private eventsService: EventsService
  ) { }

  ngOnInit() {
    this.initializeValues();

    this.eventSub = this.eventsService.events.subscribe(event => {
      if (event === EVENTS.ConditionUpdated) {
        this.initializeValues();
      }
    });
  }

  ngOnDestroy() {
    this.eventSub.unsubscribe();
  }

  private initializeValues(): void {
    this.active = this.creatureService.isConditionActive(this.condition, this.creature);
    this.disabled = this.creatureService.isConditionInheritedActive(this.condition, this.creature);
    this.immune = this.creatureService.isConditionImmune(this.condition, this.creature);
  }

  configure(): void {
    this.configuring = true;
  }

  closeConfigurations(): void {
    this.configuring = false;
  }

  saveConfigurations(): void {
    this.configuring = false;
    this.eventsService.dispatchEvent(EVENTS.ConditionUpdated);
  }

  saveCondition(): void {
    if (!this.disabled && this.active) {
      //dismiss
      const index = this.creatureService.getActiveConditionIndex(this.condition, this.creature);
      if (index > -1) {
        this.creatureService.updateCondition(this.creature.id, this.condition, false)
          .then((activeConditions: ActiveCondition[]) => {
            this.creature.activeConditions = activeConditions;
            this.eventsService.dispatchEvent(EVENTS.ConditionUpdated);
            this.save.emit();
          });
      }
    } else if (!this.active && !this.immune) {
      //activate
      this.creatureService.updateCondition(this.creature.id, this.condition, true)
        .then((activeConditions: ActiveCondition[]) => {
          this.creature.activeConditions = activeConditions;

          const incapacitated = this.conditionService.getConditionBySID(SID.CONDITIONS.INCAPACITATED);
          const isIncapacitated = this.creatureService.isConditionActive(incapacitated, this.creature);
          if (isIncapacitated) {
            const concentratingSpell = this.creatureService.getConcentratingSpell(this.creature);
            if (concentratingSpell != null) {
              this.creatureService.loseConcentration(this.creature, concentratingSpell);
              this.eventsService.dispatchEvent(EVENTS.ConcentrationUpdated);
            }
          }
          this.eventsService.dispatchEvent(EVENTS.ConditionUpdated);
          this.save.emit();
        });
    }
  }

  closeDetails(): void {
    if (this.close != null) {
      this.close.emit();
    }
  }

}
