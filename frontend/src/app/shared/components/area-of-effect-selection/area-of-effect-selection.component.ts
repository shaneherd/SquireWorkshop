import {Component, Input, OnInit} from '@angular/core';
import {ListObject} from '../../models/list-object';
import {AreaOfEffect} from '../../models/attributes/area-of-effect';
import {AreaOfEffectService} from '../../../core/services/attributes/area-of-effect.service';
import {PowerAreaOfEffect} from '../../models/powers/power-area-of-effect';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-area-of-effect-selection',
  templateUrl: './area-of-effect-selection.component.html',
  styleUrls: ['./area-of-effect-selection.component.scss']
})
export class AreaOfEffectSelectionComponent implements OnInit {
  @Input() powerAreaOfEffect: PowerAreaOfEffect;
  @Input() editing = false;
  @Input() lightIcon = false;
  @Input() showHelp = true;

  areaOfEffects: ListObject[] = [];
  selectedAreaOfEffectListObject: ListObject = new ListObject('0', '');
  selectedAreaOfEffect: AreaOfEffect = new AreaOfEffect();
  none = '';

  constructor(
    private areaOfEffectService: AreaOfEffectService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.none = this.translate.instant('None');
    this.initializeAreaOfEffects();
  }

  private initializeAreaOfEffects(): void {
    this.areaOfEffectService.getAreaOfEffects().then((aoes: ListObject[]) => {
      const none = new ListObject('0', '');
      aoes = aoes.slice(0);
      aoes.unshift(none);
      this.areaOfEffects = aoes;
      this.initializeSelectedAOE();
    });
  }

  aoeChange(value: ListObject): void {
    if (value.id === '0') {
      this.powerAreaOfEffect.areaOfEffect = null;
      this.selectedAreaOfEffectListObject = new ListObject('0', '');
      this.selectedAreaOfEffect = new AreaOfEffect();
    } else {
      this.selectedAreaOfEffectListObject = value;
      this.areaOfEffectService.getAreaOfEffect(value.id).then((areaOfEffect: AreaOfEffect) => {
        this.selectedAreaOfEffect = areaOfEffect;
        this.powerAreaOfEffect.areaOfEffect = areaOfEffect;
      });
      // this.powerAreaOfEffect.areaOfEffect = new AreaOfEffect();
      // this.powerAreaOfEffect.areaOfEffect.id = value.id;
      // this.powerAreaOfEffect.areaOfEffect.name = value.name;
      // this.powerAreaOfEffect.areaOfEffect.description = value.description;
    }
  }

  private initializeSelectedAOE(): void {
    if (this.powerAreaOfEffect.areaOfEffect != null) {
      for (let i = 0; i < this.areaOfEffects.length; i++) {
        const aoe = this.areaOfEffects[i];
        if (aoe.id === this.powerAreaOfEffect.areaOfEffect.id) {
          this.selectedAreaOfEffectListObject = aoe;
          this.areaOfEffectService.getAreaOfEffect(aoe.id).then((areaOfEffect: AreaOfEffect) => {
            this.selectedAreaOfEffect = areaOfEffect;
          });
          return;
        }
      }
    }
    this.defaultSelectedAOE();
  }

  private defaultSelectedAOE(): void {
    if (this.editing && this.areaOfEffects.length > 0) {
      const first = this.areaOfEffects[0];
      this.selectedAreaOfEffectListObject = first;
      if (first.id !== '0') {
        this.areaOfEffectService.getAreaOfEffect(first.id).then((areaOfEffect: AreaOfEffect) => {
          this.selectedAreaOfEffect = areaOfEffect;
          this.powerAreaOfEffect.areaOfEffect = new AreaOfEffect();
          this.powerAreaOfEffect.areaOfEffect.id = this.selectedAreaOfEffect.id;
          this.powerAreaOfEffect.areaOfEffect.name = this.selectedAreaOfEffect.name;
          this.powerAreaOfEffect.areaOfEffect.description = this.selectedAreaOfEffect.description;
        });
      } else {
        this.selectedAreaOfEffect = new AreaOfEffect();
        this.powerAreaOfEffect.areaOfEffect = null;
      }
    }
  }

  radiusChange(input): void {
    this.powerAreaOfEffect.radius = input.value;
  }

  widthChange(input): void {
    this.powerAreaOfEffect.width = input.value;
  }

  heightChange(input): void {
    this.powerAreaOfEffect.height = input.value;
  }

  lengthChange(input): void {
    this.powerAreaOfEffect.length = input.value;
  }
}
