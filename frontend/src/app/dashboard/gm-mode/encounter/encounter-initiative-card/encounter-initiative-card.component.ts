import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {MatRadioChange} from '@angular/material/radio';
import {CombatCreature, CombatRow} from '../../../../shared/models/combat-row';
import {PageMenuAction} from '../../../character/character-playing/character-playing.component';
import * as _ from 'lodash';
import {EVENTS} from '../../../../constants';
import {EventsService} from '../../../../core/services/events.service';
import {Subscription} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-encounter-initiative-card',
  templateUrl: './encounter-initiative-card.component.html',
  styleUrls: ['./encounter-initiative-card.component.scss']
})
export class EncounterInitiativeCardComponent implements OnInit, OnDestroy {
  @Input() combatRow: CombatRow;
  @Input() isDesktop = true;
  @Input() isFirst = false;
  @Output() cardClick = new EventEmitter<CombatRow>();
  @Output() hpClick = new EventEmitter<CombatCreature>();
  @Output() kill = new EventEmitter<CombatCreature>();
  @Output() flee = new EventEmitter<CombatRow>();
  @Output() speedType = new EventEmitter<CombatCreature>();
  @Output() fleeGroup = new EventEmitter<CombatRow>();
  @Output() addCreatures = new EventEmitter<CombatRow>();
  @Output() splitGroup = new EventEmitter<CombatRow>();
  @Output() refresh = new EventEmitter<CombatCreature>();

  actions: PageMenuAction[] = []
  eventSub: Subscription;

  constructor(
    private eventsService: EventsService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.actions = [];
    this.actions.push(new PageMenuAction(this.translate.instant('AdjustHP'), 'adjust', 'fa-solid fa-plus-minus'));
    this.actions.push(new PageMenuAction(this.translate.instant('Kill'), 'kill', 'fa-solid fa-skull'));
    if (this.combatRow.combatCreatures.length > 1) {
      this.actions.push(new PageMenuAction(this.translate.instant('Encounter.FleeGroup'), 'flee-group', 'fa-solid fa-person-running'));
    } else {
      this.actions.push(new PageMenuAction(this.translate.instant('Flee'), 'flee', 'fa-solid fa-person-running'));
    }
    this.actions.push(new PageMenuAction(this.translate.instant('Headers.Speeds'), 'speed', 'fa-solid fa-gauge-simple-high'));
    if (!this.combatRow.monster) {
      this.actions.push(new PageMenuAction(this.translate.instant('Refresh'), 'refresh', 'fa-solid fa-arrow-rotate-right'));
    }
    // if (this.combatRow.monster) {
    //   this.actions.push(new PageMenuAction(this.translate.instant('Headers.AddMonsters'), 'add', 'fa-solid fa-plus'));
    //   if (this.combatRow.combatCreatures.length > 1) {
    //     this.actions.push(new PageMenuAction(this.translate.instant('Encounter.SplitGroup'), 'split', 'fa-solid fa-divide'));
    //   }
    // }
    this.updateActions();

    this.eventSub = this.eventsService.events.subscribe(event => {
      this.handleEvents(event);
    });
  }

  private handleEvents(event): void {
    if (
      event === EVENTS.Encounter.HpChange + this.combatRow.id ||
      event === EVENTS.Encounter.Flee + this.combatRow.id ||
      event === EVENTS.Encounter.SelectedChange + this.combatRow.id
    ) {
      this.updateActions();
    }
  }

  private updateActions(combatCreature: CombatCreature = null): void {
    if (combatCreature == null) {
      combatCreature = this.getSelectedCombatCreature();
    }
    this.updateKillDisabled(combatCreature);
    this.updateFlee(combatCreature);
    this.updateSplit();
  }

  private updateKillDisabled(combatCreature: CombatCreature): void {
    if (combatCreature != null) {
      const killAction = this.getAction('kill');
      if (killAction != null) {
        killAction.disabled = combatCreature.dead;
      }
    }
  }

  private updateFlee(combatCreature: CombatCreature): void {
    if (combatCreature != null) {
      const fleeAction = this.getAction('flee');
      if (fleeAction != null) {
        fleeAction.label = combatCreature.dead ? this.translate.instant('Remove') : this.translate.instant('Flee');
        fleeAction.icon = combatCreature.dead ? 'fa-solid fa-xmark' : 'fa-solid fa-person-running';
      }
    }
  }

  private updateSplit(): void {
    const splitAction = this.getAction('split');
    if (splitAction != null) {
      splitAction.disabled = this.combatRow.getDisplayedCount(false) > 1;
    }
  }

  ngOnDestroy() {
    this.eventSub.unsubscribe();
  }

  onCardClick(): void {
    this.cardClick.emit(this.combatRow);
  }

  onHpClick(event: MouseEvent, combatCreature: CombatCreature): void {
    event.stopPropagation();
    this.hpClick.emit(combatCreature);
  }

  onKillClick(event: MouseEvent, combatCreature: CombatCreature): void {
    event.stopPropagation();
    if (!combatCreature.dead) {
      this.kill.emit(combatCreature);
    }
  }

  onFleeClick(event: MouseEvent, combatRow: CombatRow): void {
    event.stopPropagation();
    this.flee.emit(combatRow);
  }

  onSpeedTypeClick(event: MouseEvent): void {
    event.stopPropagation();
    const combatCreature = this.getSelectedCombatCreature();
    this.speedType.emit(combatCreature);
  }

  combatCreatureSelectedChange(event: MatRadioChange, combatCreature: CombatCreature): void {
    this.combatRow.combatCreatures.forEach((_combatCreature: CombatCreature) => {
      _combatCreature.setSelected(false);
    });
    combatCreature.setSelected(true);
    this.updateActions(combatCreature);
    this.onCardClick();
  }

  actionClick(action: PageMenuAction): void {
    switch (action.event) {
      case 'adjust':
        this.hpClick.emit(this.getSelectedCombatCreature())
        break;
      case 'kill':
        this.kill.emit(this.getSelectedCombatCreature())
        break;
      case 'flee':
      case 'flee-group':
        this.flee.emit(this.combatRow);
        break;
      case 'speed':
        this.speedType.emit(this.getSelectedCombatCreature());
        break;
      case 'add':
        this.addCreatures.emit(this.combatRow);
        break;
      case 'split':
        this.splitGroup.emit(this.combatRow)
        break;
      case 'refresh':
        this.refresh.emit(this.getSelectedCombatCreature());
        break;
    }
  }

  private getAction(event: string): PageMenuAction {
    return _.find(this.actions, (combatCreature: PageMenuAction) => { return combatCreature.event === event; });
  }

  private getSelectedCombatCreature(): CombatCreature {
    return this.combatRow.getSelectedCombatCreature();
  }
}
