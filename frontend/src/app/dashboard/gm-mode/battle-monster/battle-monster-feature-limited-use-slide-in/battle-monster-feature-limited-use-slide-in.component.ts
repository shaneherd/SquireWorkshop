import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CreatureFeature} from '../../../../shared/models/creatures/creature-feature';
import {CreatureService} from '../../../../core/services/creatures/creature.service';
import {EventsService} from '../../../../core/services/events.service';
import * as _ from 'lodash';
import {CreaturePowerList} from '../../../../shared/models/creatures/creature-power-list';
import {CreaturePower} from '../../../../shared/models/creatures/creature-power';
import {BattleMonster} from '../../../../shared/models/creatures/battle-monsters/battle-monster';
import {BattleMonsterFeature} from '../../../../shared/models/creatures/battle-monster-feature';
import {MonsterService} from '../../../../core/services/creatures/monster.service';

@Component({
  selector: 'app-battle-monster-feature-limited-use-slide-in',
  templateUrl: './battle-monster-feature-limited-use-slide-in.component.html',
  styleUrls: ['./battle-monster-feature-limited-use-slide-in.component.scss']
})
export class BattleMonsterFeatureLimitedUseSlideInComponent implements OnInit {
  @Input() battleMonster: BattleMonster;
  @Output() save = new EventEmitter();
  @Output() close = new EventEmitter();

  features: BattleMonsterFeature[] = [];
  hasLimitedUse = false;

  constructor(
    private monsterService: MonsterService,
    private creatureService: CreatureService,
    private eventsService: EventsService
  ) { }

  ngOnInit() {
    this.initializeValues();
  }

  private initializeValues(): void {
    this.features = _.cloneDeep(this.battleMonster.features);
    this.hasLimitedUse = this.doesHaveLimitedUse();
  }

  private doesHaveLimitedUse(): boolean {
    for (let i = 0; i < this.features.length; i++) {
      if (this.features[i].calculatedMax > 0) {
        return true;
      }
    }
    return false;
  }

  saveClick(): void {
    const creaturePowerList: CreaturePowerList = new CreaturePowerList();
    this.features.forEach((battleMonsterFeature: BattleMonsterFeature) => {
      if (battleMonsterFeature.calculatedMax > 0) {
        const power = new CreaturePower();
        power.id = battleMonsterFeature.id;
        power.powerId = battleMonsterFeature.powerId;
        power.usesRemaining = battleMonsterFeature.usesRemaining;
        power.active = battleMonsterFeature.active;
        creaturePowerList.creaturePowers.push(power);
      }
    });

    this.creatureService.updateBattleMonsterPowers(this.battleMonster, creaturePowerList).then(() => {
      this.battleMonster.features = this.features;
      this.save.emit();
    });
  }

  closeClick(): void {
    this.close.emit();
  }

  resetClick(): void {
    this.monsterService.resetPowerLimitedUses(this.features, this.battleMonster).then(() => {
      this.battleMonster.features = this.features;
      this.save.emit();
    });
  }
}
