import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-category-display',
  templateUrl: './type-display.component.html',
  styleUrls: ['./type-display.component.scss']
})
export class TypeDisplayComponent {
  @Input() type = '';
  @Input() description = '';
  @Input() class = '';

  constructor() { }

}
