import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Feature} from '../../../../shared/models/powers/feature';
import {PowerService} from '../../../../core/services/powers/power.service';
import {FeatureMenuItem} from '../features-selection-list.component';
import {PlayerCharacter} from '../../../../shared/models/creatures/characters/player-character';
import {CreatureConfigurationCollection} from '../../../../shared/models/creatures/configs/creature-configuration-collection';

@Component({
  selector: 'app-add-remove-feature',
  templateUrl: './add-remove-feature.component.html',
  styleUrls: ['./add-remove-feature.component.scss']
})
export class AddRemoveFeatureComponent implements OnInit {
  @Input() feature: FeatureMenuItem;
  @Input() playerCharacter: PlayerCharacter;
  @Input() collection: CreatureConfigurationCollection;
  @Output() save = new EventEmitter();
  @Output() cancel = new EventEmitter();

  loading = true;
  viewingFeature: Feature = null;

  constructor(
    private powerService: PowerService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.powerService.getPower(this.feature.feature.id).then((feature: Feature) => {
      this.viewingFeature = feature;
      this.loading = false;
    });
  }

  close(): void {
    this.cancel.emit();
  }

  continue(): void {
    this.save.emit(this.feature);
  }
}
