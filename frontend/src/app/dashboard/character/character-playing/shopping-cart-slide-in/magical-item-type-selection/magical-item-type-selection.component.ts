import {Component, EventEmitter, HostListener, Input, OnInit, Output, ViewChild} from '@angular/core';
import {SelectionItem} from '../../../../../shared/models/items/selection-item';
import {ItemService} from '../../../../../core/services/items/item.service';
import {MagicalItemApplicability} from '../../../../../shared/models/items/magical-item-applicability';
import {MagicalItemApplicabilityType} from '../../../../../shared/models/items/magical-item-applicability-type.enum';
import {ItemListObject} from '../../../../../shared/models/items/item-list-object';
import {ItemListResponse} from '../../../../../shared/models/items/item-list-response';
import * as _ from 'lodash';
import {CdkVirtualScrollViewport} from '@angular/cdk/scrolling';

@Component({
  selector: 'app-magical-item-type-selection',
  templateUrl: './magical-item-type-selection.component.html',
  styleUrls: ['./magical-item-type-selection.component.scss']
})
export class MagicalItemTypeSelectionComponent implements OnInit {
  @Input() selectedMagicalItem: SelectionItem;
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
    let items: ItemListObject[] = [];
    const promises: Promise<any>[] = [];
    this.selectedMagicalItem.item.applicableMagicalItems.forEach((magicalItemApplicability: MagicalItemApplicability) => {
      if (magicalItemApplicability.magicalItemApplicabilityType === MagicalItemApplicabilityType.ITEM && magicalItemApplicability.item != null) {
        items.push(magicalItemApplicability.item);
      } else if (magicalItemApplicability.magicalItemApplicabilityType === MagicalItemApplicabilityType.FILTER && magicalItemApplicability.filters.filterValues.length > 0) {
        promises.push(this.itemService.getItemsWithFilters(magicalItemApplicability.filters, 0).then((response: ItemListResponse) => {
          items = items.concat(response.items);
        }));
      }
    });
    Promise.all(promises).then(() => {
      const selectionItems: SelectionItem[] = [];
      const uniqueItems: ItemListObject[] = _.uniqBy(items, (item: ItemListObject) => { return item.id; })
      const sorted = _.sortBy(uniqueItems, item => item.name)

      sorted.forEach((item: ItemListObject) => {
        const selectionItem = new SelectionItem();
        selectionItem.item = item;
        selectionItem.selected = this.selectedMagicalItem != null
          && this.selectedMagicalItem.item != null
          && this.selectedMagicalItem.item.id === item.id;
        selectionItems.push(selectionItem);
        if (selectionItem.selected) {
          this.selectedItem = selectionItem;
        }
      });
      this.selectionItems = selectionItems;

      if (this.selectionItems.length === 1) {
        this.toggleSelected(this.selectionItems[0]);
        this.onContinue();
      }
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
