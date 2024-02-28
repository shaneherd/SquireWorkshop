import {Component, Input, OnInit} from '@angular/core';
import {CreatureConfigurationCollection} from '../../../../shared/models/creatures/configs/creature-configuration-collection';
import {BattleMonster} from '../../../../shared/models/creatures/battle-monsters/battle-monster';
import {BattleMonsterFeature} from '../../../../shared/models/creatures/battle-monster-feature';
import {EVENTS} from '../../../../constants';
import {Subscription} from 'rxjs';
import {EventsService} from '../../../../core/services/events.service';

@Component({
  selector: 'app-battle-monster-features',
  templateUrl: './battle-monster-features.component.html',
  styleUrls: ['./battle-monster-features.component.scss']
})
export class BattleMonsterFeaturesComponent implements OnInit {
  @Input() battleMonster: BattleMonster;
  @Input() collection: CreatureConfigurationCollection;
  @Input() columnIndex: number;

  eventSub: Subscription;
  clickDisabled = false;
  viewingFeature: BattleMonsterFeature = null;
  viewingInfo = false;

  constructor(
    private eventsService: EventsService
  ) { }

  ngOnInit() {
    this.eventSub = this.eventsService.events.subscribe(event => {
      if (event === (EVENTS.MenuAction.FeatureDetails + this.columnIndex)) {
        this.infoClick();
      }
    });
  }

  onFeatureClick(feature: BattleMonsterFeature): void {
    this.viewingFeature = feature;
    this.updateClickDisabled();
  }

  useFeature(feature: BattleMonsterFeature): void {
    this.viewingFeature = null;
    this.updateClickDisabled();
  }

  closeFeature(): void {
    this.viewingFeature = null;
    this.updateClickDisabled();
  }

  private infoClick(): void {
    this.viewingInfo = true;
    this.updateClickDisabled();
  }

  saveInfo(): void {
    this.viewingInfo = false;
    this.updateClickDisabled();
  }

  closeInfo(): void {
    this.viewingInfo = false;
    this.updateClickDisabled();
  }

  private updateClickDisabled(): void {
    this.clickDisabled = this.viewingFeature != null || this.viewingInfo;
  }

}
