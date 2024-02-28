import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MenuItem} from '../../../../shared/models/menuItem.model';
import {BackgroundService} from '../../../../core/services/characteristics/background.service';
import {Background} from '../../../../shared/models/characteristics/background';

@Component({
  selector: 'app-add-remove-background',
  templateUrl: './add-remove-background.component.html',
  styleUrls: ['./add-remove-background.component.scss']
})
export class AddRemoveBackgroundComponent implements OnInit {
  @Input() background: MenuItem;
  @Output() save = new EventEmitter();
  @Output() cancel = new EventEmitter();

  loading = true;
  viewingBackground: Background = null;

  constructor(
    private backgroundService: BackgroundService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.backgroundService.getBackground(this.background.id).then((background: Background) => {
      this.viewingBackground = background;
      this.loading = false;
    });
  }

  close(): void {
    this.cancel.emit();
  }

  continue(): void {
    this.save.emit(this.background);
  }
}
