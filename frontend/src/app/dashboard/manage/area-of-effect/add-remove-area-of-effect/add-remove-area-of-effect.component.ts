import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MenuItem} from '../../../../shared/models/menuItem.model';
import {AreaOfEffectService} from '../../../../core/services/attributes/area-of-effect.service';
import {AreaOfEffect} from '../../../../shared/models/attributes/area-of-effect';

@Component({
  selector: 'app-add-remove-area-of-effect',
  templateUrl: './add-remove-area-of-effect.component.html',
  styleUrls: ['./add-remove-area-of-effect.component.scss']
})
export class AddRemoveAreaOfEffectComponent implements OnInit {
  @Input() areaOfEffect: MenuItem;
  @Output() save = new EventEmitter();
  @Output() cancel = new EventEmitter();

  loading = true;
  viewingAreaOfEffect: AreaOfEffect = null;

  constructor(
    private areaOfEffectService: AreaOfEffectService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.areaOfEffectService.getAreaOfEffect(this.areaOfEffect.id).then((areaOfEffect: AreaOfEffect) => {
      this.viewingAreaOfEffect = areaOfEffect;
      this.loading = false;
    });
  }

  close(): void {
    this.cancel.emit();
  }

  continue(): void {
    this.save.emit(this.areaOfEffect);
  }
}
