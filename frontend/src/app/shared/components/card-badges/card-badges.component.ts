import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-card-badges',
  templateUrl: './card-badges.component.html',
  styleUrls: ['./card-badges.component.scss']
})
export class CardBadgesComponent {
  @Input() quantity = 0;
  @Input() alwaysDisplayQuantity = false;
  @Input() charges = 0;
  @Input() maxCharges = 0;
  @Input() nestedCount = 0;
  @Input() spellCount = 0;
  @Input() maxValue = 99;

  constructor() { }

}
