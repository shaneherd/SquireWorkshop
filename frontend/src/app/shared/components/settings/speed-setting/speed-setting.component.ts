import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {CharacterSpeedSetting} from '../../../models/creatures/characters/character-settings';

@Component({
  selector: 'app-speed-setting',
  templateUrl: './speed-setting.component.html',
  styleUrls: ['./speed-setting.component.scss']
})
export class SpeedSettingComponent {
  @Input() characterSpeedSetting: CharacterSpeedSetting;
  @Output() halfChange = new EventEmitter();
  @Output() roundUpChange = new EventEmitter();

  constructor() { }

  useHalf(event: MatCheckboxChange): void {
    this.characterSpeedSetting.useHalf = event.checked;
    this.halfChange.emit();
  }

  roundUp(event: MatCheckboxChange): void {
    this.characterSpeedSetting.roundUp = event.checked;
    this.roundUpChange.emit();
  }

}
