import {Component, EventEmitter, HostListener, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ListObject} from '../../../../shared/models/list-object';
import {ItemService} from '../../../../core/services/items/item.service';
import {ItemListResponse} from '../../../../shared/models/items/item-list-response';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {FilterDialogData} from '../../../../core/components/filters/filter-dialog-data';
import {Filters} from '../../../../core/components/filters/filters';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ItemFilterDialogComponent} from '../../../../core/components/filters/item-filter-dialog/item-filter-dialog.component';
import {ItemListObject} from '../../../../shared/models/items/item-list-object';
import {SelectionItem} from '../../../../shared/models/items/selection-item';
import * as _ from 'lodash';
import {FilterKey} from '../../../../core/components/filters/filter-key.enum';
import {FilterValue} from '../../../../core/components/filters/filter-value';
import {CdkVirtualScrollViewport} from '@angular/cdk/scrolling';

@Component({
  selector: 'app-add-items',
  templateUrl: './add-items.component.html',
  styleUrls: ['./add-items.component.scss']
})
export class AddItemsComponent implements OnInit {
  @Input() itemsToRemove: ListObject[];
  @Output() close = new EventEmitter();
  @Output() continue = new EventEmitter<SelectionItem[]>();

  @ViewChild(CdkVirtualScrollViewport, {static: false})
  viewport: CdkVirtualScrollViewport;

  loading = false;

  viewingItem: SelectionItem = null;
  magicalItem: SelectionItem = null;
  searchValue = '';
  filters: Filters;

  allItemsLoaded = false;
  selectedItems: SelectionItem[] = [];
  selectionItems: SelectionItem[] = [];

  constructor(
    private dialog: MatDialog,
    private itemService: ItemService
  ) { }

  ngOnInit() {
    this.filters = new Filters();
    this.initializeItems();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.viewport.checkViewportSize();
  }

  initializeItems(): void {
    this.search();
  }

  checkedChange(event: MatCheckboxChange, item: SelectionItem): void {
    item.selected = event.checked;
  }

  continueClick(): void {
    this.continue.emit(this.selectedItems);
  }

  cancelClick(): void {
    this.close.emit();
  }

  searchChange(): void {
    this.search();
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

  private isSelected(item: SelectionItem): boolean {
    return this.getIndex(this.selectedItems, item) > -1;
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

  toggleSelected(item: SelectionItem): void {
    item.selected = !item.selected;
    this.selectionChange(item);
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
  }

  closeDetails(): void {
    this.viewingItem = null;
  }

  itemClick(item: SelectionItem): void {
    this.viewingItem = item;
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
}
