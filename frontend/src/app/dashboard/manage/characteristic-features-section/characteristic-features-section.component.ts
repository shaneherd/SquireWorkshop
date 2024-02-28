import {Component, Input, OnInit} from '@angular/core';
import {Characteristic} from '../../../shared/models/characteristics/characteristic';
import {Feature} from '../../../shared/models/powers/feature';
import {CharacteristicService} from '../../../core/services/characteristics/characteristic.service';
import {ListObject} from '../../../shared/models/list-object';
import * as _ from 'lodash';

@Component({
  selector: 'app-characteristic-features-section',
  templateUrl: './characteristic-features-section.component.html',
  styleUrls: ['./characteristic-features-section.component.scss']
})
export class CharacteristicFeaturesSectionComponent implements OnInit {
  @Input() characteristic: Characteristic;
  @Input() includeChildren = false;
  @Input() editing = false;
  @Input() isPublic = false;
  @Input() isShared = false;

  features: Feature[] = [];
  disabled = false;
  viewingFeature: Feature = null;

  constructor(
    private characteristicService: CharacteristicService
  ) { }

  ngOnInit() {
    this.initializeFeatures();
  }

  private initializeFeatures(): void {
    this.characteristicService.getFeatures(this.characteristic.id, this.includeChildren).then((features: Feature[]) => {
      this.features = features;
    });
  }

  featureClick(feature: Feature): void {
    this.viewingFeature = _.cloneDeep(feature);
    this.updateClickDisabled();
  }

  addFeature(): void {
    const newFeature = new Feature();
    newFeature.author = true;
    newFeature.characteristicType = this.characteristic.characteristicType;
    newFeature.characteristic = new ListObject(this.characteristic.id, this.characteristic.name);
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
