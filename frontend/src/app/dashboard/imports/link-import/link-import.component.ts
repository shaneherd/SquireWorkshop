import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ImportItemConfiguration} from '../../../shared/imports/import-item';
import {ImportService} from '../../../core/services/import/import.service';

@Component({
  selector: 'app-link-import',
  templateUrl: './link-import.component.html',
  styleUrls: ['./link-import.component.scss']
})
export class LinkImportComponent {
  @Input() config: ImportItemConfiguration;
  @Output() saveLink = new EventEmitter<ImportItemConfiguration>();
  @Output() close = new EventEmitter();

  constructor(
    private importService: ImportService
  ) { }

  closeDetails(): void {
    this.close.emit();
  }

  onToggleLink(): void {
    this.importService.toggleLinked(this.config);
    this.saveLink.emit(this.config);
  }
}
