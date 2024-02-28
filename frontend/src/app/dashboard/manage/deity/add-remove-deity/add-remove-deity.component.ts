import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MenuItem} from '../../../../shared/models/menuItem.model';
import {Deity} from '../../../../shared/models/attributes/deity';
import {DeityService} from '../../../../core/services/attributes/deity.service';

@Component({
  selector: 'app-add-remove-deity',
  templateUrl: './add-remove-deity.component.html',
  styleUrls: ['./add-remove-deity.component.scss']
})
export class AddRemoveDeityComponent implements OnInit {
  @Input() deity: MenuItem;
  @Output() save = new EventEmitter();
  @Output() cancel = new EventEmitter();

  loading = true;
  viewingDeity: Deity = null;

  constructor(
    private deityService: DeityService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.deityService.getDeity(this.deity.id).then((deity: Deity) => {
      this.viewingDeity = deity;
      this.loading = false;
    });
  }

  close(): void {
    this.cancel.emit();
  }

  continue(): void {
    this.save.emit(this.deity);
  }
}
