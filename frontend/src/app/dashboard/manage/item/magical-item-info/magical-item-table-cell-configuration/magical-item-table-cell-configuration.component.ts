import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-magical-item-table-cell-configuration',
  templateUrl: './magical-item-table-cell-configuration.component.html',
  styleUrls: ['./magical-item-table-cell-configuration.component.scss']
})
export class MagicalItemTableCellConfigurationComponent implements OnInit {
  @Input() value: string;
  @Input() header = false;
  @Input() removable = true;
  @Output() close = new EventEmitter();
  @Output() remove = new EventEmitter();
  @Output() continue = new EventEmitter<string>();

  loading = false;

  constructor(
    private translate: TranslateService
  ) { }

  ngOnInit() {
    if (this.value === this.translate.instant('ClickToEdit')) {
      this.value = '';
    }
  }

  cancelClick(): void {
    this.close.emit();
  }

  continueClick(): void {
    this.continue.emit(this.value);
  }

  removeClick(): void {
    this.remove.emit();
  }

}
