import {Injectable} from '@angular/core';
import {FilterOption} from '../components/filters/filter-option';
import {TranslateService} from '@ngx-translate/core';
import {WeaponTypeService} from './attributes/weapon-type.service';
import {ArmorTypeService} from './attributes/armor-type.service';
import {ToolCategoryService} from './attributes/tool-category.service';
import {ItemType} from '../../shared/models/items/item-type.enum';
import {ListObject} from '../../shared/models/list-object';
import {WeaponRangeType} from '../../shared/models/items/weapon-range-type.enum';
import {Filters} from '../components/filters/filters';
import {FilterValue} from '../components/filters/filter-value';
import {FilterKey} from '../components/filters/filter-key.enum';
import {FilterService} from './filter.service';
import {MagicalItemType} from '../../shared/models/items/magical-item-type.enum';
import {Rarity} from '../../shared/models/items/rarity.enum';
import {ListSource} from '../../shared/models/list-source.enum';

@Injectable({
  providedIn: 'root'
})
export class ItemFilterService {
  defaultOption = 'ALL';
  itemTypes: FilterOption[] = [];
  weaponDifficulties: FilterOption[] = [];
  weaponCategories: FilterOption[] = [];
  armorCategories: FilterOption[] = [];
  toolCategories: FilterOption[] = [];
  magicalTypes: FilterOption[] = [];
  rarities: FilterOption[] = [];

  constructor(
    private translate: TranslateService,
    private weaponTypeService: WeaponTypeService,
    private armorTypeService: ArmorTypeService,
    private toolCategoryService: ToolCategoryService,
    private filterService: FilterService
  ) {
  }

  initializeFilterOptions(listSource: ListSource = ListSource.MY_STUFF): Promise<any> {
    this.initializeItemTypes();
    this.initializeWeaponCategories();
    this.initializeMagicalTypes();
    this.initializeRarities();

    const promises: Promise<any>[] = [];
    promises.push(this.initializeWeaponDifficulties(listSource));
    promises.push(this.initializeArmorCategories(listSource));
    promises.push(this.initializeToolCategories(listSource));
    return Promise.all(promises);
  }

  private initializeItemTypes(): void {
    const types: ItemType[] = [];
    types.push(ItemType.WEAPON);
    types.push(ItemType.ARMOR);
    types.push(ItemType.GEAR);
    types.push(ItemType.TOOL);
    types.push(ItemType.AMMO);
    types.push(ItemType.MOUNT);
    types.push(ItemType.VEHICLE);
    types.push(ItemType.TREASURE);
    types.push(ItemType.PACK);
    types.push(ItemType.MAGICAL_ITEM);

    this.itemTypes = [];
    this.itemTypes.push(new FilterOption(this.defaultOption, this.translate.instant('All')));
    this.itemTypes = this.itemTypes.concat(this.getItemTypeFilters(types));
  }

  getItemTypeFilters(itemTypes: ItemType[]): FilterOption[] {
    const filters: FilterOption[] = [];
    itemTypes.forEach((itemType: ItemType) => {
      filters.push(new FilterOption(itemType, this.translate.instant('ItemType.' + itemType)));
    });
    return filters;
  }

  private initializeWeaponDifficulties(listSource: ListSource): Promise<any> {
    this.weaponDifficulties = [];
    this.weaponDifficulties.push(new FilterOption(this.defaultOption, this.translate.instant('All')));
    return this.weaponTypeService.getWeaponTypes(listSource).then((weaponTypes: ListObject[]) => {
      weaponTypes.forEach((weaponType: ListObject) => {
        this.weaponDifficulties.push(new FilterOption(weaponType.id, weaponType.name));
      });
    });
  }

  private initializeWeaponCategories(): void {
    this.weaponCategories = [];
    this.weaponCategories.push(new FilterOption(this.defaultOption, this.translate.instant('All')));
    this.weaponCategories.push(new FilterOption(WeaponRangeType.MELEE, this.translate.instant('WeaponRangeType.' + WeaponRangeType.MELEE)));
    this.weaponCategories.push(new FilterOption(WeaponRangeType.RANGED,
      this.translate.instant('WeaponRangeType.' + WeaponRangeType.RANGED)));
  }

  private initializeArmorCategories(listSource: ListSource): Promise<any> {
    this.armorCategories = [];
    this.armorCategories.push(new FilterOption(this.defaultOption, this.translate.instant('All')));
    return this.armorTypeService.getArmorTypes(listSource).then((armorTypes: ListObject[]) => {
      armorTypes.forEach((armorType: ListObject) => {
        this.armorCategories.push(new FilterOption(armorType.id, armorType.name));
      });
    });
  }

  private initializeToolCategories(listSource: ListSource): Promise<any> {
    this.toolCategories = [];
    this.toolCategories.push(new FilterOption(this.defaultOption, this.translate.instant('All')));
    return this.toolCategoryService.getToolCategories(listSource).then((toolCategories: ListObject[]) => {
      toolCategories.forEach((toolCategory: ListObject) => {
        this.toolCategories.push(new FilterOption(toolCategory.id, toolCategory.name));
      });
    });
  }

  private initializeMagicalTypes(): void {
    this.magicalTypes = [];
    this.magicalTypes.push(new FilterOption(this.defaultOption, this.translate.instant('All')));
    this.magicalTypes.push(new FilterOption(MagicalItemType.AMMO, this.translate.instant('MagicalItemType.' + MagicalItemType.AMMO)));
    this.magicalTypes.push(new FilterOption(MagicalItemType.ARMOR, this.translate.instant('MagicalItemType.' + MagicalItemType.ARMOR)));
    this.magicalTypes.push(new FilterOption(MagicalItemType.POTION, this.translate.instant('MagicalItemType.' + MagicalItemType.POTION)));
    this.magicalTypes.push(new FilterOption(MagicalItemType.RING, this.translate.instant('MagicalItemType.' + MagicalItemType.RING)));
    this.magicalTypes.push(new FilterOption(MagicalItemType.ROD, this.translate.instant('MagicalItemType.' + MagicalItemType.ROD)));
    this.magicalTypes.push(new FilterOption(MagicalItemType.SCROLL, this.translate.instant('MagicalItemType.' + MagicalItemType.SCROLL)));
    this.magicalTypes.push(new FilterOption(MagicalItemType.STAFF, this.translate.instant('MagicalItemType.' + MagicalItemType.STAFF)));
    this.magicalTypes.push(new FilterOption(MagicalItemType.WAND, this.translate.instant('MagicalItemType.' + MagicalItemType.WAND)));
    this.magicalTypes.push(new FilterOption(MagicalItemType.WEAPON, this.translate.instant('MagicalItemType.' + MagicalItemType.WEAPON)));
    this.magicalTypes.push(new FilterOption(MagicalItemType.WONDROUS, this.translate.instant('MagicalItemType.' + MagicalItemType.WONDROUS)));
  }

  private initializeRarities(): void {
    this.rarities = [];
    this.rarities.push(new FilterOption(this.defaultOption, this.translate.instant('All')));
    this.rarities.push(new FilterOption(Rarity.COMMON, this.translate.instant('Rarity.' + Rarity.COMMON)));
    this.rarities.push(new FilterOption(Rarity.UNCOMMON, this.translate.instant('Rarity.' + Rarity.UNCOMMON)));
    this.rarities.push(new FilterOption(Rarity.RARE, this.translate.instant('Rarity.' + Rarity.RARE)));
    this.rarities.push(new FilterOption(Rarity.VERY_RARE, this.translate.instant('Rarity.' + Rarity.VERY_RARE)));
    this.rarities.push(new FilterOption(Rarity.LEGENDARY, this.translate.instant('Rarity.' + Rarity.LEGENDARY)));
  }

  getFilterDisplay(filters: Filters): string {
    if (filters == null) {
      filters = new Filters();
    }

    const parts: string[] = [];
    const itemType: ItemType = this.getItemType(filters);
    filters.filterValues.forEach((filterValue: FilterValue) => {
      if (filterValue.value !== this.defaultOption) {
        const display = this.getItemFilterDisplay(filterValue, itemType);
        if (display !== '') {
          parts.push(display);
        }
      }
    });
    if (parts.length === 0) {
      return this.translate.instant('All');
    } else {
      return parts.join(' - ');
    }
  }

  private getItemType(filters: Filters): ItemType {
    for (let i = 0; i < filters.filterValues.length; i++) {
      const filterValue = filters.filterValues[i];
      if (filterValue.key === FilterKey.ITEM_TYPE) {
        return ItemType[filterValue.value];
      }
    }
    return null;
  }

  private getItemFilterDisplay(filterValue: FilterValue, itemType: ItemType): string {
    let option: FilterOption = null;
    switch (filterValue.key) {
      case FilterKey.ITEM_TYPE:
        option = this.getItemTypeDisplay(filterValue.value);
        break;
      case FilterKey.WEAPON_DIFFICULTY:
        if (itemType === ItemType.WEAPON) {
          option = this.getWeaponDifficultyDisplay(filterValue.value);
        }
        break;
      case FilterKey.WEAPON_CATEGORY:
        if (itemType === ItemType.WEAPON) {
          option = this.getWeaponCategoryDisplay(filterValue.value);
        }
        break;
      case FilterKey.ARMOR_CATEGORY:
        if (itemType === ItemType.ARMOR) {
          option = this.getArmorCategoryDisplay(filterValue.value);
        }
        break;
      case FilterKey.TOOL_CATEGORY:
        if (itemType === ItemType.TOOL) {
          option = this.getToolCategoryDisplay(filterValue.value);
        }
        break;
      case FilterKey.EXPENDABLE:
        if (itemType === ItemType.GEAR || itemType === ItemType.TOOL || itemType === ItemType.MAGICAL_ITEM) {
          return this.filterService.getYesNoDisplay(filterValue.value, this.translate.instant('FilterKey.' + filterValue.key));
        }
        return '';
      case FilterKey.EQUIPPABLE:
        if (itemType === ItemType.GEAR || itemType === ItemType.TOOL || itemType === ItemType.MAGICAL_ITEM) {
          return this.filterService.getYesNoDisplay(filterValue.value, this.translate.instant('FilterKey.' + filterValue.key));
        }
        return '';
      case FilterKey.CONTAINER:
        if (itemType === ItemType.GEAR || itemType === ItemType.TOOL || itemType === ItemType.MAGICAL_ITEM || itemType === ItemType.ARMOR) {
          return this.filterService.getYesNoDisplay(filterValue.value, this.translate.instant('FilterKey.' + filterValue.key));
        }
        return '';
//      case FilterKey.MAGICAL_TYPE:
//        return this.getMagicalTypeDisplay(filterValue.value);
//        break;
//      case FilterKey.RARITY:
//        return this.getRarityDisplay(filterValue.value);
//        break;
//      case FilterKey.ATTUNEMENT:
//        return this.getYesNoDisplay(filterValue.value);
//        break;
//      case FilterKey.CURSED:
//        return this.getYesNoDisplay(filterValue.value);
//        break;
    }

    if (option == null) {
      return '';
    } else {
      return option.display;
    }
  }

  private getItemTypeDisplay(value: string): FilterOption {
    return this.filterService.getFilterOption(value, this.itemTypes);
  }

  private getWeaponDifficultyDisplay(value: string): FilterOption {
    return this.filterService.getFilterOption(value, this.weaponDifficulties);
  }

  private getWeaponCategoryDisplay(value: string): FilterOption {
    return this.filterService.getFilterOption(value, this.weaponCategories);
  }

  private getArmorCategoryDisplay(value: string): FilterOption {
    return this.filterService.getFilterOption(value, this.armorCategories);
  }

  private getToolCategoryDisplay(value: string): FilterOption {
    return this.filterService.getFilterOption(value, this.toolCategories);
  }
}
