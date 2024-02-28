import {Component} from '@angular/core';
import {MenuItem} from '../../../../shared/models/menuItem.model';
import {CasterTypeService} from '../../../../core/services/attributes/caster-type.service';

@Component({
  selector: 'app-caster-type-list',
  templateUrl: './caster-type-list.component.html',
  styleUrls: ['./caster-type-list.component.scss']
})
export class CasterTypeListComponent {
  casterTypes: MenuItem[] = [];
  loading = true;

  constructor(
    public casterTypeService: CasterTypeService
  ) { }
}
