import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FilterDialogData} from '../filter-dialog-data';
import {TranslateService} from '@ngx-translate/core';
import {ItemType} from '../../../../shared/models/items/item-type.enum';
import {FilterValue} from '../filter-value';
import {FilterKey} from '../filter-key.enum';
import {FilterOption} from '../filter-option';
import {ItemFilterService} from '../../../services/item-filter.service';
import {Filters} from '../filters';
import * as _ from 'lodash';
import {DEFAULT_FILTER_VALUE, EVENTS} from '../../../../constants';
import {Subscription} from 'rxjs';
import {EventsService} from '../../../services/events.service';
import {FilterDataOptionKey} from '../filter-data-option-key.enum';

@Component({
  selector: 'app-item-filter-dialog',
  templateUrl: './item-filter-dialog.component.html',
  styleUrls: ['./item-filter-dialog.component.scss']
})
export class ItemFilterDialogComponent implements OnInit, OnDestroy {
  data: FilterDialogData;
  eventSub: Subscription;
  filters: Filters;

  //options
  itemTypes: FilterOption[] = [];
  weaponDifficulties: FilterOption[] = [];
  weaponCategories: FilterOption[] = [];
  armorCategories: FilterOption[] = [];
  toolCategories: FilterOption[] = [];
  magicalTypes: FilterOption[] = [];
  rarities: FilterOption[] = [];

  showWeapon = false;
  showAmmo = false;
  showArmor = false;

  //selected values
  search: FilterValue;
  itemType: FilterValue;
  weaponDifficulty: FilterValue;
  weaponCategory: FilterValue;
  armorCategory: FilterValue;
  toolCategory: FilterValue;
  expendable: FilterValue;
  equippable: FilterValue;
  container: FilterValue;
  magicalType: FilterValue;
  rarity: FilterValue;
  attunement: FilterValue;
  cursed: FilterValue;

  defaultOption = DEFAULT_FILTER_VALUE;

  constructor(
    @Inject(MAT_DIALOG_DATA) public d: FilterDialogData,
    private translate: TranslateService,
    private eventsService: EventsService,
    private dialogRef: MatDialogRef<ItemFilterDialogComponent>,
    private itemFilterService: ItemFilterService
  ) {
    this.data = d;
  }

  ngOnInit() {
    this.showWeapon = this.data.options.get(FilterDataOptionKey.SHOW_WEAPON) || false;
    this.showAmmo = this.data.options.get(FilterDataOptionKey.SHOW_AMMO) || false;
    this.showArmor = this.data.options.get(FilterDataOptionKey.SHOW_ARMOR) || false;
    this.itemFilterService.initializeFilterOptions(this.data.listSource).then(() => {
      this.initializeFilterOptions();
      this.initializeFilters();
    });
    this.eventSub = this.eventsService.events.subscribe(event => {
      if (event === EVENTS.Logout) {
        this.dialogRef.close();
      }
    });
  }

  ngOnDestroy() {
    this.eventSub.unsubscribe();
  }

  initializeFilters(): void {
    if (this.data.filters.filterValues == null) {
      this.data.filters.filterValues = [];
    }
    this.filters = _.cloneDeep(this.data.filters);
    this.initializeDefaultSearch();
    this.initializeDefaultOption(FilterKey.ITEM_TYPE);
    this.initializeDefaultOption(FilterKey.WEAPON_DIFFICULTY);
    this.initializeDefaultOption(FilterKey.WEAPON_CATEGORY);
    this.initializeDefaultOption(FilterKey.ARMOR_CATEGORY);
    this.initializeDefaultOption(FilterKey.TOOL_CATEGORY);
    this.initializeDefaultOption(FilterKey.EXPENDABLE);
    this.initializeDefaultOption(FilterKey.EQUIPPABLE);
    this.initializeDefaultOption(FilterKey.CONTAINER);
    this.initializeDefaultOption(FilterKey.MAGICAL_TYPE);
    this.initializeDefaultOption(FilterKey.RARITY);
    this.initializeDefaultOption(FilterKey.ATTUNEMENT);
    this.initializeDefaultOption(FilterKey.CURSED);

    this.initializeSelectedValues();
  }

  private initializeDefaultSearch(): void {
    if (!this.hasOption(this.filters.filterValues, FilterKey.SEARCH)) {
      this.filters.filterValues.push(this.getFilterValue(FilterKey.SEARCH, ''));
    }
  }

  private initializeDefaultOption(key: FilterKey): void {
    if (!this.hasOption(this.filters.filterValues, key)) {
      this.filters.filterValues.push(this.getFilterValue(key, this.defaultOption));
    }
  }

  private hasOption(filters: FilterValue[], key: FilterKey): boolean {
    for (let i = 0; i < filters.length; i++) {
      if (filters[i].key === key) {
        return true;
      }
    }
    return false;
  }

  initializeSelectedValues(): void {
    this.filters.filterValues.forEach((filter: FilterValue) => {
      switch (filter.key) {
        case FilterKey.SEARCH:
          this.search = filter;
          break;
        case FilterKey.ITEM_TYPE:
          this.itemType = filter;
          break;
        case FilterKey.WEAPON_DIFFICULTY:
          this.weaponDifficulty = filter;
          break;
        case FilterKey.WEAPON_CATEGORY:
          this.weaponCategory = filter;
          break;
        case FilterKey.ARMOR_CATEGORY:
          this.armorCategory = filter;
          break;
        case FilterKey.TOOL_CATEGORY:
          this.toolCategory = filter;
          break;
        case FilterKey.EXPENDABLE:
          this.expendable = filter;
          break;
        case FilterKey.EQUIPPABLE:
          this.equippable = filter;
          break;
        case FilterKey.CONTAINER:
          this.container = filter;
          break;
        case FilterKey.MAGICAL_TYPE:
          this.magicalType = filter;
          break;
        case FilterKey.RARITY:
          this.rarity = filter;
          break;
        case FilterKey.ATTUNEMENT:
          this.attunement = filter;
          break;
        case FilterKey.CURSED:
          this.cursed = filter;
          break;
      }
    });
  }

  initializeFilterOptions(): void {
    this.initializeItemTypes();
    this.weaponDifficulties = this.itemFilterService.weaponDifficulties;
    this.weaponCategories = this.itemFilterService.weaponCategories;
    this.armorCategories = this.itemFilterService.armorCategories;
    this.toolCategories = this.itemFilterService.toolCategories;
    this.magicalTypes = this.itemFilterService.magicalTypes;
    this.rarities = this.itemFilterService.rarities;
  }

  private initializeItemTypes(): void {
    if (!this.showWeapon && !this.showAmmo && !this.showArmor) {
      this.itemTypes = this.itemFilterService.itemTypes;
    } else {
      const types: ItemType[] = [];
      if (this.showWeapon) {
        types.push(ItemType.WEAPON);
      }
      if (this.showAmmo) {
        types.push(ItemType.AMMO);
      }
      if (this.showArmor) {
        types.push(ItemType.ARMOR);
      }
      this.itemTypes = this.itemFilterService.getItemTypeFilters(types);
    }
  }

  isWeapon(): boolean {
    return this.itemType != null && this.itemType.value === ItemType.WEAPON;
  }

  isArmor(): boolean {
    return this.itemType != null && this.itemType.value === ItemType.ARMOR;
  }

  isGear(): boolean {
    return this.itemType != null && this.itemType.value === ItemType.GEAR;
  }

  isTool(): boolean {
    return this.itemType != null && this.itemType.value === ItemType.TOOL;
  }

  isMagicalItem(): boolean {
    return this.itemType != null && this.itemType.value === ItemType.MAGICAL_ITEM;
  }

  private getFilterValue(key: FilterKey, value: string): FilterValue {
    const filterValue = new FilterValue();
    filterValue.key = key;
    filterValue.value = value;
    return filterValue;
  }

  private setFilters(): void {
    const filters: FilterValue[] = [];
    filters.push(this.search);
    filters.push(this.itemType);
    filters.push(this.weaponDifficulty);
    filters.push(this.weaponCategory);
    filters.push(this.armorCategory);
    filters.push(this.toolCategory);
    filters.push(this.expendable);
    filters.push(this.equippable);
    filters.push(this.container);
    filters.push(this.magicalType);
    filters.push(this.rarity);
    filters.push(this.attunement);
    filters.push(this.cursed);
    this.data.filters.filterValues = filters;
    this.data.filters.filtersApplied = this.filtersApplied();
  }

  private filtersApplied(): boolean {
    return this.itemType.value !== this.defaultOption;
  }

  apply(): void {
    this.setFilters();
    this.data.apply(this.data.filters);
    this.dialogRef.close();
  }

  private clearFilters(): void {
    //don't clear the search value
    if (this.showWeapon || this.showArmor || this.showAmmo) {
      if (this.showWeapon) {
        this.itemType.value = ItemType.WEAPON;
      } else if (this.showArmor) {
        this.itemType.value = ItemType.ARMOR;
      } else {
        this.itemType.value = ItemType.AMMO;
      }
    } else {
      this.itemType.value = this.defaultOption;
    }
    this.weaponDifficulty.value = this.defaultOption;
    this.weaponCategory.value = this.defaultOption;
    this.armorCategory.value = this.defaultOption;
    this.toolCategory.value = this.defaultOption;
    this.expendable.value = this.defaultOption;
    this.equippable.value = this.defaultOption;
    this.container.value = this.defaultOption;
    this.magicalType.value = this.defaultOption;
    this.rarity.value = this.defaultOption;
    this.attunement.value = this.defaultOption;
    this.cursed.value = this.defaultOption;
  }

  clear(): void {
    this.clearFilters();
    this.setFilters();
    this.data.clear();
    this.dialogRef.close();
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
