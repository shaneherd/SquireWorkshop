import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MonsterAction} from '../../../../../shared/models/creatures/monsters/monster';
import {Action} from '../../../../../shared/models/action.enum';
import {AttackType} from '../../../../../shared/models/attack-type.enum';
import {WeaponRangeType} from '../../../../../shared/models/items/weapon-range-type.enum';
import {DamageConfigurationCollection} from '../../../../../shared/models/damage-configuration-collection';
import {LimitedUseType} from '../../../../../shared/models/limited-use-type.enum';
import {CreatureConfigurationCollection} from '../../../../../shared/models/creatures/configs/creature-configuration-collection';
import {CompanionService} from '../../../../../core/services/creatures/companion.service';
import {Companion} from '../../../../../shared/models/creatures/companions/companion';
import {Roll} from '../../../../../shared/models/rolls/roll';
import {RollRequest} from '../../../../../shared/models/rolls/roll-request';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {RollResultDialogData} from '../../../../../core/components/roll-results/roll-result-dialog/roll-result-dialog-data';
import {RollResultDialogComponent} from '../../../../../core/components/roll-results/roll-result-dialog/roll-result-dialog.component';
import {CreatureService} from '../../../../../core/services/creatures/creature.service';
import {DiceService} from '../../../../../core/services/dice.service';
import {CompanionAction} from '../../../../../shared/models/creatures/companion-action';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-companion-action-slide-in',
  templateUrl: './companion-action-slide-in.component.html',
  styleUrls: ['./companion-action-slide-in.component.scss']
})
export class CompanionActionSlideInComponent implements OnInit {
  @Input() companionAction: CompanionAction;
  @Input() companion: Companion;
  @Input() collection: CreatureConfigurationCollection;
  @Output() use = new EventEmitter<CompanionAction>();
  @Output() close = new EventEmitter();

  action: MonsterAction;
  isLegendary = false;
  attack = false;
  isAttack = false;
  isSave = false;
  isHeal = false;
  isRanged = false;

  selectedAttackAbilityModifier = '';
  selectedSaveAbilityModifier = '';

  damageConfigurationCollection: DamageConfigurationCollection = new DamageConfigurationCollection();

  limitedUse = false;
  isQuantity = true;
  isRecharge = false;
  tertiaryLabel = '';
  tertiaryDisabled = false;
  usesRemaining = 0;
  maxUses = 0;
  usesRemainingDisplay = '';
  rechargeDisplay = '';
  useDisabled = false;

  constructor(
    private dialog: MatDialog,
    private companionService: CompanionService,
    private creatureService: CreatureService,
    private diceService: DiceService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.action = this.companionAction.monsterAction;
    this.isLegendary = this.action.actionType === Action.LEGENDARY;
    this.attack = this.action.attackType !== AttackType.NONE;
    this.isAttack = this.action.attackType === AttackType.ATTACK;
    this.isSave = this.action.attackType === AttackType.SAVE;
    this.isHeal = this.action.attackType === AttackType.HEAL;
    this.isRanged = this.action.rangeType === WeaponRangeType.RANGED;
    this.damageConfigurationCollection = this.companionService.initializeDamageConfigurations(this.action, this.companion, this.collection);
    this.initializeLimitedUse();
    this.useDisabled = this.limitedUse && this.usesRemaining === 0;
  }

  private initializeLimitedUse(): void {
    this.limitedUse = this.action.limitedUse != null;
    this.isQuantity = this.action.limitedUse != null && this.action.limitedUse.limitedUseType === LimitedUseType.QUANTITY;
    this.isRecharge = this.action.limitedUse != null && this.action.limitedUse.limitedUseType === LimitedUseType.RECHARGE;
    if (this.limitedUse) {
      this.tertiaryLabel = this.isRecharge ? this.translate.instant('Recharge') : this.translate.instant('Reset');
    }

    this.usesRemaining = this.companionAction.usesRemaining;
    this.maxUses = this.companionService.getMaxUses(this.action, this.collection);
    this.usesRemainingDisplay = this.companionService.getLimitedUseDisplay(this.usesRemaining, this.action);
    this.rechargeDisplay = this.companionService.getRechargeDisplay(this.action);
    this.tertiaryDisabled = this.usesRemaining === this.maxUses;
  }

  closeClick(): void {
    this.close.emit();
  }

  useClick(): void {
    if (this.useDisabled || this.companion == null) {
      return;
    }

    const attackRequest = this.getAttackRequest();
    const damageRequest = this.getDamageRequest();

    const promises = [];
    if (attackRequest != null || damageRequest != null) {
      promises.push(this.creatureService.rollAttackDamage(this.companion, attackRequest, damageRequest).then((roll: Roll) => {
        this.showRollResult(roll);
      }));
    }

    if (this.usesRemaining > 0) {
      promises.push(this.companionService.usePower(this.companionAction, this.companion));
    }

    Promise.all(promises).then(() => {
      this.usesRemaining--;
      if (this.usesRemaining < 0) {
        this.usesRemaining = 0;
      }
      this.companionAction.usesRemaining = this.usesRemaining;
      // this.eventsService.dispatchEvent(EVENTS.FeatureUpdated + this.creatureFeature.feature.id);
      this.use.emit(this.companionAction);
    });
  }

  tertiaryClick(): void {
    if (this.isRecharge) {
      this.rechargeClick();
    } else {
      this.resetClick();
    }
  }

  private resetClick(): void {
    this.companionService.resetPower(this.companionAction, this.companion).then(() => {
      this.companionAction.usesRemaining = this.companionAction.calculatedMax;
      this.usesRemaining = this.companionAction.usesRemaining;
      this.usesRemainingDisplay = this.companionService.getLimitedUseDisplay(this.usesRemaining, this.action);
      this.tertiaryDisabled = true;
      this.useDisabled = false;
    });
  }

  private rechargeClick(): void {
    this.companionService.rollRecharge(this.companionAction.monsterAction, this.companion).then((success: boolean) => {
      if (success) {
        this.companionService.resetPower(this.companionAction, this.companion).then(() => {
          this.companionAction.usesRemaining = this.companionAction.calculatedMax;
          this.usesRemaining = this.companionAction.usesRemaining;
          this.usesRemainingDisplay = this.companionService.getLimitedUseDisplay(this.usesRemaining, this.action);
          this.tertiaryDisabled = true;
          this.useDisabled = false;
        });
      }
    });
  }

  private getAttackRequest(): RollRequest {
    switch (this.damageConfigurationCollection.attackType) {
      case AttackType.ATTACK:
        const attackDisadvantage = false; // this.characterService.hasModifiedAttackRollDisadvantage(this.playerCharacter, this.collection, null);
        return this.diceService.getAttackRollRequest(
          this.action.name,
          this.damageConfigurationCollection.attackMod,
          this.damageConfigurationCollection.halfOnSave,
          false,
          attackDisadvantage);
      case AttackType.SAVE:
        return this.diceService.getSaveRollRequest(
          this.action.name,
          this.damageConfigurationCollection.attackMod,
          this.damageConfigurationCollection.halfOnSave);
      case AttackType.HEAL:
        return this.diceService.getHealRollRequest(this.action.name);
    }

    return null;
  }

  private getDamageRequest(): RollRequest {
    const damages = this.damageConfigurationCollection.damageConfigurations;
    return this.diceService.getDamageRollRequest(this.action.name, damages);
  }

  private showRollResult(roll: Roll): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = new RollResultDialogData(this.companion, roll);
    this.dialog.open(RollResultDialogComponent, dialogConfig);
    this.closeClick();
  }

}
