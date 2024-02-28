import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MonsterFeature} from '../../../../../shared/models/creatures/monsters/monster';
import {CompanionFeature} from '../../../../../shared/models/creatures/companion-feature';

@Component({
  selector: 'app-companion-feature-card',
  templateUrl: './companion-feature-card.component.html',
  styleUrls: ['./companion-feature-card.component.scss']
})
export class CompanionFeatureCardComponent implements OnInit {
  @Input() companionFeature: CompanionFeature;
  @Input() clickDisabled = false;
  @Input() highlightActive = false;
  @Input() highlightNonActive = false;
  @Input() canActivate = false;
  @Output() cardClick = new EventEmitter<CompanionFeature>();

  feature: MonsterFeature;

  constructor() { }

  ngOnInit() {
    this.feature = this.companionFeature.monsterFeature;
  }

  featureClick(): void {
    this.cardClick.emit(this.companionFeature);
  }

}
