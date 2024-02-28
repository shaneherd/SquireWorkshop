import {Component, Input} from '@angular/core';
import {Monster} from '../../../../shared/models/creatures/monsters/monster';
import {ItemQuantity} from '../../../../shared/models/items/item-quantity';
import {SelectionItem} from '../../../../shared/models/items/selection-item';
import {MonsterService} from '../../../../core/services/creatures/monster.service';

@Component({
  selector: 'app-monster-items-section',
  templateUrl: './monster-items-section.component.html',
  styleUrls: ['./monster-items-section.component.scss']
})
export class MonsterItemsSectionComponent {
  @Input() monster: Monster;
  @Input() editing = false;
  @Input() isPublic = false;
  @Input() isShared = false;

  disabled = false;
  viewingItem: ItemQuantity = null;
  addingItems = false;

  constructor(
    private monsterService: MonsterService
  ) { }

  addItems(): void {
    this.addingItems = true;
    this.updateDisabled();
  }

  saveItems(selectedItems: SelectionItem[]): void {
    selectedItems.forEach((selectionItem: SelectionItem) => {
      const index = this.findItemIndex(selectionItem);
      if (index > -1) {
        this.monster.items[index].quantity += 1;
      } else {
        const itemQuantity: ItemQuantity = new ItemQuantity();

        itemQuantity.item = selectionItem.item;
        itemQuantity.item.subItem = selectionItem.selectedApplicableItem;
        itemQuantity.quantity = 1;
        this.monster.items.push(itemQuantity);
      }
    });

    this.monster.items.sort((left: ItemQuantity, right: ItemQuantity) => {
      return left.item.name.localeCompare(right.item.name);
    });

    this.monsterService.updateItems(this.monster.id, this.getAuthorItems()).then(() => {
      this.addingItems = false;
      this.updateDisabled();
    });
  }

  private getAuthorItems(): ItemQuantity[] {
    const items: ItemQuantity[] = [];
    this.monster.items.forEach((item: ItemQuantity) => {
      if (item.author) {
        items.push(item);
      }
    });
    return items;
  }

  private findItemIndex(selectionItem: SelectionItem): number {
    for (let i = 0; i < this.monster.items.length; i++) {
      const itemQuantity = this.monster.items[i];
      if (itemQuantity.author && itemQuantity.item.id === selectionItem.item.id) {
        if (itemQuantity.item.subItem == null && selectionItem.selectedApplicableItem == null) {
          return i;
        }
        if (itemQuantity.item.subItem != null && selectionItem.selectedApplicableItem != null && itemQuantity.item.subItem.id === selectionItem.selectedApplicableItem.id) {
          return i;
        }
      }
    }
    return -1;
  }

  cancelItems(): void {
    this.addingItems = false;
    this.updateDisabled();
  }

  editItem(itemQuantity: ItemQuantity): void {
    this.viewingItem = itemQuantity;
    this.updateDisabled();
  }

  saveItem(itemQuantity: ItemQuantity): void {
    this.viewingItem = null;
    this.monsterService.updateItemQuantity(this.monster.id, itemQuantity.item.id, itemQuantity).then(() => {
      this.updateDisabled();
    });
  }

  cancelItem(itemQuantity: ItemQuantity): void {
    this.viewingItem = null;
    this.updateDisabled();
  }

  removeItem(itemQuantity: ItemQuantity): void {
    const index = this.monster.items.indexOf(itemQuantity);
    if (index > -1) {
      this.monster.items.splice(index, 1);
      this.monsterService.deleteItem(this.monster.id, itemQuantity.item.id, itemQuantity).then(() => {
        this.viewingItem = null;
        this.updateDisabled();
      });
    } else {
      this.viewingItem = null;
      this.updateDisabled();
    }
  }

  private updateDisabled(): void {
    this.disabled = this.viewingItem != null || this.addingItems;
  }

}
