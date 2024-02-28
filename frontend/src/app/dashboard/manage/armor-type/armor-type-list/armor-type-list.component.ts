import {Component} from '@angular/core';
import {ArmorTypeService} from '../../../../core/services/attributes/armor-type.service';

@Component({
  selector: 'app-armor-type-list',
  templateUrl: './armor-type-list.component.html',
  styleUrls: ['./armor-type-list.component.scss']
})
export class ArmorTypeListComponent {
  loading = true;

  constructor(
    public armorTypeService: ArmorTypeService
  ) { }
}
