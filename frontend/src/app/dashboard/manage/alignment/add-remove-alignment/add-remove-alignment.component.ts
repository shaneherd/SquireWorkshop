import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MenuItem} from '../../../../shared/models/menuItem.model';
import {AlignmentService} from '../../../../core/services/attributes/alignment.service';
import {Alignment} from '../../../../shared/models/attributes/alignment';

@Component({
  selector: 'app-add-remove-alignment',
  templateUrl: './add-remove-alignment.component.html',
  styleUrls: ['./add-remove-alignment.component.scss']
})
export class AddRemoveAlignmentComponent implements OnInit {
  @Input() alignment: MenuItem;
  @Output() save = new EventEmitter();
  @Output() cancel = new EventEmitter();

  loading = true;
  viewingAlignment: Alignment = null;

  constructor(
    private alignmentService: AlignmentService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.alignmentService.getAlignment(this.alignment.id).then((alignment: Alignment) => {
      this.viewingAlignment = alignment;
      this.loading = false;
    });
  }

  close(): void {
    this.cancel.emit();
  }

  continue(): void {
    this.save.emit(this.alignment);
  }
}
