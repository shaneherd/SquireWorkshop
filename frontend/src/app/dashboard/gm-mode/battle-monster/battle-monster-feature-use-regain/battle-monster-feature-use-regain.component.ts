import {Component, Input, OnInit} from '@angular/core';
import {BattleMonsterFeature} from '../../../../shared/models/creatures/battle-monster-feature';

@Component({
  selector: 'app-battle-monster-feature-use-regain',
  templateUrl: './battle-monster-feature-use-regain.component.html',
  styleUrls: ['./battle-monster-feature-use-regain.component.scss']
})
export class BattleMonsterFeatureUseRegainComponent implements OnInit {
  @Input() battleMonsterFeature: BattleMonsterFeature;

  constructor() { }

  ngOnInit() {
  }

}
