import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MenuItem} from '../../../../shared/models/menuItem.model';
import {DamageTypeService} from '../../../../core/services/attributes/damage-type.service';
import {DamageType} from '../../../../shared/models/attributes/damage-type';

@Component({
  selector: 'app-add-remove-damage-type',
  templateUrl: './add-remove-damage-type.component.html',
  styleUrls: ['./add-remove-damage-type.component.scss']
})
export class AddRemoveDamageTypeComponent implements OnInit {
  @Input() damageType: MenuItem;
  @Output() save = new EventEmitter();
  @Output() cancel = new EventEmitter();

  loading = true;
  viewingDamageType: DamageType = null;

  constructor(
    private damageTypeService: DamageTypeService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.damageTypeService.getDamageType(this.damageType.id).then((damageType: DamageType) => {
      this.viewingDamageType = damageType;
      this.loading = false;
    });
  }

  close(): void {
    this.cancel.emit();
  }

  continue(): void {
    this.save.emit(this.damageType);
  }
}
