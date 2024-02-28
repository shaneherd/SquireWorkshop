import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {SortDialogData} from '../sort-dialog-data';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {SortKey} from '../sort-key.enum';
import {EVENTS} from '../../../../constants';
import {Subscription} from 'rxjs';
import {EventsService} from '../../../services/events.service';

@Component({
  selector: 'app-spell-sort-dialog',
  templateUrl: './spell-sort-dialog.component.html',
  styleUrls: ['./spell-sort-dialog.component.scss']
})
export class SpellSortDialogComponent implements OnInit, OnDestroy {
  data: SortDialogData;
  eventSub: Subscription;
  defaultOption = true;
  defaultKey = SortKey.NAME;
  options: SortKey[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public d: SortDialogData,
    private eventsService: EventsService,
    public dialogRef: MatDialogRef<SpellSortDialogComponent>
  ) {
    this.data = d;
  }

  ngOnInit() {
    this.initializeOptions();
    this.eventSub = this.eventsService.events.subscribe(event => {
      if (event === EVENTS.Logout) {
        this.dialogRef.close();
      }
    });
  }

  ngOnDestroy() {
    this.eventSub.unsubscribe();
  }

  private initializeOptions(): void {
    this.options = [];
    this.options.push(SortKey.NAME);
    this.options.push(SortKey.LEVEL);
  }
}
