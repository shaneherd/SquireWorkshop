import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {BattleMonsterFeature} from '../../../../shared/models/creatures/battle-monster-feature';

@Component({
  selector: 'app-battle-monster-feature-card',
  templateUrl: './battle-monster-feature-card.component.html',
  styleUrls: ['./battle-monster-feature-card.component.scss']
})
export class BattleMonsterFeatureCardComponent implements OnInit {
  @Input() feature: BattleMonsterFeature;
  @Input() clickDisabled = false;
  @Input() highlightActive = false;
  @Input() highlightNonActive = false;
  @Input() canActivate = false;
  @Output() featureClick = new EventEmitter<BattleMonsterFeature>();

  constructor() { }

  ngOnInit() {
  }

  onFeatureClick(): void {
    if (!this.clickDisabled) {
      this.featureClick.emit(this.feature);
    }
  }

}
