import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {EventsService} from '../../services/events.service';
import {EVENTS} from '../../../constants';
import {ImportResultsDialogData} from './import-results-dialog-data';
import {ImportService} from '../../services/import/import.service';
import {TranslateService} from '@ngx-translate/core';
import {ImportItemConfiguration} from '../../../shared/imports/import-item';
import {ImportCreatureService} from '../../services/import/import-creature.service';

@Component({
  selector: 'app-import-results-dialog',
  templateUrl: './import-results-dialog.component.html',
  styleUrls: ['./import-results-dialog.component.scss']
})
export class ImportResultsDialogComponent implements OnInit, OnDestroy {
  data: ImportResultsDialogData;
  eventSub: Subscription;

  confirmation = true;
  importing = false;
  complete = false;
  title = '';
  primaryLabel = '';
  secondaryLabel = '';

  unconfirmedUseExistingCount = 0;
  useExistingCount = 0;
  unconfirmedReplaceExistingCount = 0;
  replaceExistingCount = 0;
  insertAsNewCount = 0;
  skipEntryCount = 0;

  started = false;
  successCount = 0;
  errorCount = 0;
  progress = 0;
  percent = '0';
  count = 0;
  total = 0;

  characterName = '';
  promptName = false;
  showNamePrompt = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public d: ImportResultsDialogData,
    private eventsService: EventsService,
    private dialogRef: MatDialogRef<ImportResultsDialogComponent>,
    private importService: ImportService,
    private importCreatureService: ImportCreatureService,
    private translate: TranslateService
  ) {
    this.data = d;
  }

  ngOnInit() {
    this.eventSub = this.eventsService.events.subscribe(event => {
      if (event === EVENTS.Logout) {
        this.dialogRef.close();
      }
    });

    this.title = this.translate.instant('Imports.ImportResults.Title.Confirmation');
    this.primaryLabel = this.translate.instant('Continue');
    this.secondaryLabel = this.translate.instant('Cancel');
    this.initializeCounts(this.data.configs);
    if (this.data.configs.length === 1 && this.data.configs[0].importItem.type === 'Character') {
      this.promptName = true;
      this.importCreatureService.getDefaultCharacterName(this.data.configs[0]).then((defaultName: string) => {
        this.characterName = defaultName;
      });
    }
  }

  private initializeCounts(configs: ImportItemConfiguration[]): void {
    configs.forEach((config: ImportItemConfiguration) => {
      if (config.importItem.status !== 'COMPLETE' && config.importItem.status !== 'NOT_SUPPORTED') {
        this.total++;
        switch (config.importItem.selectedAction) {
          case 'USE_EXISTING':
            if (!config.importItem.duplicateConfirmed) {
              this.unconfirmedUseExistingCount++;
            } else {
              this.useExistingCount++;
            }
            break;
          case 'REPLACE_EXISTING':
            if (!config.importItem.duplicateConfirmed) {
              this.unconfirmedReplaceExistingCount++;
            } else {
              this.replaceExistingCount++;
            }
            break;
          case 'INSERT_AS_NEW':
            this.insertAsNewCount++;
            break;
          case 'SKIP_ENTRY':
            this.skipEntryCount++;
            break;
        }
      }

      if (config.children.length > 0) {
        this.initializeCounts(config.children);
      }
    });
  }

  primaryClick(): void {
    if (this.confirmation && this.promptName) {
      this.confirmation = false;
      this.showNamePrompt = true;
      this.title = this.translate.instant('Imports.ImportResults.Title.EnterName');
    } else if (this.confirmation || this.showNamePrompt) {
      if (this.showNamePrompt) {
        this.data.configs[0].importItem.name = this.characterName;
      }
      this.confirmation = false;
      this.showNamePrompt = false;
      this.title = this.translate.instant('Imports.ImportResults.Title.Importing');
      this.primaryLabel = '';
      this.secondaryLabel = this.translate.instant('Cancel');
      this.importing = true;
      this.successCount = 0;
      this.errorCount = 0;
      this.count = 0;
      this.updateProgress();

      setTimeout(() => {
        this.startImport().then(() => {
          this.importing = false;
          this.complete = true;
          this.title = this.translate.instant('Imports.ImportResults.Title.Complete');
          this.primaryLabel = '';
          this.secondaryLabel = this.translate.instant('Close');

          this.data.done();
        });
      }, 500);
    }
  }

  secondaryClick(): void {
    if (this.confirmation || this.showNamePrompt) {
      this.data.cancel();
      this.close();
    } else if (this.importing) {
      //todo - handle canceling while importing
      this.data.cancel();
    } else if (this.complete) {
      this.close();
    }
  }

  ngOnDestroy() {
    this.eventSub.unsubscribe();
  }

  close(): void {
    this.dialogRef.close();
  }

  private sleep(ms): Promise<any> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async startImport(): Promise<void> {
    const prioritizedConfigs = this.importService.getPrioritizedConfigItems(this.data.configs);
    for (const config of prioritizedConfigs) {
      if (config.importItem.status !== 'COMPLETE') {
        if (config.importItem.status === 'NOT_SUPPORTED') {
          this.errorCount++;
        } else {
          await this.importService.processImportItem(config).then(() => {
            if (config.importItem.status === 'COMPLETE') {
              this.successCount++;
            } else {
              this.errorCount++;
            }
          }, () => {
            this.errorCount++;
          });
        }
        this.count++;
        this.updateProgress();
        await (this.sleep(10));
      }
    }
    const importItems = this.importService.getImportItemsFromConfigs(this.data.configs);
    this.importService.updateImportItems(importItems);
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
