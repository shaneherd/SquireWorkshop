import {Component, Input} from '@angular/core';
import {DeityCategory} from '../../../../shared/models/attributes/deity-category';

@Component({
  selector: 'app-deity-category-details',
  templateUrl: './deity-category-details.component.html',
  styleUrls: ['./deity-category-details.component.scss']
})
export class DeityCategoryDetailsComponent {
  @Input() deityCategory: DeityCategory;

  constructor() { }
}
