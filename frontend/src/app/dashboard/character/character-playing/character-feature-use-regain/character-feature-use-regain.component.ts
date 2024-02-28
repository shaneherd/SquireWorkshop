import {Component, Input} from '@angular/core';
import {CreatureFeature} from '../../../../shared/models/creatures/creature-feature';

@Component({
  selector: 'app-character-feature-use-regain',
  templateUrl: './character-feature-use-regain.component.html',
  styleUrls: ['./character-feature-use-regain.component.scss']
})
export class CharacterFeatureUseRegainComponent {
  @Input() creatureFeature: CreatureFeature;

  constructor() { }

}
