import {Component, Input, OnInit} from '@angular/core';
import {Monster, MonsterFeature} from '../../../../shared/models/creatures/monsters/monster';
import {MonsterService} from '../../../../core/services/creatures/monster.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-monster-feature-section',
  templateUrl: './monster-feature-section.component.html',
  styleUrls: ['./monster-feature-section.component.scss']
})
export class MonsterFeatureSectionComponent implements OnInit {
  @Input() monster: Monster;
  @Input() editing = false;
  @Input() isPublic = false;
  @Input() isShared = false;

  features: MonsterFeature[] = [];
  disabled = false;
  viewingFeature: MonsterFeature = null;

  constructor(
    private monsterService: MonsterService
  ) { }

  ngOnInit() {
    this.initializeFeatures();
  }

  private initializeFeatures(): void {
    this.monsterService.getFeatures(this.monster.id).then((features: MonsterFeature[]) => {
      this.features = features;
    });
  }

  featureClick(feature: MonsterFeature): void {
    this.viewingFeature = _.cloneDeep(feature);
    this.updateClickDisabled();
  }

  addFeature(): void {
    const newFeature = new MonsterFeature();
    newFeature.author = true;
    this.viewingFeature = newFeature;
    this.updateClickDisabled();
  }

  closeFeature(): void {
    this.viewingFeature = null;
    this.updateClickDisabled();
  }

  saveFeature(): void {
    this.viewingFeature = null;
    this.updateClickDisabled();
    this.initializeFeatures();
  }

  private updateClickDisabled(): void {
    this.disabled = this.viewingFeature != null;
  }
}
