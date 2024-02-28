import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Proficiency} from '../../models/proficiency';
import {MatCheckboxChange} from '@angular/material/checkbox';

@Component({
  selector: 'app-proficiency-configuration',
  templateUrl: './proficiency-configuration.component.html',
  styleUrls: ['./proficiency-configuration.component.scss']
})
export class ProficiencyConfigurationComponent {
  @Input() proficiency: Proficiency;
  @Input() proficiencyDisabled = false;
  @Output() proficiencyChange = new EventEmitter();

  constructor() { }

  onProficiencyChange(event: MatCheckboxChange): void {
    this.proficiencyChange.emit(this.proficiency);
  }

}
