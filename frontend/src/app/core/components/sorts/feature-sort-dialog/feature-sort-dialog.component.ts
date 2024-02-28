import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {SortDialogData} from '../sort-dialog-data';
import {SortKey} from '../sort-key.enum';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {EVENTS} from '../../../../constants';
import {Subscription} from 'rxjs';
import {EventsService} from '../../../services/events.service';

@Component({
  selector: 'app-feature-sort-dialog',
  templateUrl: './feature-sort-dialog.component.html',
  styleUrls: ['./feature-sort-dialog.component.scss']
})
export class FeatureSortDialogComponent implements OnInit, OnDestroy {
  data: SortDialogData;
  eventSub: Subscription;
  defaultKey = SortKey.NAME;
  defaultOption = true;
  options: SortKey[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public d: SortDialogData,
    private eventsService: EventsService,
    public dialogRef: MatDialogRef<FeatureSortDialogComponent>
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
    this.options.push(SortKey.CATEGORY);
  }
}
