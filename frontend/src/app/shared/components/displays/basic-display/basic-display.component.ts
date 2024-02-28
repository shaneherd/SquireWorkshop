import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-basic-display',
  templateUrl: './basic-display.component.html',
  styleUrls: ['./basic-display.component.scss']
})
export class BasicDisplayComponent {
  @Input() label = '';
  @Input() value = 0;
  @Input() alwaysDisplay = false;
  @Input() class = '';

  constructor() { }

}
