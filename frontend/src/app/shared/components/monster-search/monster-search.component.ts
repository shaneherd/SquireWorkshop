import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {ListObject} from '../../models/list-object';
import {FormControl} from '@angular/forms';
import {Subject, Subscription} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {MonsterService} from '../../../core/services/creatures/monster.service';
import {FilterDialogData} from '../../../core/components/filters/filter-dialog-data';
import {Filters} from '../../../core/components/filters/filters';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ListSource} from '../../models/list-source.enum';
import {MonsterFilterDialogComponent} from '../../../core/components/filters/monster-filter-dialog/monster-filter-dialog.component';

@Component({
  selector: 'app-monster-search',
  templateUrl: './monster-search.component.html',
  styleUrls: ['./monster-search.component.scss']
})
export class MonsterSearchComponent implements OnInit, OnDestroy {
  @Input() selectedMonsterId = '0';
  @Input() disabled = false;
  @Output() monsterSelected = new EventEmitter<ListObject>();

  searchValue = '';

  filters: Filters;
  monsters: ListObject[] = [];
  filteredMonsters: ListObject[] = [];
  selectedMonster: ListObject;

  public monsterFilterFormControl: FormControl = new FormControl();
  protected onDestroy = new Subject<void>();
  valueSub: Subscription;

  constructor(
    private dialog: MatDialog,
    private monsterService: MonsterService
  ) { }

  ngOnInit(): void {
    this.filters = new Filters();

    this.valueSub = this.monsterFilterFormControl.valueChanges
      .pipe(takeUntil(this.onDestroy))
      .subscribe(() => {
        this.filterMonsters();
      });

    this.getMonsters();
  }

  ngOnDestroy() {
    this.valueSub.unsubscribe();
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  private getMonsters(): void {
    this.monsterService.getMonstersWithFilters(ListSource.MY_STUFF, this.filters).then((monsters: ListObject[]) => {
      this.monsters = monsters;
      this.filterMonsters();
      this.initializeSelectedMonster();
    });
  }

  private filterMonsters(): void {
    if (!this.monsters) {
      return;
    }
    // get the search keyword
    let search = this.monsterFilterFormControl.value;
    if (!search) {
      this.filteredMonsters = this.monsters.slice();
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredMonsters = this.monsters.filter(monster => monster.name.toLowerCase().indexOf(search) > -1);
  }

  private initializeSelectedMonster(): void {
    let id = this.selectedMonsterId;
    if (this.selectedMonster != null) {
      id = this.selectedMonster.id;
    }

    for (let i = 0; i < this.filteredMonsters.length; i++) {
      const monster = this.filteredMonsters[i];
      if (monster.id === id) {
        this.selectedMonster = monster;
        this.monsterSelected.emit(this.selectedMonster);
        return;
      }
    }

    if (this.filteredMonsters.length > 0) {
      this.selectedMonster = this.filteredMonsters[0];
      this.monsterSelected.emit(this.selectedMonster);
    }
  }

  selectionChange(monster: ListObject): void {
    this.monsterSelected.emit(monster);
  }

  filter(): void {
    if (this.disabled) {
      return;
    }
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

  private applyFilters(filters: Filters): void {
    this.filters = filters;
    this.getMonsters();
  }
}
