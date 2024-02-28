import {Component, Input} from '@angular/core';
import {Treasure} from '../../../../shared/models/items/treasure';

@Component({
  selector: 'app-treasure-info',
  templateUrl: './treasure-info.component.html',
  styleUrls: ['./treasure-info.component.scss']
})
export class TreasureInfoComponent {
  @Input() treasure: Treasure;
  @Input() editing: boolean;

  constructor() { }

}
