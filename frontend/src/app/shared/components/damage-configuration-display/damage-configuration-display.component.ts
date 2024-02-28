import {Component, EventEmitter, Input, Output} from '@angular/core';
import {DamageConfiguration} from '../../models/damage-configuration';

@Component({
  selector: 'app-damage-configuration-display',
  templateUrl: './damage-configuration-display.component.html',
  styleUrls: ['./damage-configuration-display.component.scss']
})
export class DamageConfigurationDisplayComponent {
  @Input() config: DamageConfiguration;
  @Input() editing = false;
  @Input() disabled = false;
  @Input() first = false;

  @Output() delete = new EventEmitter();
  @Output() configure = new EventEmitter();

  constructor() { }

  deleteDamage(): void {
    if (!this.disabled) {
      this.delete.emit(this.config);
    }
  }

  configureDamage(): void {
    if (!this.disabled) {
      this.configure.emit(this.config);
    }
  }

}
