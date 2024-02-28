import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ConfirmDialogData} from '../confirm-dialog/confirmDialogData';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent {
  @Input() title = '';
  @Input() primaryLabel = '';
  @Input() primaryDisabled = false;
  @Input() primaryConfirmationMessage = '';
  @Input() secondaryLabel = '';
  @Input() secondaryDisabled = false;
  @Input() secondaryConfirmationMessage = '';
  @Input() tertiaryLabel = '';
  @Input() tertiaryDisabled = false;
  @Input() tertiaryConfirmationMessage = '';
  @Output() close = new EventEmitter();
  @Output() primary = new EventEmitter();
  @Output() secondary = new EventEmitter();
  @Output() tertiary = new EventEmitter();

  constructor(
    private dialog: MatDialog
  ) { }

  primaryClick(event: MouseEvent): void {
    event.stopPropagation();
    this.handleClick(this.primaryConfirmationMessage, this.primary);
  }

  secondaryClick(event: MouseEvent): void {
    event.stopPropagation();
    this.handleClick(this.secondaryConfirmationMessage, this.secondary);
  }

  tertiaryClick(event: MouseEvent): void {
    event.stopPropagation();
    this.handleClick(this.tertiaryConfirmationMessage, this.tertiary);
  }

  closeClick(): void {
    this.close.emit();
  }

  private handleClick(message: string, confirm: any): void {
    if (message !== '') {
      const data = new ConfirmDialogData();
      data.message = message;
      data.confirm = () => {
        confirm.emit();
      };
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.data = data;
      this.dialog.open(ConfirmDialogComponent, dialogConfig);
    } else {
      if (confirm != null) {
        confirm.emit();
      }
    }
  }

}
