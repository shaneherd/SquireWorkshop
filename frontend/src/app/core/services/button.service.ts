import {EventEmitter, Injectable} from '@angular/core';
import {ConfirmDialogData} from '../components/confirm-dialog/confirmDialogData';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ConfirmDialogComponent} from '../components/confirm-dialog/confirm-dialog.component';
import {ButtonAction} from '../../shared/models/button/button-action';

@Injectable({
  providedIn: 'root'
})
export class ButtonService {

  constructor(
    private dialog: MatDialog
  ) { }

  handleClick(action: ButtonAction, emitter: EventEmitter<ButtonAction>): void {
    if (action.confirmationMessage !== '') {
      const self = this;
      const data = new ConfirmDialogData();
      data.title = action.confirmationTitle;
      data.message = action.confirmationMessage;
      data.confirm = () => {
        self.confirm(action, emitter);
      };
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.data = data;
      this.dialog.open(ConfirmDialogComponent, dialogConfig);
    } else {
      this.confirm(action, emitter);
    }
  }

  private confirm(action: ButtonAction, emitter: EventEmitter<ButtonAction>): void {
    if (action.validate == null) {
      this.continueClick(action, emitter);
    } else {
      if (action.validate()) {
        this.continueClick(action, emitter);
      }
    }
  }

  private continueClick(action: ButtonAction, emitter: EventEmitter<ButtonAction>): void {
    if (action.actionClick != null) {
      action.actionClick();
    }
    emitter.emit(action);
  }
}
