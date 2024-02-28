import {Component, EventEmitter, HostListener, Input, OnInit, Output, ViewChild} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Creature} from '../../../../shared/models/creatures/creature';
import {ItemListObject} from '../../../../shared/models/items/item-list-object';
import {ItemListResponse} from '../../../../shared/models/items/item-list-response';
import {SelectionItem} from '../../../../shared/models/items/selection-item';
import {FilterDialogData} from '../../../../core/components/filters/filter-dialog-data';
import {Filters} from '../../../../core/components/filters/filters';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ItemFilterDialogComponent} from '../../../../core/components/filters/item-filter-dialog/item-filter-dialog.component';
import {FilterKey} from '../../../../core/components/filters/filter-key.enum';
import {FilterValue} from '../../../../core/components/filters/filter-value';
import {CdkVirtualScrollViewport} from '@angular/cdk/scrolling';
import {ItemService} from '../../../../core/services/items/item.service';
import {YesNoDialogData} from '../../../../core/components/yes-no-dialog/yes-no-dialog-data';
import {YesNoDialogComponent} from '../../../../core/components/yes-no-dialog/yes-no-dialog.component';
import {EventsService} from '../../../../core/services/events.service';
import {EVENTS} from '../../../../constants';
import {NotificationService} from '../../../../core/services/notification.service';
import {CreatureService} from '../../../../core/services/creatures/creature.service';
import {CreatureInventory} from '../../../../shared/models/creatures/creature-inventory';
import {ListObject} from '../../../../shared/models/list-object';
import * as _ from 'lodash';
import {SpellMenuItem} from '../../../selection-list/spell-selection-list/spell-selection-list.component';

@Component({
  selector: 'app-shopping-cart-slide-in',
  templateUrl: './shopping-cart-slide-in.component.html',
  styleUrls: ['./shopping-cart-slide-in.component.scss']
})
export class ShoppingCartSlideInComponent implements OnInit {
  @Input() creature: Creature;
  @Output() cancel = new EventEmitter();
  @Output() continue = new EventEmitter();

  @ViewChild(CdkVirtualScrollViewport, {static: false})
  viewport: CdkVirtualScrollViewport;

  id = _.uniqueId();
  loading = false;
  filters: Filters;
  searchValue = '';

  allItemsLoaded = false;
  selectedItems: SelectionItem[] = [];
  selectionItems: SelectionItem[] = [];
  viewingItem: SelectionItem = null;
  magicalItem: SelectionItem = null;

  headerName = '';
  step = 0;

  constructor(
    private dialog: MatDialog,
    private translate: TranslateService,
    private itemService: ItemService,
    private eventsService: EventsService,
    private notificationService: NotificationService,
    private creatureService: CreatureService
  ) { }

  ngOnInit() {
    this.filters = new Filters();
    this.search();
    this.setStep(0);
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.viewport.checkViewportSize();
  }

  setStep(step: number): void {
    this.step = step;
    switch (this.step) {
      case 0:
        this.headerName = this.translate.instant('Items');
        break;
      case 1:
        this.headerName = this.translate.instant('Cart');
        break;
      case 2:
        this.headerName = this.translate.instant('Checkout');
        break;
    }
  }

  closeDetails(): void {
    const self = this;
    const data = new YesNoDialogData();
    data.title = this.translate.instant('ShoppingCart.Cancel.Title');
    data.message = this.translate.instant('ShoppingCart.Cancel.Message');
    data.yes = () => {
      self.cancel.emit();
    };
    data.no = () => {
      //do nothing
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = data;
    this.dialog.open(YesNoDialogComponent, dialogConfig);
  }

  purchaseClick(): void {
    if (!this.hasItems()) {
      this.notificationService.error(this.translate.instant('ShoppingCart.Error.NoItems'));
    } else {
      this.eventsService.dispatchEvent(EVENTS.SaveWealthAdjustments + this.id);
    }
  }

  private hasItems(): boolean {
    for (let i = 0; i < this.selectedItems.length; i++) {
      if (this.selectedItems[i].quantity > 0) {
        return true;
      }
    }
    return false;
  }

  finishPurchase(container: ListObject): void {
    const creatureItemList = new CreatureInventory();
    creatureItemList.items = this.selectedItems;
    if (container != null) {
      creatureItemList.containerId = container.id;
    }

    this.creatureService.addItems(this.creature, creatureItemList).then(() => {
      this.continue.emit();
    });
  }

  scrolledIndexChange(): void {
    if (this.allItemsLoaded) {
      return;
    }

    const end = this.viewport.getRenderedRange().end;
    const total = this.viewport.getDataLength();
    if (end === total) {
      this.getNextBatch(false);
    }
  }

  private getNextBatch(clear: boolean): void {
    if (!this.loading) {
      if (clear) {
        this.selectionItems = [];
      }
      this.loading = true;
      this.itemService.getItemsWithFilters(this.filters, this.selectionItems.length).then((response: ItemListResponse) => {
        this.selectionItems = this.selectionItems.concat(this.getSelectionItems(response.items));
        this.allItemsLoaded = !response.hasMore;
        this.loading = false;
      });
    }
  }

  private getSelectionItems(items: ItemListObject[]): SelectionItem[] {
    let selectionItems: SelectionItem[] = [];
    items.forEach((item: ItemListObject) => {
      selectionItems.push(this.getSelectionItem(item));
      selectionItems = selectionItems.concat(this.getSelectedMagicalItems(item));
    });
    return selectionItems;
  }

  private getSelectionItem(item: ItemListObject): SelectionItem {
    const selectionItem: SelectionItem = new SelectionItem();
    selectionItem.item = item;
    selectionItem.selected = this.isSelected(selectionItem);
    return selectionItem;
  }

  private getSelectedMagicalItems(item: ItemListObject): SelectionItem[] {
    const magicalItems: SelectionItem[] = [];
    this.selectedItems.forEach((selectedItem: SelectionItem) => {
      if (selectedItem.item.id === item.id && selectedItem.selectedApplicableItem != null) {
        magicalItems.push(selectedItem);
      }
    });
    return magicalItems;
  }

  private isSelected(item: SelectionItem): boolean {
    return this.getIndex(this.selectedItems, item) > -1;
  }

  private getIndex(list: SelectionItem[], selectionItem: SelectionItem): number {
    return _.findIndex(list, (_selectionItem: SelectionItem) => {
      return _selectionItem.item.id === selectionItem.item.id
        && (
          (_selectionItem.selectedApplicableItem == null && selectionItem.selectedApplicableItem == null)
          || (_selectionItem.selectedApplicableItem != null && selectionItem.selectedApplicableItem != null
            && _selectionItem.selectedApplicableItem.id === selectionItem.selectedApplicableItem.id)
        )
      && (
          (_selectionItem.selectedSpell == null && selectionItem.selectedSpell == null)
          || (_selectionItem.selectedSpell != null && selectionItem.selectedSpell != null
            && _selectionItem.selectedSpell.id === selectionItem.selectedSpell.id)
      );
    });
  }

  toggleSelected(selectionItem: SelectionItem): void {
    selectionItem.selected = !selectionItem.selected;
    this.selectionChange(selectionItem);
    this.viewingItem = null;
  }

  selectionChange(selectionItem: SelectionItem): void {
    if (selectionItem.selected) {
      if (selectionItem.item.applicableMagicalItems.length > 0 || (selectionItem.item.applicableSpells.length > 0 && selectionItem.item.requireSelectedSpell)) {
        setTimeout(() => {
          selectionItem.selected = false;
        });
        selectionItem.selectedApplicableItem = null;
        selectionItem.selectedSpell = null;
        this.magicalItem = selectionItem;
      } else {
        selectionItem.quantity = 1;
        this.selectedItems.push(selectionItem);
      }
      this.eventsService.dispatchEvent(EVENTS.CartItemsChanged);
    } else {
      this.onRemoveItem(selectionItem);
    }
  }

  onRemoveItem(itemToRemove: SelectionItem): void {
    const index = this.getIndex(this.selectedItems, itemToRemove);
    if (index > -1) {
      this.selectedItems.splice(index, 1);
    }
    if (itemToRemove.selectedApplicableItem != null) {
      const magicalItemIndex = this.getIndex(this.selectionItems, itemToRemove);
      if (index > -1) {
        this.selectionItems.splice(magicalItemIndex, 1);
        this.selectionItems = [...this.selectionItems];
      }
    } else {
      for (let i = 0; i < this.selectionItems.length; i++) {
        const selectionItem = this.selectionItems[i];
        if (selectionItem.item.id === itemToRemove.item.id) {
          selectionItem.selected = false;
          selectionItem.quantity = 0;
          break;
        }
      }
    }
    this.eventsService.dispatchEvent(EVENTS.CartItemsChanged);
  }

  onItemClick(selectionItem: SelectionItem): void {
    this.viewingItem = selectionItem;
  }

  filter(): void {
    const self = this;
    const data = new FilterDialogData();
    data.filters = this.filters;
    data.apply = (filters: Filters) => {
      self.applyFilters(filters);
    };
    data.clear = () => {
      self.applyFilters(new Filters());
    };

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = data;
    this.dialog.open(ItemFilterDialogComponent, dialogConfig);
  }

  private applyFilters(filters: Filters): void {
    this.filters = filters;
    this.getNextBatch(true);
  }

  private getFilterValue(key: FilterKey): FilterValue {
    for (let i = 0; i < this.filters.filterValues.length; i++) {
      const filterValue = this.filters.filterValues[i];
      if (filterValue.key === key) {
        return filterValue;
      }
    }
    return null;
  }

  search(): void {
    let filterValue = this.getFilterValue(FilterKey.SEARCH);
    if (filterValue == null) {
      filterValue = new FilterValue();
      filterValue.key = FilterKey.SEARCH;
      this.filters.filterValues.push(filterValue);
    }
    filterValue.value = this.searchValue;
    this.getNextBatch(true);
  }

  closeItem(): void {
    this.viewingItem = null;
  }

  continueSpellSelection(spellMenuItem: SpellMenuItem): void {
    const newItem = _.cloneDeep(this.magicalItem);
    newItem.selected = true;
    newItem.selectedSpell = spellMenuItem.spell;
    newItem.item.applicableMagicalItems = [];
    newItem.item.applicableSpells = [];
    this.continueAddingItem(newItem);
  }

  private continueAddingItem(newItem: SelectionItem): void {
    const selectedIndex = this.getIndex(this.selectedItems, newItem);
    if (selectedIndex === -1) {
      //add item to full/filtered list
      let index = this.selectionItems.indexOf(this.magicalItem);
      if (index === -1) {
        index = this.selectionItems.length - 1;
      }
      this.selectionItems.splice(index + 1, 0, newItem);
      this.selectionItems = [...this.selectionItems];

      newItem.quantity = 1;
      this.selectedItems.push(newItem);
    } else {
      const selectedItem = this.selectedItems[selectedIndex];
      selectedItem.quantity++;
    }

    this.magicalItem = null;
  }

  continueMagicalItem(selectedMagicalItem: SelectionItem): void {
    const newItem = _.cloneDeep(this.magicalItem);
    newItem.selected = true;
    newItem.selectedApplicableItem = selectedMagicalItem.item;
    newItem.item.applicableMagicalItems = [];
    newItem.item.applicableSpells = [];
    this.continueAddingItem(newItem);
  }

  cancelMagicalItem(): void {
    this.magicalItem = null;
  }

}
