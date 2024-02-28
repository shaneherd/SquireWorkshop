import {Component, Input} from '@angular/core';
import {ProficiencyCollection} from '../../models/proficiency-collection';

@Component({
  selector: 'app-proficiency-panels',
  templateUrl: './proficiency-panels.component.html',
  styleUrls: ['./proficiency-panels.component.scss']
})
export class ProficiencyPanelsComponent {
  @Input() proficiencyCollection: ProficiencyCollection;
  @Input() editing: boolean;
  @Input() loading: boolean;
  @Input() showSecondary = false;
  @Input() showChoose = true;
  @Input() showAbilitySection = true;
  @Input() showTooltips = true;

  constructor() { }

}
