import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MonsterAction} from '../../../../../shared/models/creatures/monsters/monster';
import {CompanionAction} from '../../../../../shared/models/creatures/companion-action';

@Component({
  selector: 'app-companion-action-card',
  templateUrl: './companion-action-card.component.html',
  styleUrls: ['./companion-action-card.component.scss']
})
export class CompanionActionCardComponent implements OnInit {
  @Input() companionAction: CompanionAction;
  @Input() clickDisabled = false;
  @Input() highlightActive = false;
  @Input() highlightNonActive = false;
  @Input() canActivate = false;
  @Output() cardClick = new EventEmitter<CompanionAction>();

  action: MonsterAction;

  constructor() { }

  ngOnInit() {
    this.action = this.companionAction.monsterAction;
  }

  actionClick(): void {
    this.cardClick.emit(this.companionAction);
  }

}
