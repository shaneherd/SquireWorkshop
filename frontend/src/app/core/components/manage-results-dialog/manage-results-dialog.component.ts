import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {EventsService} from '../../services/events.service';
import {TranslateService} from '@ngx-translate/core';
import {ManageResultsDialogData, ManageType} from './manage-results-dialog-data';
import {Subscription} from 'rxjs';
import {EVENTS} from '../../../constants';
import {PublishRequest} from '../../../shared/models/publish-request';
import {ExportService} from '../../services/export/export.service';
import {MatSlideToggleChange} from '@angular/material/slide-toggle';

@Component({
  selector: 'app-manage-results-dialog',
  templateUrl: './manage-results-dialog.component.html',
  styleUrls: ['./manage-results-dialog.component.scss']
})
export class ManageResultsDialogComponent implements OnInit, OnDestroy {
  data: ManageResultsDialogData;
  eventSub: Subscription;

  confirmation = true;
  inProgress = false;
  showNamePrompt = false;
  complete = false;
  title = '';
  primaryLabel = '';
  secondaryLabel = '';
  exportFilename = '';
  proExport = true;
  proExportOnly = false;

  successCount = 0;
  errorCount = 0;
  progress = 0;
  percent = '0';
  count = 0;
  total = 0;

  constructor(
    @Inject(MAT_DIALOG_DATA) public d: ManageResultsDialogData,
    private eventsService: EventsService,
    private dialogRef: MatDialogRef<ManageResultsDialogComponent>,
    private translate: TranslateService,
    private exportService: ExportService
  ) {
    this.data = d;
  }

  ngOnInit() {
    this.eventSub = this.eventsService.events.subscribe(event => {
      if (event === EVENTS.Logout) {
        this.dialogRef.close();
      }
    });

    this.title = this.translate.instant(`ManageBulk.${this.data.manageType}.Title.Confirmation`);
    this.primaryLabel = this.translate.instant('Continue');
    this.secondaryLabel = this.translate.instant('Cancel');
    this.total = this.data.items.length;

    this.showNamePrompt = this.data.manageType === ManageType.EXPORT;
    this.proExportOnly = this.data.proExportOnly;
    if (this.showNamePrompt) {
      this.updateFilename();
    }
  }

  ngOnDestroy() {
    this.eventSub.unsubscribe();
  }

  close(): void {
    this.dialogRef.close();
  }

  primaryClick(): void {
    if (this.confirmation) {
      this.confirmation = false;
      this.title = this.translate.instant(`ManageBulk.${this.data.manageType}.Title.InProgress`);
      this.primaryLabel = '';
      this.secondaryLabel = this.translate.instant('Cancel');
      this.inProgress = true;
      this.successCount = 0;
      this.errorCount = 0;
      this.count = 0;
      this.updateProgress();

      setTimeout(() => {
        this.startProcess().then(() => {
          this.inProgress = false;
          this.complete = true;
          this.title = this.translate.instant(`ManageBulk.${this.data.manageType}.Title.Complete`);
          this.primaryLabel = '';
          this.secondaryLabel = this.translate.instant('Close');

          this.data.done();
        });
      }, 500);
    }
  }

  secondaryClick(): void {
    if (this.confirmation) {
      this.data.cancel();
      this.close();
    } else if (this.inProgress) {
      //todo - handle canceling while in progress
      this.data.cancel();
    } else if (this.complete) {
      this.close();
    }
  }

  onProChange(event: MatSlideToggleChange): void {
    this.proExport = event.checked;
    this.updateFilename();
  }

  private updateFilename(): void {
    let filename = `Squire Web - ${this.data.exportType}`;
    if (this.data.items.length === 1) {
      filename = this.data.items[0].menuItem.name;
    }
    if (this.proExport) {
      filename += ' (Pro)';
    } else {
      filename += ' (Free)';
    }
    this.exportFilename = filename;
  }

  private async processExportItem(promise: Promise<object>, exportContent: object[]): Promise<object[]> {
    await promise.then((json: object) => {
      if (json != null) {
        exportContent.push(json);
        this.successCount++;
      } else {
        this.errorCount++;
      }
    }, () => {
      this.errorCount++;
    });
    this.count++;
    this.updateProgress();
    await (this.sleep(10));
    return exportContent;
  }

  private async startProcess(): Promise<void> {
    if (this.data.manageType === ManageType.EXPORT) {
      let exportContent: object[] = [];
      if (this.data.preloadedItem != null) {
        const promise = this.data.exportService.processObject(this.data.preloadedItem, this.proExport);
        exportContent = await this.processExportItem(promise, exportContent);
      } else {
        for (const item of this.data.items) {
          const promise = this.data.exportService.export(item.menuItem.id, this.proExport);
          exportContent = await this.processExportItem(promise, exportContent);
        }
      }

      if (exportContent.length > 0) {
        await this.exportService.writeExportFile(exportContent, `${this.exportFilename}.txt`, this.proExport);
      }
    } else {
      for (const item of this.data.items) {
        switch (this.data.manageType) {
          case ManageType.DELETE:
            await this.data.service.delete(item.menuItem.id).then(() => {
              this.successCount++;
            }, () => {
              this.errorCount++;
            });
            break;
          case ManageType.SHARE:
            await this.data.service.publish(item.menuItem.id, new PublishRequest()).then(() => {
              this.successCount++;
            }, () => {
              this.errorCount++;
            });
            break;
        }
        this.count++;
        this.updateProgress();
        await (this.sleep(10));
      }
    }
  }

  private sleep(ms): Promise<any> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private updateProgress(): void {
    if (this.total === 0) {
      this.progress = 0;
    } else {
      this.progress = this.count / this.total * 100;
    }
    if (this.progress > 100) {
      this.progress = 100;
    }
    this.percent = this.progress.toFixed(2);
  }

}
