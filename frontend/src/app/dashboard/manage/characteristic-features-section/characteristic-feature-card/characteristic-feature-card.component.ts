import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Feature} from '../../../../shared/models/powers/feature';

@Component({
  selector: 'app-characteristic-feature-card',
  templateUrl: './characteristic-feature-card.component.html',
  styleUrls: ['./characteristic-feature-card.component.scss']
})
export class CharacteristicFeatureCardComponent {
  @Input() feature: Feature;
  @Input() clickDisabled = false;
  @Input() showCharacteristic = false;
  @Output() featureClick = new EventEmitter<Feature>();

  constructor() { }

  onFeatureClick(): void {
    this.featureClick.emit(this.feature);
  }

}
