import {Component, EventEmitter, HostListener, Input, OnInit, Output, ViewChild} from '@angular/core';
import {SelectionItem} from '../../../../../shared/models/items/selection-item';
import {StartingEquipmentSelectionGroupOptionItem} from '../starting-equipment.component';
import {ItemService} from '../../../../../core/services/items/item.service';
import {ItemListResponse} from '../../../../../shared/models/items/item-list-response';
import {ItemListObject} from '../../../../../shared/models/items/item-list-object';
import {CdkVirtualScrollViewport} from '@angular/cdk/scrolling';

@Component({
  selector: 'app-starting-equipment-filter-selection',
  templateUrl: './starting-equipment-filter-selection.component.html',
  styleUrls: ['./starting-equipment-filter-selection.component.scss']
})
export class StartingEquipmentFilterSelectionComponent implements OnInit {
  @Input() filterItem: StartingEquipmentSelectionGroupOptionItem;
  @Output() cancel = new EventEmitter();
  @Output() continue = new EventEmitter<SelectionItem>();

  @ViewChild(CdkVirtualScrollViewport, {static: false})
  viewport: CdkVirtualScrollViewport;

  loading = false;
  selectionItems: SelectionItem[] = [];
  viewingItem: SelectionItem = null;
  selectedItem: SelectionItem = null;

  constructor(
    private itemService: ItemService
  ) { }

  ngOnInit() {
    this.initializeItems();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.viewport.checkViewportSize();
  }

  private initializeItems(): void {
    this.itemService.getItemsWithFilters(this.filterItem.item.filters, 0).then((response: ItemListResponse) => {
      const selectionItems: SelectionItem[] = [];
      response.items.forEach((item: ItemListObject) => {
        const selectionItem = new SelectionItem();
        selectionItem.item = item;
        selectionItem.selected = this.filterItem.selectionItem != null
          && this.filterItem.selectionItem.item != null
          && this.filterItem.selectionItem.item.id === item.id;
        selectionItems.push(selectionItem);
        if (selectionItem.selected) {
          this.selectedItem = selectionItem;
        }
      });
      this.selectionItems = selectionItems;
    });
  }

  onContinue(): void {
    this.continue.emit(this.selectedItem);
  }

  onCancel(): void {
    this.cancel.emit();
  }

  onItemClick(selectionItem: SelectionItem): void {
    this.viewingItem = selectionItem;
  }

  closeItem(): void {
    this.viewingItem = null;
  }

  toggleSelected(selectionItem: SelectionItem): void {
    const newSelectedState = !selectionItem.selected;
    if (newSelectedState) {
      if (this.selectedItem != null) {
        this.selectedItem.selected = false;
      }
      selectionItem.selected = true;
      this.selectedItem = selectionItem;
    } else {
      selectionItem.selected = false;
      this.selectedItem = null;
    }
    this.viewingItem = null;
  }

}
