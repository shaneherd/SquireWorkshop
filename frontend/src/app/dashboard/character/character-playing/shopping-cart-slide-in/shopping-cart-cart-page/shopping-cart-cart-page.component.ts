import {Component, EventEmitter, Input, Output} from '@angular/core';
import {EVENTS} from '../../../../../constants';
import {EventsService} from '../../../../../core/services/events.service';
import {SelectionItem} from '../../../../../shared/models/items/selection-item';

@Component({
  selector: 'app-shopping-cart-cart-page',
  templateUrl: './shopping-cart-cart-page.component.html',
  styleUrls: ['./shopping-cart-cart-page.component.scss']
})
export class ShoppingCartCartPageComponent {
  @Input() visible: boolean;
  @Input() items: SelectionItem[] = [];
  @Output() removeItem = new EventEmitter<SelectionItem>();

  constructor(
    private eventsService: EventsService
  ) { }

  quantityChange(input, itemQuantity: SelectionItem): void {
    itemQuantity.quantity = parseInt(input.value, 10);
    this.eventsService.dispatchEvent(EVENTS.CartItemsChanged);
  }

  onRemoveItem(itemQuantity: SelectionItem): void {
    this.removeItem.emit(itemQuantity);
  }

}
