import {Component, Input, OnInit} from '@angular/core';
import {Pack} from '../../../../shared/models/items/pack';
import {NAVIGATION_DELAY} from '../../../../constants';
import {ListObject} from '../../../../shared/models/list-object';
import {ItemQuantity} from '../../../../shared/models/items/item-quantity';
import {SelectionItem} from '../../../../shared/models/items/selection-item';

@Component({
  selector: 'app-pack-info',
  templateUrl: './pack-info.component.html',
  styleUrls: ['./pack-info.component.scss']
})
export class PackInfoComponent implements OnInit {
  @Input() pack: Pack;
  @Input() editing: boolean;

  addingItems = false;
  itemsToRemove: ListObject[] = [];
  items: ItemQuantity[] = [];

  constructor() { }

  ngOnInit() {
    if (this.pack.id !== '0') {
      //don't allow itself to be added to the pack (infinite loop)
      this.itemsToRemove.push(this.pack);
    }
  }

  addItems(): void {
    this.addingItems = true;
  }

  cancelAddItems(): void {
    setTimeout(() => {
      this.addingItems = false;
    }, NAVIGATION_DELAY);
  }

  continueAddItems(selectedItems: SelectionItem[]): void {
    selectedItems.forEach((selectionItem: SelectionItem) => {
      const index = this.findPackItemIndex(selectionItem);
      if (index > -1) {
        this.pack.items[index].quantity += 1;
      } else {
        const itemQuantity: ItemQuantity = new ItemQuantity();

        itemQuantity.item = selectionItem.item;
        itemQuantity.item.subItem = selectionItem.selectedApplicableItem;
        itemQuantity.quantity = 1;
        this.pack.items.push(itemQuantity);
      }
    });

    this.pack.items.sort(function(left: ItemQuantity, right: ItemQuantity) {
      return left.item.name.localeCompare(right.item.name);
    });

    setTimeout(() => {
      this.addingItems = false;
    }, NAVIGATION_DELAY);
  }

  private findPackItemIndex(selectionItem: SelectionItem): number {
    for (let i = 0; i < this.pack.items.length; i++) {
      const packItem = this.pack.items[i];
      if (packItem.item.id === selectionItem.item.id) {
        if (packItem.item.subItem == null && selectionItem.selectedApplicableItem == null) {
          return i;
        }
        if (packItem.item.subItem != null && selectionItem.selectedApplicableItem != null && packItem.item.subItem.id === selectionItem.selectedApplicableItem.id) {
          return i;
        }
      }
    }
    return -1;
  }

  removeItem(item: ItemQuantity): void {
    const index = this.pack.items.indexOf(item);
    if (index > -1) {
      this.pack.items.splice(index, 1);
    }
  }

  quantityChange(item: ItemQuantity, input) {
    item.quantity = input.value;
  }

}
