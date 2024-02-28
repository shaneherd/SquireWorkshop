import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {MagicalItemApplicability} from '../../../../../shared/models/items/magical-item-applicability';
import {MagicalItemType} from '../../../../../shared/models/items/magical-item-type.enum';
import {FormControl} from '@angular/forms';
import {Subject, Subscription} from 'rxjs';
import {MagicalItemApplicabilityType} from '../../../../../shared/models/items/magical-item-applicability-type.enum';
import {Filters} from '../../../../../core/components/filters/filters';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {TranslateService} from '@ngx-translate/core';
import {takeUntil} from 'rxjs/operators';
import * as _ from 'lodash';
import {FilterDialogData} from '../../../../../core/components/filters/filter-dialog-data';
import {SpellFilterDialogComponent} from '../../../../../core/components/filters/spell-filter-dialog/spell-filter-dialog.component';
import {SpellService} from '../../../../../core/services/powers/spell.service';
import {SpellListObject} from '../../../../../shared/models/powers/spell-list-object';
import {SpellFilterService} from '../../../../../core/services/spell-filter.service';
import {ListSource} from '../../../../../shared/models/list-source.enum';

@Component({
  selector: 'app-magical-item-applicable-spell-configuration',
  templateUrl: './magical-item-applicable-spell-configuration.component.html',
  styleUrls: ['./magical-item-applicable-spell-configuration.component.scss']
})
export class MagicalItemApplicableSpellConfigurationComponent implements OnInit, OnDestroy {
  @Input() magicalItemApplicability: MagicalItemApplicability;
  @Input() magicalItemType: MagicalItemType;
  @Input() newType = false;
  @Input() editing = false;
  @Input() deletable = true;
  @Input() listSource: ListSource = ListSource.MY_STUFF;
  @Output() close = new EventEmitter();
  @Output() continue = new EventEmitter();
  @Output() remove = new EventEmitter();

  public spellFilterFormControl: FormControl = new FormControl();
  protected _onDestroy = new Subject<void>();

  valueSub: Subscription;
  loading = false;
  none = '';
  search = '';
  filterDisplay = '';
  isSpell = false;

  spells: SpellListObject[] = [];
  filteredItems: SpellListObject[] = [];
  selectedItem: SpellListObject;
  types: MagicalItemApplicabilityType[] = [];
  selectedItemType: MagicalItemApplicabilityType;
  filters: Filters;

  constructor(
    private dialog: MatDialog,
    private translate: TranslateService,
    private spellFilterService: SpellFilterService,
    private spellService: SpellService
  ) { }

  ngOnInit() {
    this.none = this.translate.instant('None');
    this.search = this.translate.instant('Search');

    this.initializeStartingEquipmentTypes();
    this.initializeItems();
    this.initializeFilters();

    this.valueSub = this.spellFilterFormControl.valueChanges
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
    this.spellFilterService.initializeFilterOptions().then(() => {
      this.filterDisplay = this.getFiltersDisplay();
    });
  }

  private initializeDefaultFilters(): void {
    this.filters = new Filters();
    // const filterValue = new FilterValue();
    // filterValue.key = FilterKey.ITEM_TYPE;
    // filterValue.value = this.magicalItemType === MagicalItemType.ARMOR ? ItemType.ARMOR : ItemType.WEAPON;
    // this.filters.filterValues.push(filterValue);
  }

  ngOnDestroy() {
    this.valueSub.unsubscribe();
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  initializeStartingEquipmentTypes(): void {
    this.types = [];
    this.types.push(MagicalItemApplicabilityType.SPELL);
    this.types.push(MagicalItemApplicabilityType.FILTER);
    this.initializeSelectedStartingEquipmentType();
  }

  initializeSelectedStartingEquipmentType(): void {
    this.selectedItemType = this.magicalItemApplicability.magicalItemApplicabilityType;
    this.typeChange();
  }

  typeChange(): void {
    this.isSpell = this.selectedItemType === MagicalItemApplicabilityType.SPELL;
  }

  initializeItems(): void {
    this.spells = [];
    this.spellService.getSpells().then((spells: SpellListObject[]) => {
      this.spells = spells;
      this.initializeSelectedItem();
      this.filterItems();
    });
  }

  private initializeSelectedItem(): void {
    if (this.magicalItemApplicability.spell != null) {
      for (let i = 0; i < this.spells.length; i++) {
        const item = this.spells[i];
        if (item.id === this.magicalItemApplicability.spell.id) {
          this.selectedItem = item;
          return;
        }
      }
    }

    if (this.spells.length > 0) {
      this.selectedItem = this.spells[0];
    }
  }

  private filterItems(): void {
    if (!this.spells) {
      return;
    }
    // get the search keyword
    let search = this.spellFilterFormControl.value;
    if (!search) {
      this.filteredItems = this.spells.slice();
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredItems = this.spells.filter(item => item.name.toLowerCase().indexOf(search) > -1);
  }

  private getFiltersDisplay(): string {
    return this.spellFilterService.getFilterDisplay(this.filters);
  }

  filter(): void {
    const self = this;
    const data = new FilterDialogData();
    data.filters = this.filters;

    data.apply = (filters: Filters) => {
      self.applyFilters(filters);
    };
    data.clear = () => {
      this.initializeDefaultFilters();
      self.applyFilters(this.filters);
    };
    data.listSource = this.listSource;

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = data;
    this.dialog.open(SpellFilterDialogComponent, dialogConfig);
  }

  applyFilters(filters: Filters): void {
    this.filters = filters;
    this.filterDisplay = this.getFiltersDisplay();
  }

  continueClick(): void {
    this.magicalItemApplicability.magicalItemApplicabilityType = this.selectedItemType;
    this.magicalItemApplicability.spell = this.selectedItem;
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
