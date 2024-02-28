import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Encounter} from '../../../../shared/models/campaigns/encounters/encounter';
import {CombatCreature, CombatRow} from '../../../../shared/models/combat-row';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-encounter-initiative-slide-in',
  templateUrl: './encounter-initiative-slide-in.component.html',
  styleUrls: ['./encounter-initiative-slide-in.component.scss']
})
export class EncounterInitiativeSlideInComponent implements OnInit {
  @Input() encounter: Encounter;
  @Input() round = 0;
  @Input() turn = 0;
  @Input() noCreaturesVisible = false;
  @Input() previousEnabled = true;
  @Input() combatRows: CombatRow[] = [];
  @Output() previous = new EventEmitter();
  @Output() next = new EventEmitter();
  @Output() close = new EventEmitter();
  @Output() cardClick = new EventEmitter<CombatRow>();
  @Output() hpClick = new EventEmitter<CombatCreature>();
  @Output() kill = new EventEmitter<CombatCreature>();
  @Output() flee = new EventEmitter<CombatRow>();
  @Output() speedType = new EventEmitter<CombatCreature>();
  @Output() addCreatures = new EventEmitter<CombatRow>();
  @Output() splitGroup = new EventEmitter<CombatRow>();
  @Output() refresh = new EventEmitter<CombatCreature>();

  @Input() hideKilled = true;
  @Output() hideKilledChange = new EventEmitter<boolean>();

  roundTurn = '';

  constructor(
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.roundTurn = this.translate.instant('Encounter.RoundTurn', {round: this.round, turn: this.turn});
  }

  closeClick(): void {
    this.close.emit();
  }

  previousClick(): void {
    this.previous.emit();
  }

  nextClick(): void {
    this.next.emit();
  }

  onCardClick(initiativeTurnObject: CombatRow): void {
    this.cardClick.emit(initiativeTurnObject);
  }

  onHpClick(combatCreature: CombatCreature): void {
    this.hpClick.emit(combatCreature);
  }

  onHideKilledChange(checked: boolean): void {
    this.hideKilledChange.emit(checked);
  }

  onKillClick(combatCreature: CombatCreature): void {
    this.kill.emit(combatCreature);
  }

  onFleeClick(combatRow: CombatRow): void {
    this.flee.emit(combatRow);
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
