import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {BattleMonster} from '../../../../shared/models/creatures/battle-monsters/battle-monster';
import {BattleMonsterAction} from '../../../../shared/models/creatures/battle-monster-action';
import {ButtonAction} from '../../../../shared/models/button/button-action';
import {MonsterAction} from '../../../../shared/models/creatures/monsters/monster';
import {TranslateService} from '@ngx-translate/core';
import {MonsterService} from '../../../../core/services/creatures/monster.service';
import {CreatureService} from '../../../../core/services/creatures/creature.service';
import {NotificationService} from '../../../../core/services/notification.service';
import {CreaturePower} from '../../../../shared/models/creatures/creature-power';
import {DiceService} from '../../../../core/services/dice.service';
import {RollRequest} from '../../../../shared/models/rolls/roll-request';
import {RollType} from '../../../../shared/models/rolls/roll-type.enum';
import {AttackType} from '../../../../shared/models/attack-type.enum';
import {Roll} from '../../../../shared/models/rolls/roll';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {RollResultDialogData} from '../../../../core/components/roll-results/roll-result-dialog/roll-result-dialog-data';
import {RollResultDialogComponent} from '../../../../core/components/roll-results/roll-result-dialog/roll-result-dialog.component';
import {CreatureConfigurationCollection} from '../../../../shared/models/creatures/configs/creature-configuration-collection';
import {AbilityService} from '../../../../core/services/attributes/ability.service';
import {DamageConfigurationCollection} from '../../../../shared/models/damage-configuration-collection';

@Component({
  selector: 'app-battle-monster-action-details-slide-in',
  templateUrl: './battle-monster-action-details-slide-in.component.html',
  styleUrls: ['./battle-monster-action-details-slide-in.component.scss']
})
export class BattleMonsterActionDetailsSlideInComponent implements OnInit {
  @Input() battleMonster: BattleMonster;
  @Input() action: BattleMonsterAction;
  @Input() collection: CreatureConfigurationCollection;
  @Output() use = new EventEmitter<BattleMonsterAction>();
  @Output() close = new EventEmitter();

  loading = false;
  primaryActions: ButtonAction[] = [];
  monsterAction: MonsterAction = null;
  tertiaryLabel = '';
  isRecharge = false;
  damages: DamageConfigurationCollection;

  constructor(
    private dialog: MatDialog,
    private abilityService: AbilityService,
    private translate: TranslateService,
    private monsterService: MonsterService,
    private creatureService: CreatureService,
    private notificationService: NotificationService,
    private diceService: DiceService
  ) { }

  ngOnInit() {
    this.initializeMonsterAction();
    this.initializeTertiaryButton();
  }

  private initializeMonsterAction(): void {
    this.loading = true;
    this.monsterService.getAction(this.action.powerId).then((action: MonsterAction) => {
      this.monsterAction = action;
      this.initializeActions();
      this.loading = false;
    }, () => {
      this.loading = false;
      this.notificationService.error(this.translate.instant('Encounter.Error.Loading'));
    });
  }

  closeDetails(): void {
    this.close.emit();
  }

  private initializeActions(): void {
    this.primaryActions = [];
    const self = this;
    if (this.action.calculatedMax > 0 || this.monsterAction.legendaryCost > 0 || this.monsterAction.attackType !== AttackType.NONE) {
      const disabled = (this.action.calculatedMax > 0 && this.action.usesRemaining === 0)
        || (this.monsterAction.legendaryCost > 0 && this.battleMonster.legendaryPoints < this.monsterAction.legendaryCost);
      const useBtn = new ButtonAction('USE_ACTION', self.translate.instant('Use'), () => {
        self.useClick();
      }, disabled);
      this.primaryActions.push(useBtn);
    }
  }

  private useClick(): void {
    this.loading = true;
    const promises = [];
    if (this.action.calculatedMax > 0) {
      promises.push(this.creatureService.usePower(this.battleMonster, this.action));
    }
    if (this.monsterAction.legendaryCost > 0) {
      let newPoints = this.battleMonster.legendaryPoints - this.monsterAction.legendaryCost;
      if (newPoints < 0) {
        newPoints = 0;
      }
      promises.push(this.monsterService.updateLegendaryPoints(this.battleMonster, newPoints).then(() => {
        this.battleMonster.legendaryPoints = newPoints;
      }));
    }
    if (this.monsterAction.attackType !== AttackType.NONE) {
      const attackRequest = this.getAttackRequest();
      const damageRequest = this.getDamageRequest();

      promises.push(this.creatureService.rollAttackDamage(this.battleMonster, attackRequest, damageRequest).then((roll: Roll) => {
        this.showAttackResult(roll);
      }));
    }

    Promise.all(promises).then(() => {
      this.loading = false;
      this.use.emit(this.action);
    }, () => {
      this.loading = false;
      this.notificationService.error(this.translate.instant('Encounter.Error.Use'));
    });
  }

  private getAttackRequest(): RollRequest {
    switch (this.monsterAction.attackType) {
      case AttackType.ATTACK:
        const ability = this.abilityService.getAbilityByName(this.monsterAction.attackAbilityModifier);
        const abilitySID = ability == null ? null : ability.sid;
        const attackDisadvantage = this.creatureService.hasModifiedAttackRollDisadvantage(this.battleMonster, abilitySID, this.collection);
        return this.diceService.getAttackRollRequest(
          this.action.powerName,
          this.damages.attackMod,
          this.damages.halfOnSave,
          false,
          attackDisadvantage);
      case AttackType.SAVE:
        return this.diceService.getSaveRollRequest(
          this.action.powerName,
          this.damages.attackMod,
          this.damages.halfOnSave);
      case AttackType.HEAL:
        return this.diceService.getHealRollRequest(this.action.powerName);
    }

    return null;
  }

  private getDamageRequest(): RollRequest {
    const damages = this.monsterAction.damageConfigurations;
    return this.diceService.getDamageRollRequest(this.action.powerName, damages);
  }

  private showAttackResult(roll: Roll): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = new RollResultDialogData(this.battleMonster, roll);
    this.dialog.open(RollResultDialogComponent, dialogConfig);
    this.closeDetails();
  }

  tertiaryClick(): void {
    if (this.isRecharge) {
      this.rechargeClick();
    } else if (this.action.calculatedMax > 0) {
      this.resetClick();
    }
  }

  private rechargeClick(): void {
    const roll = this.diceService.roll(this.getRechargeRollRequest());
    if (roll.totalResult >= this.action.rechargeMin) {
      this.notificationService.success(this.translate.instant('Encounter.Recharge.Success', {name: this.action.powerName, roll: roll.totalResult}));
      this.resetClick(false);
    } else {
      this.notificationService.error(this.translate.instant('Encounter.Recharge.Fail', {name: this.action.powerName, roll: roll.totalResult}));
    }
  }

  private getRechargeRollRequest(): RollRequest {
    const rollRequest = this.diceService.getRollRequest(
      RollType.STANDARD,
      this.action.powerName + ' - recharge',
      null,
      0,
      false,
      false,
      false
    );
    rollRequest.diceCollections[0].max = this.action.rechargeMax;
    return rollRequest;
  }

  private resetClick(close: boolean = true): void {
    this.loading = true;
    const powers: CreaturePower[] = [];
    powers.push(this.action);
    this.monsterService.resetPowerLimitedUses(powers, this.battleMonster).then(() => {
      this.loading = false;
      if (close) {
        this.close.emit();
      } else {
        this.primaryActions[0].disabled = false;
      }
    }, () => {
      this.loading = false;
      this.notificationService.error(this.translate.instant('Encounter.Error.Reset'));
    });
  }

  private initializeTertiaryButton() {
    this.isRecharge = this.action.rechargeMin > 0 && this.action.rechargeMax > 0;
    if (this.isRecharge) {
      this.tertiaryLabel = this.translate.instant('Recharge');
    } else if (this.action.calculatedMax > 0) {
      this.tertiaryLabel = this.translate.instant('Reset');
    }
  }

  damageChange(damages: DamageConfigurationCollection): void {
    this.damages = damages;
  }
}
