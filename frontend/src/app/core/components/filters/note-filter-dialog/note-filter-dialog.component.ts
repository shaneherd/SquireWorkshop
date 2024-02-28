import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FilterDialogData} from '../filter-dialog-data';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FilterValue} from '../filter-value';
import {Filters} from '../filters';
import {EVENTS} from '../../../../constants';
import {Subscription} from 'rxjs';
import {EventsService} from '../../../services/events.service';

@Component({
  selector: 'app-note-filter-dialog',
  templateUrl: './note-filter-dialog.component.html',
  styleUrls: ['./note-filter-dialog.component.scss']
})
export class NoteFilterDialogComponent implements OnInit, OnDestroy {
  data: FilterDialogData;
  eventSub: Subscription;
  filters: Filters;

  constructor(
    @Inject(MAT_DIALOG_DATA) public d: FilterDialogData,
    private eventsService: EventsService,
    private dialogRef: MatDialogRef<NoteFilterDialogComponent>
  ) {
    this.data = d;
  }

  ngOnInit() {
    this.eventSub = this.eventsService.events.subscribe(event => {
      if (event === EVENTS.Logout) {
        this.dialogRef.close();
      }
    });
  }

  ngOnDestroy() {
    this.eventSub.unsubscribe();
  }

  private setFilters(): void {
    const filters: FilterValue[] = [];
    // filters.push(this.category);
    this.data.filters.filterValues = filters;
    this.data.filters.filtersApplied = this.filtersApplied();
  }

  private filtersApplied(): boolean {
    return false;
    // return this.category.value !== this.defaultOption ||
    //   this.level.value !== this.defaultOption ||
    //   this.range.value !== this.defaultOption;
  }

  apply(): void {
    this.setFilters();
    this.data.apply(this.data.filters);
    this.dialogRef.close();
  }

  private clearFilters(): void {
    // this.category.value = this.defaultOption;
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
