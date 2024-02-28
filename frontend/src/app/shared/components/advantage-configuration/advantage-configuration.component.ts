import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Proficiency} from '../../models/proficiency';
import {MatCheckboxChange} from '@angular/material/checkbox';

@Component({
  selector: 'app-advantage-configuration',
  templateUrl: './advantage-configuration.component.html',
  styleUrls: ['./advantage-configuration.component.scss']
})
export class AdvantageConfigurationComponent {
  @Input() proficiency: Proficiency = new Proficiency();
  @Output() change = new EventEmitter();

  constructor() { }

  advantageChange(event: MatCheckboxChange): void {
    this.proficiency.advantage = event.checked;
    this.change.emit();
  }

  disadvantageChange(event: MatCheckboxChange): void {
    this.proficiency.disadvantage = event.checked;
    this.change.emit();
  }

}
