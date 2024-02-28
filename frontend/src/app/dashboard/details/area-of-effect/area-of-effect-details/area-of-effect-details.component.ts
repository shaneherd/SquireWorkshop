import {Component, Input} from '@angular/core';
import {AreaOfEffect} from '../../../../shared/models/attributes/area-of-effect';

@Component({
  selector: 'app-area-of-effect-details',
  templateUrl: './area-of-effect-details.component.html',
  styleUrls: ['./area-of-effect-details.component.scss']
})
export class AreaOfEffectDetailsComponent {
  @Input() areaOfEffect: AreaOfEffect;

  constructor() { }
}
