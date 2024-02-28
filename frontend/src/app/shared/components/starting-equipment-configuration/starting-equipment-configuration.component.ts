import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {StartingEquipmentType} from '../../models/startingEquipment/starting-equipment-type.enum';
import {ItemService} from '../../../core/services/items/item.service';
import {ListObject} from '../../models/list-object';
import {FilterDialogData} from '../../../core/components/filters/filter-dialog-data';
import {Filters} from '../../../core/components/filters/filters';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {ItemFilterDialogComponent} from '../../../core/components/filters/item-filter-dialog/item-filter-dialog.component';
import * as _ from 'lodash';
import {ItemFilterService} from '../../../core/services/item-filter.service';
import {FormControl} from '@angular/forms';
import {takeUntil} from 'rxjs/operators';
import {Subject, Subscription} from 'rxjs';
import {ItemListResponse} from '../../models/items/item-list-response';
import {StartingEquipmentItemGroupOptionItem} from '../../models/startingEquipment/starting-equipment-item-group-option-item';
import {ItemListObject} from '../../models/items/item-list-object';

@Component({
  selector: 'app-starting-equipment-configuration',
  templateUrl: './starting-equipment-configuration.component.html',
  styleUrls: ['./starting-equipment-configuration.component.scss']
})
export class StartingEquipmentConfigurationComponent implements OnInit, OnDestroy {
  @Input() item: StartingEquipmentItemGroupOptionItem;
  @Output() close = new EventEmitter();
  @Output() continue = new EventEmitter();

  public itemFilterFormControl: FormControl = new FormControl();
  protected _onDestroy = new Subject<void>();

  valueSub: Subscription;
  loading = false;
  none = '';
  search = '';

  items: ItemListObject[] = [];
  filteredItems: ItemListObject[] = [];
  selectedItem: ItemListObject;
  quantity = 0;
  startingEquipmentTypes: StartingEquipmentType[] = [];
  selectedItemType: StartingEquipmentType;
  filters: Filters;

  constructor(
    private dialog: MatDialog,
    private translate: TranslateService,
    private itemFilterService: ItemFilterService,
    private itemService: ItemService
  ) { }

  ngOnInit() {
    this.none = this.translate.instant('None');
    this.search = this.translate.instant('Search');

    this.itemFilterService.initializeFilterOptions();
    this.initializeStartingEquipmentTypes();
    this.initializeItems();
    this.filters = _.cloneDeep(this.item.filters);
    this.quantity = this.item.quantity;

    this.valueSub = this.itemFilterFormControl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterItems();
      });
  }

  ngOnDestroy() {
    this.valueSub.unsubscribe();
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  initializeStartingEquipmentTypes(): void {
    this.startingEquipmentTypes = [];
    this.startingEquipmentTypes.push(StartingEquipmentType.ITEM);
    this.startingEquipmentTypes.push(StartingEquipmentType.FILTER);
    this.initializeSelectedStartingEquipmentType();
  }

  initializeSelectedStartingEquipmentType(): void {
    this.selectedItemType = this.item.startingEquipmentType;
  }

  isItem(): boolean {
    return this.selectedItemType === StartingEquipmentType.ITEM;
  }

  initializeItems(): void {
    this.items = [];
    this.itemService.getItems().then((response: ItemListResponse) => {
      this.items = response.items;
      this.initializeSelectedItem();
      this.filterItems();
    });
  }

  initializeSelectedItem(): void {
    if (this.item.item != null) {
      for (let i = 0; i < this.items.length; i++) {
        const item = this.items[i];
        if (item.id === this.item.item.id) {
          this.selectedItem = item;
          return;
        }
      }
    }

    if (this.items.length > 0) {
      this.selectedItem = this.items[0];
    }
  }

  private filterItems(): void {
    if (!this.items) {
      return;
    }
    // get the search keyword
    let search = this.itemFilterFormControl.value;
    if (!search) {
      this.filteredItems = this.items.slice();
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredItems = this.items.filter(item => item.name.toLowerCase().indexOf(search) > -1);
  }

  getFiltersDisplay(): string {
    return this.itemFilterService.getFilterDisplay(this.filters);
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

  applyFilters(filters: Filters): void {
    this.filters = filters;
  }

  continueClick(): void {
    this.item.startingEquipmentType = this.selectedItemType;
    this.item.item = new ListObject(this.selectedItem.id, this.selectedItem.name);
    this.item.filters = this.filters;
    this.item.quantity = this.quantity;

    this.continue.emit(this.item);
  }

  cancelClick(): void {
    this.close.emit();
  }

}
