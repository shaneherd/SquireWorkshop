import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {CreatureListProficiency} from '../../../../shared/models/creatures/creature-list-proficiency';
import {EVENTS} from '../../../../constants';
import {Subscription} from 'rxjs';
import {EventsService} from '../../../../core/services/events.service';
import {LabelValue} from '../../../../shared/models/label-value';

export class SingleCarryingDetails {
  label: string;
  labelTooltip = '';
  sid: number;
  base = 0;
  baseTooltip = '';
  strScore = 0;
  strModifier = 0;

  creatureListProficiency: CreatureListProficiency;
  modifiers = 0;
  modifiersDisplay: LabelValue[] = [];
  misc = 0;
  total = 0;
}

@Component({
  selector: 'app-single-carrying-detail',
  templateUrl: './single-carrying-detail.component.html',
  styleUrls: ['./single-carrying-detail.component.scss']
})
export class SingleCarryingDetailComponent implements OnInit, OnDestroy {
  @Input() singleCarryingDetails: SingleCarryingDetails;
  @Input() configuring = false;
  eventSub: Subscription;

  constructor(
    private eventsService: EventsService
  ) { }

  ngOnInit() {
    this.initializeValues();

    this.eventSub = this.eventsService.events.subscribe(event => {
      if (event === EVENTS.UpdateSingleCarryingDetails && this.configuring) {
        this.initializeValues();
      }
    });
  }

  ngOnDestroy() {
    this.eventSub.unsubscribe();
  }

  private initializeValues(): void {
    this.updateTotal();
  }

  private updateTotal(): void {
    this.singleCarryingDetails.total
      = this.singleCarryingDetails.base
      + (this.singleCarryingDetails.strScore * this.singleCarryingDetails.strModifier)
      + this.singleCarryingDetails.misc
      + this.singleCarryingDetails.modifiers;
  }

  miscChange(input): void {
    this.singleCarryingDetails.misc = parseInt(input.value, 10);
    this.updateTotal();
  }
}
