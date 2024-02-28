import {Component, EventEmitter, HostListener, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ListObject} from '../../../../shared/models/list-object';
import {MenuItem} from '../../../../shared/models/menuItem.model';
import {CharacterClassService} from '../../../../core/services/characteristics/character-class.service';
import {MatDialog} from '@angular/material/dialog';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {CdkVirtualScrollViewport} from '@angular/cdk/scrolling';

@Component({
  selector: 'app-add-classes',
  templateUrl: './add-classes.component.html',
  styleUrls: ['./add-classes.component.scss']
})
export class AddClassesComponent implements OnInit {
  @Input() classesToIgnore: ListObject[] = [];
  @Output() close = new EventEmitter();
  @Output() continue = new EventEmitter<ListObject[]>();

  @ViewChild(CdkVirtualScrollViewport, {static: false})
  viewport: CdkVirtualScrollViewport;

  loading = false;
  viewingClass: MenuItem = null;
  searchValue = '';
  classes = new Map<string, MenuItem>();
  filteredClasses: MenuItem[] = [];
  searchedFilteredClasses: MenuItem[] = [];

  constructor(
    private dialog: MatDialog,
    private characterClassService: CharacterClassService
  ) { }

  ngOnInit() {
    this.initializeClasses();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.viewport.checkViewportSize();
  }

  private initializeClasses(): void {
    this.loading = true;
    this.characterClassService.getClasses().then((classes: ListObject[]) => {
      const applicableClasses: ListObject[] = [];
      classes.forEach((characterClass: ListObject) => {
        if (!this.containsClass(characterClass)) {
          applicableClasses.push(characterClass);
        }
      });

      this.setClasses(applicableClasses);
      this.filteredClasses = this.getFullClassesList();
      this.loading = false;
      this.search(this.searchValue);
    });
  }

  private getFullClassesList(): MenuItem[] {
    const list: MenuItem[] = [];
    this.classes.forEach((characterClass: MenuItem, key: string) => {
      list.push(characterClass);
    });
    return list;
  }

  private setClasses(classes: ListObject[]): void {
    this.classes.clear();
    classes.forEach((characterClass: ListObject) => {
      this.classes.set(characterClass.id, new MenuItem(characterClass.id, characterClass.name));
    });
  }

  private containsClass(characterClass: ListObject): boolean {
    if (this.classesToIgnore != null) {
      for (let i = 0; i < this.classesToIgnore.length; i++) {
        const classToIgnore = this.classesToIgnore[i];
        if (classToIgnore.id === characterClass.id) {
          return true;
        }
      }
    }
    return false;
  }

  checkedChange(event: MatCheckboxChange, characterClass: MenuItem): void {
    characterClass.selected = event.checked;
  }

  private getSelectedClasses(): ListObject[] {
    const selectedClasses: ListObject[] = [];
    this.classes.forEach((characterClass: MenuItem) => {
      if (characterClass.selected) {
        selectedClasses.push(new ListObject(characterClass.id, characterClass.name));
      }
    });
    return selectedClasses;
  }

  continueClick(): void {
    this.continue.emit(this.getSelectedClasses());
  }

  cancelClick(): void {
    this.close.emit();
  }

  searchChange(): void {
    this.search(this.searchValue);
  }

  search(searchValue: string): void {
    this.searchValue = searchValue;
    if (searchValue.length === 0) {
      this.searchedFilteredClasses = this.filteredClasses
    } else {
      const search = searchValue.toLowerCase();
      const filtered: MenuItem[] = [];
      this.filteredClasses.forEach((classMenuItem: MenuItem) => {
        if (classMenuItem.name.toLowerCase().indexOf(search) > -1) {
          filtered.push(classMenuItem);
        }
      });
      this.searchedFilteredClasses = filtered;
    }
  }

  toggleSelected(characterClass: MenuItem): void {
    characterClass.selected = !characterClass.selected;
    this.viewingClass = null;
  }

  closeDetails(): void {
    this.viewingClass = null;
  }

  classClick(item: MenuItem): void {
    this.viewingClass = item;
  }
}
