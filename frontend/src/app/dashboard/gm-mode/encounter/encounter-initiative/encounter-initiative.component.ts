import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Encounter} from '../../../../shared/models/campaigns/encounters/encounter';
import {CombatCreature, CombatRow} from '../../../../shared/models/combat-row';
import {MatSlideToggleChange} from '@angular/material/slide-toggle';
import {EncounterService} from '../../../../core/services/encounter.service';

@Component({
  selector: 'app-encounter-initiative',
  templateUrl: './encounter-initiative.component.html',
  styleUrls: ['./encounter-initiative.component.scss']
})
export class EncounterInitiativeComponent implements OnInit {
  @Input() encounter: Encounter;
  @Input() round = 0;
  @Input() turn = 0;
  @Input() isDesktop = false;
  @Input() showRoundTurn = true;
  @Input() combatRows: CombatRow[] = [];
  @Output() cardClick = new EventEmitter<CombatRow>();
  @Output() hpClick = new EventEmitter<CombatCreature>();
  @Output() kill = new EventEmitter<CombatCreature>();
  @Output() flee = new EventEmitter<CombatRow>();
  @Output() speedType = new EventEmitter<CombatCreature>();
  @Output() collapse = new EventEmitter<void>();
  @Output() addCreatures = new EventEmitter<CombatRow>();
  @Output() splitGroup = new EventEmitter<CombatRow>();
  @Output() refresh = new EventEmitter<CombatCreature>();

  @Input() hideKilled = true;
  @Output() hideKilledChange = new EventEmitter<boolean>();

  constructor(
    private encounterService: EncounterService
  ) { }

  ngOnInit() {
  }

  onCardClick(combatRow: CombatRow): void {
    this.cardClick.emit(combatRow);
  }

  onHpClick(combatCreature: CombatCreature): void {
    this.hpClick.emit(combatCreature);
  }

  onHideKilledChange(event: MatSlideToggleChange): void {
    this.hideKilled = event.checked;
    this.encounter.hideKilled = this.hideKilled;

    // don't wait for the setting to be saved to the backend. go ahead and start updating the list.
    this.hideKilledChange.emit(this.hideKilled);

    this.encounterService.updateHideKilled(this.encounter.id, this.hideKilled);
  }

  onKillClick(combatCreature: CombatCreature): void {
    this.kill.emit(combatCreature);
  }

  onFleeClick(combatRow: CombatRow): void {
    this.flee.emit(combatRow);
  }

  collapseClick(): void {
    this.collapse.emit();
  }

  addCreaturesClick(combatRow: CombatRow): void {
    this.addCreatures.emit(combatRow);
  }

  splitGroupClick(combatRow: CombatRow): void {
    this.splitGroup.emit(combatRow);
  }

  onSpeedTypeClick(combatCreature: CombatCreature): void {
    this.speedType.emit(combatCreature);
  }

  onRefresh(combatCreature: CombatCreature): void {
    this.refresh.emit(combatCreature);
  }
}
