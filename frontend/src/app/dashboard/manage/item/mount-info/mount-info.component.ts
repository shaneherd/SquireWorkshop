import {Component, Input} from '@angular/core';
import {Mount} from '../../../../shared/models/items/mount';

@Component({
  selector: 'app-mount-info',
  templateUrl: './mount-info.component.html',
  styleUrls: ['./mount-info.component.scss']
})
export class MountInfoComponent {
  @Input() mount: Mount;
  @Input() editing: boolean;

  constructor() { }

  speedChange(input): void {
    this.mount.speed = input.value;
  }

  carryingCapacityChange(input): void {
    this.mount.carryingCapacity = input.value;
  }

}
