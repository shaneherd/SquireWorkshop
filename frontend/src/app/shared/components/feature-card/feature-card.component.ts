import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CreatureFeature} from '../../models/creatures/creature-feature';
import {PlayerCharacter} from '../../models/creatures/characters/player-character';

@Component({
  selector: 'app-feature-card',
  templateUrl: './feature-card.component.html',
  styleUrls: ['./feature-card.component.scss']
})
export class FeatureCardComponent {
  @Input() playerCharacter: PlayerCharacter;
  @Input() creatureFeature: CreatureFeature;
  @Input() clickDisabled = false;
  @Input() displayTags = false;
  @Input() highlightActive = false;
  @Input() highlightNonActive = false;
  @Input() canActivate = false;
  @Output() featureClick = new EventEmitter();

  constructor() { }

  onFeatureClick(): void {
    if (!this.clickDisabled) {
      this.featureClick.emit(this.creatureFeature);
    }
  }
}
