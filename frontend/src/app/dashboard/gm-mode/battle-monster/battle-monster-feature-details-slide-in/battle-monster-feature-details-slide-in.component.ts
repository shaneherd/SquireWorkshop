import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {BattleMonster} from '../../../../shared/models/creatures/battle-monsters/battle-monster';
import {BattleMonsterFeature} from '../../../../shared/models/creatures/battle-monster-feature';
import {ButtonAction} from '../../../../shared/models/button/button-action';
import {MonsterFeature} from '../../../../shared/models/creatures/monsters/monster';
import {TranslateService} from '@ngx-translate/core';
import {MonsterService} from '../../../../core/services/creatures/monster.service';
import {CreaturePower} from '../../../../shared/models/creatures/creature-power';
import {CreatureService} from '../../../../core/services/creatures/creature.service';
import {NotificationService} from '../../../../core/services/notification.service';

@Component({
  selector: 'app-battle-monster-feature-details-slide-in',
  templateUrl: './battle-monster-feature-details-slide-in.component.html',
  styleUrls: ['./battle-monster-feature-details-slide-in.component.scss']
})
export class BattleMonsterFeatureDetailsSlideInComponent implements OnInit {
  @Input() battleMonster: BattleMonster;
  @Input() feature: BattleMonsterFeature;
  @Output() use = new EventEmitter<BattleMonsterFeature>();
  @Output() close = new EventEmitter();

  loading = false;
  primaryActions: ButtonAction[] = [];
  monsterFeature: MonsterFeature = null;
  tertiaryLabel = '';

  constructor(
    private translate: TranslateService,
    private monsterService: MonsterService,
    private creatureService: CreatureService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.initializeMonsterFeature();
    this.initializeActions();
    this.initializeTertiaryButton();
  }

  private initializeMonsterFeature(): void {
    this.loading = true;
    this.monsterService.getFeature(this.feature.powerId).then((feature: MonsterFeature) => {
      this.loading = false;
      this.monsterFeature = feature;
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
    if (this.feature.calculatedMax > 0) {
      const useBtn = new ButtonAction('USE_FEATURE', self.translate.instant('Use'), () => {
        self.useClick();
      }, this.feature.usesRemaining === 0);
      this.primaryActions.push(useBtn);
    }
  }

  private useClick(): void {
    this.loading = true;
    this.creatureService.usePower(this.battleMonster, this.feature).then(() => {
      this.loading = false;
      this.use.emit(this.feature);
    }, () => {
      this.loading = false;
      this.notificationService.error(this.translate.instant('Encounter.Error.Use'));
    });
  }

  tertiaryClick(): void {
    if (this.feature.calculatedMax > 0) {
      this.resetClick();
    }
  }

  private resetClick(): void {
    this.loading = true;
    const powers: CreaturePower[] = [];
    powers.push(this.feature);
    this.monsterService.resetPowerLimitedUses(powers, this.battleMonster).then(() => {
      this.loading = false;
      this.close.emit();
    }, () => {
      this.loading = false;
      this.notificationService.error(this.translate.instant('Encounter.Error.Reset'));
    });
  }

  private initializeTertiaryButton() {
    if (this.feature.calculatedMax > 0) {
      this.tertiaryLabel = this.translate.instant('Reset');
    }
  }

}
