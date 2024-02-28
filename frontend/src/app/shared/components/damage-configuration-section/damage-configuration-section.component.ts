import {Component, Input} from '@angular/core';
import {DamageConfiguration} from '../../models/damage-configuration';

@Component({
  selector: 'app-damage-configuration-section',
  templateUrl: './damage-configuration-section.component.html',
  styleUrls: ['./damage-configuration-section.component.scss']
})
export class DamageConfigurationSectionComponent {
  @Input() damageConfigurations: DamageConfiguration[] = [];
  @Input() editing = false;
  @Input() disabled = false;
  @Input() showLabel = true;

  configuringDamage: DamageConfiguration;
  addingDamage = false;

  constructor() { }

  configureDamage(config: DamageConfiguration): void {
    if (this.disabled || this.configuringDamage != null) {
      return;
    }
    this.addingDamage = false;
    this.configuringDamage = config;
  }

  damageConfigurationClose(): void {
    this.configuringDamage = null;
    this.addingDamage = false;
  }

  damageConfigurationContinue(config: DamageConfiguration): void {
    if (this.addingDamage) {
      this.damageConfigurations.push(config);
    }
    this.configuringDamage = null;
    this.addingDamage = false;
  }

  deleteDamage(config: DamageConfiguration): void {
    if (this.disabled || this.configuringDamage != null) {
      return;
    }
    const index = this.damageConfigurations.indexOf(config);
    if (index > -1) {
      this.damageConfigurations.splice(index, 1);
    }
  }

  addDamage(): void {
    if (this.disabled || this.configuringDamage != null) {
      return;
    }
    this.addingDamage = true;
    this.configuringDamage = new DamageConfiguration();
  }
}
