import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {BattleMonsterAction} from '../../../../shared/models/creatures/battle-monster-action';
import {Action} from '../../../../shared/models/action.enum';

@Component({
  selector: 'app-battle-monster-action-card',
  templateUrl: './battle-monster-action-card.component.html',
  styleUrls: ['./battle-monster-action-card.component.scss']
})
export class BattleMonsterActionCardComponent implements OnInit {
  @Input() action: BattleMonsterAction;
  @Input() clickDisabled = false;
  @Input() highlightActive = false;
  @Input() highlightNonActive = false;
  @Input() canActivate = false;
  @Output() actionClick = new EventEmitter<BattleMonsterAction>();

  isRecharge = false;
  recharge = '';
  isLegendary = false;
  // isLair = false;
  // attack = false;
  // isAttack = false;
  // isSave = false;
  // isHeal = false;
  // isRanged = false;

  constructor() { }

  ngOnInit() {
    this.isRecharge = this.action.rechargeMin > 0 && this.action.rechargeMax > 0;
    if (this.isRecharge) {
      if (this.action.rechargeMin < this.action.rechargeMax) {
        this.recharge = `${this.action.rechargeMin}-${this.action.rechargeMax}`;
      } else {
        this.recharge = this.action.rechargeMin.toString();
      }
    }
    this.isLegendary = this.action.actionType === Action.LEGENDARY;
    // this.isLair = this.action.actionType === Action.LAIR;
    // this.damageConfigurationCollection = this.monsterService.initializeDamageConfigurations(this.action);
    // this.attack = this.damageConfigurationCollection.attackType !== AttackType.NONE;
    // this.isAttack = this.damageConfigurationCollection.attackType === AttackType.ATTACK;
    // this.isSave = this.damageConfigurationCollection.attackType === AttackType.SAVE;
    // this.isHeal = this.damageConfigurationCollection.attackType === AttackType.HEAL;
    // this.isRanged = this.action.rangeType === WeaponRangeType.RANGED;
  }

  onActionClick(): void {
    if (!this.clickDisabled) {
      this.actionClick.emit(this.action);
    }
  }
}
