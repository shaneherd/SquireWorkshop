import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-add-remove-slide-in',
  templateUrl: './add-remove-slide-in.component.html',
  styleUrls: ['./add-remove-slide-in.component.scss']
})
export class AddRemoveSlideInComponent {
  @Input() headerName: string;
  @Input() loading: boolean;
  @Input() selected: boolean;
  @Input() selectable = true;
  @Input() disabled = false;
  @Output() save = new EventEmitter();
  @Output() cancel = new EventEmitter();

  constructor() { }

  close(): void {
    this.cancel.emit();
  }

  continue(): void {
    this.save.emit();
  }

}
