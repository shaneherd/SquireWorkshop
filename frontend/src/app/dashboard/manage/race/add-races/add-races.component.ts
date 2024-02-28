import {Component, EventEmitter, HostListener, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ListObject} from '../../../../shared/models/list-object';
import {MenuItem} from '../../../../shared/models/menuItem.model';
import {MatDialog} from '@angular/material/dialog';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {RaceService} from '../../../../core/services/characteristics/race.service';
import {CdkVirtualScrollViewport} from '@angular/cdk/scrolling';

@Component({
  selector: 'app-add-races',
  templateUrl: './add-races.component.html',
  styleUrls: ['./add-races.component.scss']
})
export class AddRacesComponent implements OnInit {
  @Input() racesToIgnore: ListObject[] = [];
  @Output() close = new EventEmitter();
  @Output() continue = new EventEmitter<ListObject[]>();

  @ViewChild(CdkVirtualScrollViewport, {static: false})
  viewport: CdkVirtualScrollViewport;

  loading = false;
  viewingRace: MenuItem = null;
  races: MenuItem[] = [];

  constructor(
    private dialog: MatDialog,
    private raceService: RaceService
  ) { }

  ngOnInit() {
    this.initializeRaces();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.viewport.checkViewportSize();
  }

  private initializeRaces(): void {
    this.loading = true;
    this.raceService.getRaces(true).then((races: ListObject[]) => {
      const applicableRaces: ListObject[] = [];
      races.forEach((race: ListObject) => {
        if (!this.containsRace(race)) {
          applicableRaces.push(race);
        }
      });

      this.setRaces(applicableRaces);
      this.loading = false;
    });
  }

  private setRaces(races: ListObject[]): void {
    this.races = [];
    races.forEach((race: ListObject) => {
      this.races.push(new MenuItem(race.id, race.name));
    });
  }

  private containsRace(race: ListObject): boolean {
    if (this.racesToIgnore != null) {
      for (let i = 0; i < this.racesToIgnore.length; i++) {
        const raceToIgnore = this.racesToIgnore[i];
        if (raceToIgnore.id === race.id) {
          return true;
        }
      }
    }
    return false;
  }

  checkedChange(event: MatCheckboxChange, race: MenuItem): void {
    race.selected = event.checked;
  }

  private getSelectedRaces(): ListObject[] {
    const selectedRaces: ListObject[] = [];
    this.races.forEach((race: MenuItem) => {
      if (race.selected) {
        selectedRaces.push(new ListObject(race.id, race.name));
      }
    });
    return selectedRaces;
  }

  continueClick(): void {
    this.continue.emit(this.getSelectedRaces());
  }

  cancelClick(): void {
    this.close.emit();
  }

  toggleSelected(race: MenuItem): void {
    race.selected = !race.selected;
    this.viewingRace = null;
  }

  closeDetails(): void {
    this.viewingRace = null;
  }

  raceClick(item: MenuItem): void {
    this.viewingRace = item;
  }
}
