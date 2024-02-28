import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MenuItem} from '../../../../shared/models/menuItem.model';
import {CasterTypeService} from '../../../../core/services/attributes/caster-type.service';
import {CasterType} from '../../../../shared/models/attributes/caster-type';

@Component({
  selector: 'app-add-remove-caster-type',
  templateUrl: './add-remove-caster-type.component.html',
  styleUrls: ['./add-remove-caster-type.component.scss']
})
export class AddRemoveCasterTypeComponent implements OnInit {
  @Input() casterType: MenuItem;
  @Output() save = new EventEmitter();
  @Output() cancel = new EventEmitter();

  loading = true;
  viewingCasterType: CasterType = null;

  constructor(
    private casterTypeService: CasterTypeService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.casterTypeService.getCasterType(this.casterType.id).then((casterType: CasterType) => {
      this.viewingCasterType = casterType;
      this.loading = false;
    });
  }

  close(): void {
    this.cancel.emit();
  }

  continue(): void {
    this.save.emit(this.casterType);
  }
}
