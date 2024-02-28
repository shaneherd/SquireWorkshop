import {Component} from '@angular/core';
import {AreaOfEffectService} from '../../../../core/services/attributes/area-of-effect.service';

@Component({
  selector: 'app-area-of-effect-list',
  templateUrl: './area-of-effect-list.component.html',
  styleUrls: ['./area-of-effect-list.component.scss']
})
export class AreaOfEffectListComponent {
  loading = true;

  constructor(
    public areaOfEffectService: AreaOfEffectService,
  ) { }
}
