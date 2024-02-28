import {Component, EventEmitter, HostListener, OnInit, Output, ViewChild} from '@angular/core';
import {ListObject} from '../../../../shared/models/list-object';
import {CdkVirtualScrollViewport} from '@angular/cdk/scrolling';
import {Filters} from '../../../../core/components/filters/filters';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ListSource} from '../../../../shared/models/list-source.enum';
import {FilterDialogData} from '../../../../core/components/filters/filter-dialog-data';
import {MonsterFilterDialogComponent} from '../../../../core/components/filters/monster-filter-dialog/monster-filter-dialog.component';
import {MenuItem} from '../../../../shared/models/menuItem.model';
import {MonsterService} from '../../../../core/services/creatures/monster.service';
import {TranslateService} from '@ngx-translate/core';
import * as _ from 'lodash';
import {ChallengeRating} from '../../../../shared/models/creatures/monsters/challenge-rating.enum';

export class MonsterListItem {
  monster: MonsterListObject;
  selected = false;
  quantity = 0;

  constructor(monster: MonsterListObject) {
    this.monster = monster;
  }
}

export class MonsterListObject extends ListObject {
  challengeRating: ChallengeRating;
}

@Component({
  selector: 'app-add-monsters',
  templateUrl: './add-monsters.component.html',
  styleUrls: ['./add-monsters.component.scss']
})
export class AddMonstersComponent implements OnInit {
  @Output() close = new EventEmitter();
  @Output() continue = new EventEmitter<MonsterListItem[]>();

  @ViewChild(CdkVirtualScrollViewport, {static: false})
  viewport: CdkVirtualScrollViewport;

  loading = false;
  viewingMonster: MenuItem = null;
  searchValue = '';
  filters: Filters;
  monsters: MonsterListItem[] = [];
  searchedFilteredMonsters: MonsterListItem[] = [];

  selectedMonsters: MonsterListItem[] = [];

  headerName = '';
  step = 0;

  constructor(
    private dialog: MatDialog,
    private monsterService: MonsterService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.filters = new Filters();
    this.initializeMonsters();
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
        this.headerName = this.translate.instant('Headers.AddMonsters');
        break;
      case 1:
        this.headerName = this.translate.instant('Headers.Quantity');
        break;
    }
  }

  private initializeMonsters(): void {
    this.loading = true;
    this.monsterService.getMonstersWithFilters(ListSource.MY_STUFF, this.filters).then((monsters: MonsterListObject[]) => {
      this.monsters = this.getMonsters(monsters);
      this.loading = false;
      this.search();
    });
  }

  private getMonsters(items: MonsterListObject[]): MonsterListItem[] {
    const monsters: MonsterListItem[] = [];
    items.forEach((item: MonsterListObject) => {
      monsters.push(this.getMonster(item));
    });
    return monsters;
  }

  private getMonster(monster: MonsterListObject): MonsterListItem {
    const monsterListItem: MonsterListItem = new MonsterListItem(monster);
    monsterListItem.selected = this.isSelected(monsterListItem);
    return monsterListItem;
  }

  private isSelected(monsterListItem: MonsterListItem): boolean {
    return this.getIndex(this.selectedMonsters, monsterListItem) > -1;
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
    this.dialog.open(MonsterFilterDialogComponent, dialogConfig);
  }

  search(): void {
    if (this.searchValue.length === 0) {
      this.searchedFilteredMonsters = this.monsters;
    } else {
      const filtered: MonsterListItem[] = [];
      const search = this.searchValue.toLowerCase();
      this.monsters.forEach((monsterListItem: MonsterListItem) => {
        if (monsterListItem.monster.name.toLowerCase().indexOf(search) > -1) {
          filtered.push(monsterListItem);
        }
      });
      this.searchedFilteredMonsters = filtered;
    }
  }

  private applyFilters(filters: Filters): void {
    this.filters = filters;
    this.initializeMonsters();
  }

  toggleSelectedMenuItem(menuItem: MenuItem): void {
    const index = _.findIndex(this.monsters, (monsterListItem: MonsterListItem) => {
      return monsterListItem.monster.id === menuItem.id;
    });
    if (index > -1) {
      const monster = this.monsters[index];
      this.toggleSelected(monster);
    }
  }

  toggleSelected(monsterListItem: MonsterListItem): void {
    monsterListItem.selected = !monsterListItem.selected;
    this.selectionChange(monsterListItem);
    this.viewingMonster = null;
  }

  selectionChange(monsterListItem: MonsterListItem): void {
    if (monsterListItem.selected) {
      monsterListItem.quantity = 1;
      this.selectedMonsters.push(monsterListItem);
    } else {
      this.onRemoveItem(monsterListItem);
    }
  }

  quantityChange(input, monsterListItem: MonsterListItem): void {
    monsterListItem.quantity = parseInt(input.value, 10);
  }

  onRemoveItem(itemToRemove: MonsterListItem): void {
    const index = this.getIndex(this.selectedMonsters, itemToRemove);
    if (index > -1) {
      this.selectedMonsters.splice(index, 1);
    }

    const listIndex = this.getIndex(this.monsters, itemToRemove);
    if (listIndex > -1) {
      const monster = this.monsters[listIndex];
      monster.selected = false;
      monster.quantity = 0;
    }
  }

  private getIndex(list: MonsterListItem[], monsterListItem: MonsterListItem): number {
    return _.findIndex(list, (_selectionItem: MonsterListItem) => {
      return _selectionItem.monster.id === monsterListItem.monster.id;
    });
  }

  closeDetails(): void {
    this.viewingMonster = null;
  }

  monsterClick(monsterListItem: MonsterListItem): void {
    this.viewingMonster = new MenuItem(monsterListItem.monster.id, monsterListItem.monster.name);
    this.viewingMonster.selected = monsterListItem.selected;
  }

  continueClick(): void {
    this.continue.emit(this.selectedMonsters);
  }

  cancelClick(): void {
    this.close.emit();
  }
}
