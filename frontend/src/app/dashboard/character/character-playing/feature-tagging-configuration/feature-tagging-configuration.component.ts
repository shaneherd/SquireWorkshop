import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {CreatureFeatureTagConfigurationCollection} from '../../../../shared/models/creatures/creature-feature-tag-configuration-collection';
import {CreatureFeatureTagConfiguration} from '../../../../shared/models/creatures/creature-feature-tag-configuration';
import {CreatureFeature} from '../../../../shared/models/creatures/creature-feature';

@Component({
  selector: 'app-feature-tagging-configuration',
  templateUrl: './feature-tagging-configuration.component.html',
  styleUrls: ['./feature-tagging-configuration.component.scss']
})
export class FeatureTaggingConfigurationComponent {
  @Input() tagCollection: CreatureFeatureTagConfigurationCollection;
  @Output() tagClick = new EventEmitter();
  @Output() featureClick = new EventEmitter();

  constructor() { }

  inputClick(event: MouseEvent): void {
    event.stopPropagation();
  }

  onTagClick(): void {
    this.tagClick.emit(this.tagCollection);
  }

  onFeatureClick(creatureFeature: CreatureFeature): void {
    this.featureClick.emit(creatureFeature);
  }

  checkChange(event: MatCheckboxChange, configuration: CreatureFeatureTagConfiguration): void {
    configuration.checked = event.checked;
  }
}
