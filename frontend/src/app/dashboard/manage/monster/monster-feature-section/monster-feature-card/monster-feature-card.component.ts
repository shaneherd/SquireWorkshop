import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MonsterFeature} from '../../../../../shared/models/creatures/monsters/monster';

@Component({
  selector: 'app-monster-feature-card',
  templateUrl: './monster-feature-card.component.html',
  styleUrls: ['./monster-feature-card.component.scss']
})
export class MonsterFeatureCardComponent {
  @Input() feature: MonsterFeature;
  @Input() clickDisabled = false;
  @Output() featureClick = new EventEmitter<MonsterFeature>();

  constructor() { }

  onFeatureClick(): void {
    this.featureClick.emit(this.feature);
  }
}
