import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-card-badge',
  templateUrl: './card-badge.component.html',
  styleUrls: ['./card-badge.component.scss']
})
export class CardBadgeComponent {
  @Input() value = 0;
  @Input() maxValue = 0;

  constructor() { }

}
