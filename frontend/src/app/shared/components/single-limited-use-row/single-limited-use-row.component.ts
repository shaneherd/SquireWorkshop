import {Component, EventEmitter, Input, Output} from '@angular/core';
import {LimitedUse} from '../../models/powers/limited-use';
import {LimitedUseType} from '../../models/limited-use-type.enum';
import {TranslateService} from '@ngx-translate/core';
import {ListObject} from '../../models/list-object';

@Component({
  selector: 'app-single-limited-use-row',
  templateUrl: './single-limited-use-row.component.html',
  styleUrls: ['./single-limited-use-row.component.scss']
})
export class SingleLimitedUseRowComponent {
  @Input() limitedUse: LimitedUse;
  @Input() editing = false;
  @Input() disabled = false;
  @Input() deletable = true;
  @Input() showLevel = true;
  @Input() abilities: ListObject[] = [];

  @Output() delete = new EventEmitter();
  @Output() configure = new EventEmitter();

  constructor(
    private translate: TranslateService
  ) { }

  private getAbility(id: string): string {
    for (let i = 0; i < this.abilities.length; i++) {
      if (this.abilities[i].id === id) {
        return this.abilities[i].name;
      }
    }
    return '';
  }

  getDisplayMessage(): string {
    let label = '';
    if (this.showLevel) {
      label = this.translate.instant('Labels.Level', {level: this.limitedUse.characterLevel.name});
    }
    let quantity = '0';
    let modified = false;
    if (this.limitedUse.limitedUseType === LimitedUseType.RECHARGE) {
      quantity = '1';
    } else if (this.limitedUse.quantity > 0) {
      quantity = this.limitedUse.quantity.toString(10);
    }
    if (this.limitedUse.abilityModifier !== '0' && this.limitedUse.limitedUseType !== LimitedUseType.RECHARGE) {
      const ability = this.getAbility(this.limitedUse.abilityModifier);
      if (this.limitedUse.quantity > 0) {
        quantity += ' + ' + ability;
        modified = true;
      } else {
        quantity = ability;
      }
    }

    switch (this.limitedUse.limitedUseType) {
      case LimitedUseType.RECHARGE:
        return quantity;
      case LimitedUseType.QUANTITY:
        return label + quantity;
      case LimitedUseType.DICE:
        if (modified) {
          quantity = '(' + quantity + ')';
        }
        return label + quantity + ' d ' + this.translate.instant('DiceSize.' + this.limitedUse.diceSize);
      case LimitedUseType.LEVEL:
        if (modified) {
          quantity = '(' + quantity + ')';
        }
        quantity = this.translate.instant('MultiplyByLevel', {value: quantity});
        return label + quantity;
    }
  }

  deleteItem(): void {
    if (!this.disabled && this.deletable) {
      this.delete.emit(this.limitedUse);
    }
  }

  configureItem(): void {
    if (!this.disabled) {
      this.configure.emit(this.limitedUse);
    }
  }
}
