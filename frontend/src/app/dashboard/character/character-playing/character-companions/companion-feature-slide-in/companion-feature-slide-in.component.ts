import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MonsterFeature} from '../../../../../shared/models/creatures/monsters/monster';
import {LimitedUseType} from '../../../../../shared/models/limited-use-type.enum';
import {Companion} from '../../../../../shared/models/creatures/companions/companion';
import {CreatureConfigurationCollection} from '../../../../../shared/models/creatures/configs/creature-configuration-collection';
import {CompanionService} from '../../../../../core/services/creatures/companion.service';
import {CompanionFeature} from '../../../../../shared/models/creatures/companion-feature';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-companion-feature-slide-in',
  templateUrl: './companion-feature-slide-in.component.html',
  styleUrls: ['./companion-feature-slide-in.component.scss']
})
export class CompanionFeatureSlideInComponent implements OnInit {
  @Input() companionFeature: CompanionFeature;
  @Input() companion: Companion;
  @Input() collection: CreatureConfigurationCollection;
  @Output() use = new EventEmitter<CompanionFeature>();
  @Output() close = new EventEmitter();

  feature: MonsterFeature = null;
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
    private companionService: CompanionService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.feature = this.companionFeature.monsterFeature;
    this.initializeLimitedUse();
    this.useDisabled = this.limitedUse && this.usesRemaining === 0;
  }

  private initializeLimitedUse(): void {
    this.limitedUse = this.feature.limitedUse != null;
    this.isQuantity = this.feature.limitedUse != null && this.feature.limitedUse.limitedUseType === LimitedUseType.QUANTITY;
    this.isRecharge = this.feature.limitedUse != null && this.feature.limitedUse.limitedUseType === LimitedUseType.RECHARGE;
    if (this.limitedUse) {
      this.tertiaryLabel = this.isRecharge ? this.translate.instant('Recharge') : this.translate.instant('Reset');
    }

    this.usesRemaining = this.companionFeature.usesRemaining;
    this.maxUses = this.companionService.getMaxUses(this.feature, this.collection);
    this.usesRemainingDisplay = this.companionService.getLimitedUseDisplay(this.usesRemaining, this.feature);
    this.rechargeDisplay = this.companionService.getRechargeDisplay(this.feature);
    this.tertiaryDisabled = this.usesRemaining === this.maxUses;
  }

  closeClick(): void {
    this.close.emit();
  }

  useClick(): void {
    if (this.limitedUse) {
      this.companionService.usePower(this.companionFeature, this.companion).then(() => {
        // this.eventsService.dispatchEvent(EVENTS.FeatureUpdated + this.creatureFeature.feature.id);
        this.use.emit(this.companionFeature);
      });
    } else {
      this.use.emit(this.companionFeature);
    }
  }

  tertiaryClick(): void {
    if (this.isRecharge) {
      this.rechargeClick();
    } else {
      this.resetClick();
    }
  }

  private resetClick(): void {
    this.companionService.resetPower(this.companionFeature, this.companion).then(() => {
      this.companionFeature.usesRemaining = this.companionFeature.calculatedMax;
      this.usesRemaining = this.companionFeature.usesRemaining;
      this.usesRemainingDisplay = this.companionService.getLimitedUseDisplay(this.usesRemaining, this.feature);
      this.tertiaryDisabled = true;
      this.useDisabled = false;
    });
  }

  private rechargeClick(): void {
    this.companionService.rollRecharge(this.companionFeature.monsterFeature, this.companion).then((success: boolean) => {
      if (success) {
        this.companionService.resetPower(this.companionFeature, this.companion).then(() => {
          this.companionFeature.usesRemaining = this.companionFeature.calculatedMax;
          this.usesRemaining = this.companionFeature.usesRemaining;
          this.usesRemainingDisplay = this.companionService.getLimitedUseDisplay(this.usesRemaining, this.feature);
          this.tertiaryDisabled = true;
          this.useDisabled = false;
        });
      }
    });
  }
}
