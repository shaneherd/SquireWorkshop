import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {BattleMonster} from '../../../../shared/models/creatures/battle-monsters/battle-monster';
import {BattleMonsterAction} from '../../../../shared/models/creatures/battle-monster-action';
import {MonsterService} from '../../../../core/services/creatures/monster.service';
import {CreatureService} from '../../../../core/services/creatures/creature.service';
import * as _ from 'lodash';
import {CreaturePowerList} from '../../../../shared/models/creatures/creature-power-list';
import {CreaturePower} from '../../../../shared/models/creatures/creature-power';

@Component({
  selector: 'app-battle-monster-action-limited-use-slide-in',
  templateUrl: './battle-monster-action-limited-use-slide-in.component.html',
  styleUrls: ['./battle-monster-action-limited-use-slide-in.component.scss']
})
export class BattleMonsterActionLimitedUseSlideInComponent implements OnInit {
  @Input() battleMonster: BattleMonster;
  @Output() save = new EventEmitter();
  @Output() close = new EventEmitter();

  actions: BattleMonsterAction[] = [];
  hasLimitedUse = false;

  constructor(
    private monsterService: MonsterService,
    private creatureService: CreatureService
  ) { }

  ngOnInit() {
    this.initializeValues();
  }

  private initializeValues(): void {
    this.actions = _.cloneDeep(this.battleMonster.actions);
    this.hasLimitedUse = this.doesHaveLimitedUse();
  }

  private doesHaveLimitedUse(): boolean {
    for (let i = 0; i < this.actions.length; i++) {
      if (this.actions[i].calculatedMax > 0) {
        return true;
      }
    }
    return false;
  }

  saveClick(): void {
    const creaturePowerList: CreaturePowerList = new CreaturePowerList();
    this.actions.forEach((battleMonsterAction: BattleMonsterAction) => {
      if (battleMonsterAction.calculatedMax > 0) {
        const power = new CreaturePower();
        power.id = battleMonsterAction.id;
        power.powerId = battleMonsterAction.powerId;
        power.usesRemaining = battleMonsterAction.usesRemaining;
        power.active = battleMonsterAction.active;
        creaturePowerList.creaturePowers.push(power);
      }
    });

    this.creatureService.updateBattleMonsterPowers(this.battleMonster, creaturePowerList).then(() => {
      this.battleMonster.actions = this.actions;
      this.save.emit();
    });
  }

  closeClick(): void {
    this.close.emit();
  }

  resetClick(): void {
    this.monsterService.resetPowerLimitedUses(this.actions, this.battleMonster).then(() => {
      this.battleMonster.actions = this.actions;
      this.save.emit();
    });
  }
}
