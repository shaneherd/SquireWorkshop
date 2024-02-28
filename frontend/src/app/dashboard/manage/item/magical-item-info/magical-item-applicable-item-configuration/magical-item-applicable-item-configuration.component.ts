import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {MagicalItemApplicability} from '../../../../../shared/models/items/magical-item-applicability';
import {Subject, Subscription} from 'rxjs';
import {Filters} from '../../../../../core/components/filters/filters';
import {TranslateService} from '@ngx-translate/core';
import {ItemFilterService} from '../../../../../core/services/item-filter.service';
import {ItemService} from '../../../../../core/services/items/item.service';
import * as _ from 'lodash';
import {takeUntil} from 'rxjs/operators';
import {ItemListResponse} from '../../../../../shared/models/items/item-list-response';
import {FilterDialogData} from '../../../../../core/components/filters/filter-dialog-data';
import {ItemFilterDialogComponent} from '../../../../../core/components/filters/item-filter-dialog/item-filter-dialog.component';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {FormControl} from '@angular/forms';
import {MagicalItemApplicabilityType} from '../../../../../shared/models/items/magical-item-applicability-type.enum';
import {ItemListObject} from '../../../../../shared/models/items/item-list-object';
import {FilterDataOptionKey} from '../../../../../core/components/filters/filter-data-option-key.enum';
import {MagicalItemType} from '../../../../../shared/models/items/magical-item-type.enum';
import {FilterValue} from '../../../../../core/components/filters/filter-value';
import {FilterKey} from '../../../../../core/components/filters/filter-key.enum';
import {ItemType} from '../../../../../shared/models/items/item-type.enum';

@Component({
  selector: 'app-magical-item-applicable-item-configuration',
  templateUrl: './magical-item-applicable-item-configuration.component.html',
  styleUrls: ['./magical-item-applicable-item-configuration.component.scss']
})
export class MagicalItemApplicableItemConfigurationComponent implements OnInit, OnDestroy {
  @Input() magicalItemApplicability: MagicalItemApplicability;
  @Input() magicalItemType: MagicalItemType;
  @Input() newType = false;
  @Input() editing = false;
  @Input() deletable = false;
  @Output() close = new EventEmitter();
  @Output() continue = new EventEmitter();
  @Output() remove = new EventEmitter();

  public itemFilterFormControl: FormControl = new FormControl();
  protected _onDestroy = new Subject<void>();

  valueSub: Subscription;
  loading = false;
  none = '';
  search = '';
  filterDisplay = '';
  isItem = false;

  items: ItemListObject[] = [];
  filteredItems: ItemListObject[] = [];
  selectedItem: ItemListObject;
  types: MagicalItemApplicabilityType[] = [];
  selectedItemType: MagicalItemApplicabilityType;
  filters: Filters;
  filterOptions: Map<FilterDataOptionKey, boolean>;

  constructor(
    private dialog: MatDialog,
    private translate: TranslateService,
    private itemFilterService: ItemFilterService,
    private itemService: ItemService
  ) { }

  ngOnInit() {
    this.none = this.translate.instant('None');
    this.search = this.translate.instant('Search');

    this.initializeStartingEquipmentTypes();
    this.initializeItems();
    this.initializeFilters();

    this.valueSub = this.itemFilterFormControl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterItems();
      });
  }

  private initializeFilters(): void {
    if (this.newType) {
      this.initializeDefaultFilters();
    } else {
      this.filters = _.cloneDeep(this.magicalItemApplicability.filters);
    }
    this.itemFilterService.initializeFilterOptions().then(() => {
      this.filterDisplay = this.getFiltersDisplay();
    });

    this.filterOptions = new Map<FilterDataOptionKey, boolean>();
    this.filterOptions.set(FilterDataOptionKey.SHOW_WEAPON, this.magicalItemType === MagicalItemType.WEAPON);
    this.filterOptions.set(FilterDataOptionKey.SHOW_AMMO, this.magicalItemType === MagicalItemType.AMMO);
    this.filterOptions.set(FilterDataOptionKey.SHOW_ARMOR, this.magicalItemType === MagicalItemType.ARMOR);
  }

  private initializeDefaultFilters(): void {
    this.filters = new Filters();
    const filterValue = new FilterValue();
    filterValue.key = FilterKey.ITEM_TYPE;
    switch (this.magicalItemType) {
      case MagicalItemType.ARMOR:
        filterValue.value = ItemType.ARMOR;
        break;
      case MagicalItemType.AMMO:
        filterValue.value = ItemType.AMMO;
        break;
      case MagicalItemType.WEAPON:
        filterValue.value = ItemType.WEAPON;
        break;
    }
    this.filters.filterValues.push(filterValue);
  }

  ngOnDestroy() {
    this.valueSub.unsubscribe();
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  initializeStartingEquipmentTypes(): void {
    this.types = [];
    this.types.push(MagicalItemApplicabilityType.ITEM);
    this.types.push(MagicalItemApplicabilityType.FILTER);
    this.initializeSelectedStartingEquipmentType();
  }

  initializeSelectedStartingEquipmentType(): void {
    this.selectedItemType = this.magicalItemApplicability.magicalItemApplicabilityType;
    this.typeChange();
  }

  typeChange(): void {
    this.isItem = this.selectedItemType === MagicalItemApplicabilityType.ITEM;
  }

  initializeItems(): void {
    this.items = [];
    this.itemService.getItems().then((response: ItemListResponse) => {
      this.items = this.getFilteredInitialItems(response.items);
      this.initializeSelectedItem();
      this.filterItems();
    });
  }

  private getFilteredInitialItems(items: ItemListObject[]): ItemListObject[] {
    const filtered: ItemListObject[] = [];
    items.forEach((item: ItemListObject) => {
      if (this.magicalItemType === MagicalItemType.WEAPON) {
        if (item.itemType === ItemType.WEAPON) {
          filtered.push(item);
        }
      } else if (this.magicalItemType === MagicalItemType.AMMO) {
        if (item.itemType === ItemType.AMMO) {
          filtered.push(item);
        }
      } else if (this.magicalItemType === MagicalItemType.ARMOR) {
        if (item.itemType === ItemType.ARMOR) {
          filtered.push(item);
        }
      }
    });
    return filtered;
  }

  initializeSelectedItem(): void {
    if (this.magicalItemApplicability.item != null) {
      for (let i = 0; i < this.items.length; i++) {
        const item = this.items[i];
        if (item.id === this.magicalItemApplicability.item.id) {
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

  private getFiltersDisplay(): string {
    return this.itemFilterService.getFilterDisplay(this.filters);
  }

  filter(): void {
    const self = this;
    const data = new FilterDialogData();
    data.filters = this.filters;
    data.options = this.filterOptions;

    data.apply = (filters: Filters) => {
      self.applyFilters(filters);
    };
    data.clear = () => {
      this.initializeDefaultFilters();
      self.applyFilters(this.filters);
    };

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = data;
    this.dialog.open(ItemFilterDialogComponent, dialogConfig);
  }

  applyFilters(filters: Filters): void {
    this.filters = filters;
    this.filterDisplay = this.getFiltersDisplay();
  }

  continueClick(): void {
    this.magicalItemApplicability.magicalItemApplicabilityType = this.selectedItemType;
    this.magicalItemApplicability.item = this.selectedItem;
    this.magicalItemApplicability.filters = this.filters;

    this.continue.emit(this.magicalItemApplicability);
  }

  cancelClick(): void {
    this.close.emit();
  }

  removeClick(): void {
    this.remove.emit(this.magicalItemApplicability);
  }
}
