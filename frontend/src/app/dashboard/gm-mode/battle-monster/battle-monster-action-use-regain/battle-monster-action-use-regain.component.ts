import {Component, Input, OnInit} from '@angular/core';
import {BattleMonsterAction} from '../../../../shared/models/creatures/battle-monster-action';

@Component({
  selector: 'app-battle-monster-action-use-regain',
  templateUrl: './battle-monster-action-use-regain.component.html',
  styleUrls: ['./battle-monster-action-use-regain.component.scss']
})
export class BattleMonsterActionUseRegainComponent implements OnInit {
  @Input() battleMonsterAction: BattleMonsterAction;

  constructor() { }

  ngOnInit() {
  }

}
