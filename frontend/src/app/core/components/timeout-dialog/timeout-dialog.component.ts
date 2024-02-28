import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import {Router} from '@angular/router';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-timeout-dialog',
  templateUrl: './timeout-dialog.component.html',
  styleUrls: ['./timeout-dialog.component.scss']
})
export class TimeoutDialogComponent {
  data: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public d: any,
    private dialogRef: MatDialogRef<TimeoutDialogComponent>,
  private router: Router
  ) {
    this.data = d;
  }

  closeDialog() {
    this.data.userIdle.stopTimer();
    this.dialogRef.close();
  }

  logout(): void {
    this.dialogRef.close();
    this.router.navigate(['/auth/logout'])
  }
}
