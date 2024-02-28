import {Component, EventEmitter, HostListener, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ListObject} from '../../../../shared/models/list-object';
import {SpellService} from '../../../../core/services/powers/spell.service';
import {SpellConfigurationCollection} from '../../../../shared/models/spell-configuration-collection';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {FilterDialogData} from '../../../../core/components/filters/filter-dialog-data';
import {Filters} from '../../../../core/components/filters/filters';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {SpellFilterDialogComponent} from '../../../../core/components/filters/spell-filter-dialog/spell-filter-dialog.component';
import {SpellMenuItem} from '../../../selection-list/spell-selection-list/spell-selection-list.component';
import {SpellListObject} from '../../../../shared/models/powers/spell-list-object';
import {SimpleSpellListItem} from '../../../../shared/models/powers/simple-spell-list-item';
import {ListSource} from '../../../../shared/models/list-source.enum';
import {CdkVirtualScrollViewport} from '@angular/cdk/scrolling';

export class SpellListItem {
  spell: ListObject;
  checked = false;
}

@Component({
  selector: 'app-add-spells',
  templateUrl: './add-spells.component.html',
  styleUrls: ['./add-spells.component.scss']
})
export class AddSpellsComponent implements OnInit {
  @Input() spellsToIgnore: SimpleSpellListItem[] = [];
  @Input() spellConfigurationCollection: SpellConfigurationCollection = null;
  @Input() multiselect = true;
  @Input() innate = false;
  @Output() close = new EventEmitter();
  @Output() continue = new EventEmitter();

  @ViewChild(CdkVirtualScrollViewport, {static: false})
  viewport: CdkVirtualScrollViewport;

  loading = false;
  viewingSpell: SpellMenuItem = null;
  searchValue = '';
  filters: Filters;
  spells = new Map<string, SpellMenuItem>();
  filteredSpells: SpellMenuItem[] = [];
  searchedFilteredSpells: SpellMenuItem[] = [];

  constructor(
    private dialog: MatDialog,
    private spellService: SpellService
  ) { }

  ngOnInit() {
    this.filters = new Filters();
    this.initializeSpells();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.viewport.checkViewportSize();
  }

  private initializeSpells(): void {
    this.loading = true;
    this.spellService.getSpellsWithFilters(ListSource.MY_STUFF, this.filters).then((spells: SpellListObject[]) => {
      const applicableSpells: SpellListObject[] = [];
      spells.forEach((spell: SpellListObject) => {
        if (!this.containsSpell(spell)) {
          applicableSpells.push(spell);
        }
      });

      this.setSpells(applicableSpells);
      this.filteredSpells = this.getFullSpellsList();
      this.loading = false;
      this.search(this.searchValue);
    });
  }

  private getFullSpellsList(): SpellMenuItem[] {
    const list: SpellMenuItem[] = [];
    this.spells.forEach((spell: SpellMenuItem, key: string) => {
      list.push(spell);
    });
    return list;
  }

  private setSpells(spells: SpellListObject[]): void {
    this.spells.clear();
    spells.forEach((spell: SpellListObject) => {
      this.spells.set(spell.id, new SpellMenuItem(spell));
    });
  }

  private containsSpell(spell: ListObject): boolean {
    if (this.spellConfigurationCollection != null) {
      if (this.innate) {
        for (let i = 0; i < this.spellConfigurationCollection.innateSpellConfigurations.length; i++) {
          const config = this.spellConfigurationCollection.innateSpellConfigurations[i];
          const configSpell = config.parent == null ? config.spell : config.parent.spell;
          if (configSpell.id === spell.id) {
            return true;
          }
        }
      } else {
        for (let i = 0; i < this.spellConfigurationCollection.spellConfigurations.length; i++) {
          const config = this.spellConfigurationCollection.spellConfigurations[i];
          const configSpell = config.parent == null ? config.spell : config.parent.spell;
          if (configSpell.id === spell.id) {
            return true;
          }
        }
      }
    }
    if (this.spellsToIgnore != null) {
      for (let i = 0; i < this.spellsToIgnore.length; i++) {
        const spellToIgnore = this.spellsToIgnore[i].spell;
        if (spellToIgnore.id === spell.id) {
          return true;
        }
      }
    }
    return false;
  }

  checkedChange(event: MatCheckboxChange, spell: SpellListItem): void {
    spell.checked = event.checked;
  }

  private getSelectedSpells(): ListObject[] {
    const selectedSpells: ListObject[] = [];
    this.spells.forEach((spell: SpellMenuItem) => {
      if (spell.selected) {
        selectedSpells.push(new ListObject(spell.spell.id, spell.spell.name));
      }
    });
    return selectedSpells;
  }

  continueClick(): void {
    this.continue.emit(this.getSelectedSpells());
  }

  cancelClick(): void {
    this.close.emit();
  }

  searchChange(): void {
    this.search(this.searchValue);
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
    this.dialog.open(SpellFilterDialogComponent, dialogConfig);
  }

  search(searchValue: string): void {
    this.searchValue = searchValue;
    if (searchValue.length === 0) {
      this.searchedFilteredSpells = this.filteredSpells
    } else {
      const filtered: SpellMenuItem[] = [];
      const search = searchValue.toLowerCase();
      this.filteredSpells.forEach((spellMenuItem: SpellMenuItem) => {
        if (spellMenuItem.spell.name.toLowerCase().indexOf(search) > -1) {
          filtered.push(spellMenuItem);
        }
      });
      this.searchedFilteredSpells = filtered;
    }
  }

  private applyFilters(filters: Filters): void {
    this.filters = filters;
    this.spellService.getSpellsWithFilters(ListSource.MY_STUFF, this.filters).then((spells: SpellListObject[]) => {
      this.filteredSpells = this.getFilteredSpells(spells);
      this.search(this.searchValue);
    });
  }

  private getFilteredSpells(spells: SpellListObject[]): SpellMenuItem[] {
    const filtered: SpellMenuItem[] = [];
    spells.forEach((spell: SpellListObject) => {
      filtered.push(this.spells.get(spell.id));
    });
    return filtered;
  }

  toggleSelected(spell: SpellMenuItem): void {
    const selected = !spell.selected;
    if (selected && !this.multiselect) {
      this.spells.forEach((_spell: SpellMenuItem) => {
        _spell.selected = false;
      });
    }
    spell.selected = selected;
    this.viewingSpell = null;
  }

  closeDetails(): void {
    this.viewingSpell = null;
  }

  spellClick(item: SpellMenuItem): void {
    this.viewingSpell = item;
  }
}
