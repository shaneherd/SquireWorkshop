import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {CreatureDamageModifierCollectionItem} from '../../../../shared/models/creatures/configs/creature-damage-modifier-collection-item';
import {DamageModifierType} from '../../../../shared/models/characteristics/damage-modifier-type.enum';
import {CreatureService} from '../../../../core/services/creatures/creature.service';
import {EVENTS} from '../../../../constants';
import {Subscription} from 'rxjs';
import {EventsService} from '../../../../core/services/events.service';
import {Creature} from '../../../../shared/models/creatures/creature';

@Component({
  selector: 'app-damage-modifier-details',
  templateUrl: './damage-modifier-details.component.html',
  styleUrls: ['./damage-modifier-details.component.scss']
})
export class DamageModifierDetailsComponent implements OnInit, OnDestroy {
  @Input() creature: Creature;
  @Input() item: CreatureDamageModifierCollectionItem;
  @Output() close = new EventEmitter();

  damageModifierType: DamageModifierType = DamageModifierType.NORMAL;
  configuring = false;
  tooltip = '';
  eventSub: Subscription;

  constructor(
    private creatureService: CreatureService,
    private eventsService: EventsService
  ) { }

  ngOnInit() {
    this.initializeValues();

    this.eventSub = this.eventsService.events.subscribe(event => {
      if (event === EVENTS.DamageModifierUpdated + this.item.damageType.id) {
        this.initializeValues();
      }
    });
  }

  ngOnDestroy() {
    this.eventSub.unsubscribe();
  }

  private initializeValues(): void {
    this.damageModifierType = this.creatureService.getDamageModifierType(this.item);
    this.tooltip = this.creatureService.getDamageModifierTooltip(this.item, this.damageModifierType);
  }

  configure(): void {
    this.configuring = true;
  }

  closeConfiguration(): void {
    this.configuring = false;
    this.eventsService.dispatchEvent(EVENTS.DamageModifierUpdated + this.item.damageType.id);
  }

  closeDetails(): void {
    if (this.close != null) {
      this.close.emit();
    }
  }
}
