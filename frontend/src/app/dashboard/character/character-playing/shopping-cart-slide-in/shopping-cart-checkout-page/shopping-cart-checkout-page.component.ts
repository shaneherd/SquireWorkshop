import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Creature} from '../../../../../shared/models/creatures/creature';
import {ListObject} from '../../../../../shared/models/list-object';
import {CreatureItemService} from '../../../../../core/services/creatures/creature-item.service';
import {CreatureItemAction} from '../../../../../shared/models/creatures/creature-item-action.enum';
import {SelectionItem} from '../../../../../shared/models/items/selection-item';

@Component({
  selector: 'app-shopping-cart-checkout-page',
  templateUrl: './shopping-cart-checkout-page.component.html',
  styleUrls: ['./shopping-cart-checkout-page.component.scss']
})
export class ShoppingCartCheckoutPageComponent implements OnInit {
  @Input() visible: boolean;
  @Input() creature: Creature;
  @Input() id: string;
  @Input() items: SelectionItem[] = [];
  @Output() continue = new EventEmitter<ListObject>();

  containers: ListObject[] = [];
  container: ListObject = null;

  constructor(
    private creatureItemService: CreatureItemService
  ) { }

  ngOnInit() {
    //all carried containers
    this.containers = this.creatureItemService.getContainerList(this.creature, CreatureItemAction.PICKUP, null);
    if (this.containers.length > 0) {
      this.containerChange(this.containers[0]);
    }
  }

  onContinuePurchase(): void {
    this.continue.emit(this.container);
  }

  containerChange(container: ListObject): void {
    this.container = container;
  }

}
