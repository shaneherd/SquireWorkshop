import { Injectable } from '@angular/core';
import {ManageListItem} from '../../../shared/components/manage-list/manage-list.component';
import {ManageResultsDialogData, ManageType} from '../../components/manage-results-dialog/manage-results-dialog-data';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ManageResultsDialogComponent} from '../../components/manage-results-dialog/manage-results-dialog.component';
import {ExportDetailsService} from './export.service';

@Injectable({
  providedIn: 'root'
})
export class ExportDialogService {

  constructor(
    private dialog: MatDialog
  ) { }

  showExportDialog(selectedItems: ManageListItem[], proExportOnly: boolean, exportService: ExportDetailsService, exportType: string, callback: () => void, preloadedItem: object = null): void {
    const data = new ManageResultsDialogData();
    data.items = selectedItems;
    data.manageType = ManageType.EXPORT;
    data.exportService = exportService;
    data.exportType = exportType;
    data.proExportOnly = proExportOnly;
    data.preloadedItem = preloadedItem;
    data.done = callback;
    data.cancel = () => {}
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = data;
    this.dialog.open(ManageResultsDialogComponent, dialogConfig);
  }
}
