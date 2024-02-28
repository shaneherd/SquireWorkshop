import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Feature} from '../../../../shared/models/powers/feature';
import {PowerService} from '../../../../core/services/powers/power.service';
import {PlayerCharacter} from '../../../../shared/models/creatures/characters/player-character';
import {CreatureConfigurationCollection} from '../../../../shared/models/creatures/configs/creature-configuration-collection';
import {CreatureFeature} from '../../../../shared/models/creatures/creature-feature';
import {TranslateService} from '@ngx-translate/core';
import {EVENTS} from '../../../../constants';
import {CharacterService} from '../../../../core/services/creatures/character.service';
import {EventsService} from '../../../../core/services/events.service';
import {CreaturePower} from '../../../../shared/models/creatures/creature-power';
import {CreatureService} from '../../../../core/services/creatures/creature.service';
import {Roll} from '../../../../shared/models/rolls/roll';
import {RollRequest} from '../../../../shared/models/rolls/roll-request';
import {AttackType} from '../../../../shared/models/attack-type.enum';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {RollResultDialogData} from '../../../../core/components/roll-results/roll-result-dialog/roll-result-dialog-data';
import {RollResultDialogComponent} from '../../../../core/components/roll-results/roll-result-dialog/roll-result-dialog.component';
import {DamageConfigurationCollection} from '../../../../shared/models/damage-configuration-collection';
import {DiceService} from '../../../../core/services/dice.service';
import {CharacterLevel} from '../../../../shared/models/character-level';
import {ModifierConfigurationCollection} from '../../../../shared/models/modifier-configuration-collection';
import {RangeType} from '../../../../shared/models/powers/range-type.enum';
import {YesNoDialogData} from '../../../../core/components/yes-no-dialog/yes-no-dialog-data';
import {YesNoDialogComponent} from '../../../../core/components/yes-no-dialog/yes-no-dialog.component';
import {Subscription} from 'rxjs';
import {ButtonAction} from '../../../../shared/models/button/button-action';
import * as _ from 'lodash';

@Component({
  selector: 'app-feature-details-slide-in',
  templateUrl: './feature-details-slide-in.component.html',
  styleUrls: ['./feature-details-slide-in.component.scss']
})
export class FeatureDetailsSlideInComponent implements OnInit, OnDestroy {
  @Input() creatureFeature: CreatureFeature;
  @Input() playerCharacter: PlayerCharacter;
  @Input() collection: CreatureConfigurationCollection;
  @Input() useable = true;
  @Output() use = new EventEmitter();
  @Output() remove = new EventEmitter();
  @Output() close = new EventEmitter();

  eventSub: Subscription;
  configuring = false;
  loading = true;
  viewingFeature: Feature = null;
  useDisabled = false;
  tertiaryLabel = '';
  primaryActions: ButtonAction[] = [];

  characterLevel: CharacterLevel = null;
  damages: DamageConfigurationCollection;
  modifiers: ModifierConfigurationCollection;

  constructor(
    private powerService: PowerService,
    private characterService: CharacterService,
    private creatureService: CreatureService,
    private dialog: MatDialog,
    private eventsService: EventsService,
    private translate: TranslateService,
    private diceService: DiceService
  ) { }

  ngOnInit() {
    this.initializeValues();

    this.eventSub = this.eventsService.events.subscribe(event => {
      if (event === EVENTS.UpdateFeatureList) {
        this.updateCreatureFeature();
      } else if (event === EVENTS.FeatureUpdated + this.creatureFeature.feature.id) {
        this.updateCreatureFeature();
        this.initializeTertiaryButton();
      } else if (event === EVENTS.FeatureRemoved + this.creatureFeature.feature.id) {
        this.closeDetails();
      }
    });
  }

  private initializeActions(): void {
    this.primaryActions = [];
    const self = this;
    if (this.useable && (this.viewingFeature.damageConfigurations.length > 0 || this.viewingFeature.modifierConfigurations.length > 0 || this.viewingFeature.limitedUses.length > 0)) {
      const useBtn = new ButtonAction('USE_FEATURE', self.translate.instant('Use'), () => {
        this.useClick();
      }, this.characterLevel == null || this.useDisabled);
      this.primaryActions.push(useBtn);
    }
    const removeBtn = new ButtonAction('REMOVE_FEATURE', self.translate.instant('Remove'), () => {
      this.removeFeature();
    });
    this.primaryActions.push(removeBtn);
  }

  private updateCreatureFeature(): void {
    if (this.playerCharacter != null) {
      for (let i = 0; i < this.playerCharacter.creatureFeatures.features.length; i++) {
        const feature = this.playerCharacter.creatureFeatures.features[i];
        if (feature.id === this.creatureFeature.id) {
          this.creatureFeature = feature;
          break;
        }
      }
    }
  }

  ngOnDestroy() {
    this.eventSub.unsubscribe();
  }

  private initializeValues(): void {
    this.loading = true;
    this.initializeTertiaryButton();
    this.powerService.getPower(this.creatureFeature.feature.id).then((feature: Feature) => {
      this.viewingFeature = feature;
      this.loading = false;
      this.initializeActions();
    });
  }

  removeFeature(): void {
    this.characterService.removeFeature(this.playerCharacter, this.creatureFeature).then(() => {
      this.configuring = false;
      this.eventsService.dispatchEvent(EVENTS.FetchFeaturesList);
      this.eventsService.dispatchEvent(EVENTS.FeatureRemoved + this.creatureFeature.feature.id);
      this.remove.emit(this.creatureFeature);
    });
  }

  private initializeTertiaryButton() {
    if (!this.useable) {
      this.tertiaryLabel = '';
    } else if (!this.creatureFeature.feature.passive && this.hasModifiers() || this.creatureFeature.active) {
      this.tertiaryLabel = this.creatureFeature.active ? this.translate.instant('Dismiss') : this.translate.instant('Activate');
    } else if (this.creatureFeature.limitedUses.length > 0) {
      this.tertiaryLabel = this.translate.instant('Reset');
    }
  }

  private hasModifiers(): boolean {
    return this.modifiers != null && this.modifiers.modifierConfigurations.length > 0;
  }

  useClick(): void {
    if (this.useDisabled || this.characterLevel == null) {
      return;
    }

    const attackRequest = this.getAttackRequest();
    const damageRequest = this.getDamageRequest();

    const promises = [];
    if (attackRequest != null || damageRequest != null) {
      promises.push(this.creatureService.rollAttackDamage(this.playerCharacter, attackRequest, damageRequest).then((roll: Roll) => {
        this.showRollResult(roll);
      }));
    }

    if (this.creatureFeature.usesRemaining > 0) {
      promises.push(this.creatureService.usePower(this.playerCharacter, this.creatureFeature));
    }

    Promise.all(promises).then(() => {
      this.eventsService.dispatchEvent(EVENTS.FeatureUpdated + this.creatureFeature.feature.id);
      this.use.emit(this.creatureFeature);
    });
  }

  private getAttackRequest(): RollRequest {
    switch (this.damages.attackType) {
      case AttackType.ATTACK:
        const attackDisadvantage = this.characterService.hasModifiedAttackRollDisadvantage(this.playerCharacter, this.collection, null);
        return this.diceService.getAttackRollRequest(
          this.creatureFeature.feature.name,
          this.damages.attackMod,
          this.damages.halfOnSave,
          false,
          attackDisadvantage);
      case AttackType.SAVE:
        return this.diceService.getSaveRollRequest(
          this.creatureFeature.feature.name,
          this.damages.attackMod,
          this.damages.halfOnSave);
      case AttackType.HEAL:
        return this.diceService.getHealRollRequest(this.creatureFeature.feature.name);
    }

    return null;
  }

  private getDamageRequest(): RollRequest {
    const damages = this.damages.damageConfigurations;
    return this.diceService.getDamageRollRequest(this.creatureFeature.feature.name, damages);
  }

  private showRollResult(roll: Roll): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = new RollResultDialogData(this.playerCharacter, roll);
    this.dialog.open(RollResultDialogComponent, dialogConfig);
    this.closeDetails();
  }

  closeDetails(): void {
    this.close.emit();
  }

  tertiaryClick(): void {
    if (!this.creatureFeature.feature.passive && this.hasModifiers() || this.creatureFeature.active) {
      if (this.creatureFeature.active) {
        this.finishActivatingFeature(false);
      } else if (this.viewingFeature.rangeType === RangeType.SELF) {
        this.finishActivatingFeature(true);
      } else {
        this.promptIsSelfTarget();
      }
    } else if (this.creatureFeature.limitedUses.length > 0) {
      const powers: CreaturePower[] = [];
      powers.push(this.creatureFeature);
      this.characterService.resetPowerLimitedUses(powers, this.playerCharacter, this.collection, false, false, true).then(() => {
        this.close.emit();
      });
    } else {
      this.close.emit();
    }
  }

  private promptIsSelfTarget(): void {
    const data = new YesNoDialogData();
    data.title = this.translate.instant('FeatureTarget');
    data.message = this.translate.instant('AreYouTheFeatureTarget');
    data.yes = () => {
      this.finishActivatingFeature(true);
    };
    data.no = () => {
      this.finishActivatingFeature(false);
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = data;
    this.dialog.open(YesNoDialogComponent, dialogConfig);
  }

  private finishActivatingFeature(isSelfTarget: boolean): void {
    const activeTargetCreatureId = isSelfTarget ? this.playerCharacter.id : '0';
    this.characterService.activateFeature(this.playerCharacter, this.creatureFeature, !this.creatureFeature.active, activeTargetCreatureId, this.collection).then(() => {
      this.eventsService.dispatchEvent(EVENTS.FetchFeaturesList);
      this.eventsService.dispatchEvent(EVENTS.ModifiersUpdated);
      this.close.emit();
    });
  }

  characterLevelChange(characterLevel: CharacterLevel): void {
    this.characterLevel = characterLevel;
    this.updateUseDisabledBtn();
  }

  damageChange(damages: DamageConfigurationCollection): void {
    this.damages = damages;
  }

  modifierChange(modifiers: ModifierConfigurationCollection): void {
    this.modifiers = modifiers;
    this.initializeTertiaryButton();
  }

  limitedUseChange(usesRemaining: number): void {
    this.useDisabled = usesRemaining === 0 && this.creatureFeature.calculatedMax > 0;
    this.updateUseDisabledBtn();
  }

  private updateUseDisabledBtn(): void {
    const useBtn = _.find(this.primaryActions, (btn: ButtonAction) => { return btn.event === 'USE_FEATURE'; });
    if (useBtn != null) {
      useBtn.disabled = this.useDisabled || this.characterLevel == null;
    }
  }
}
