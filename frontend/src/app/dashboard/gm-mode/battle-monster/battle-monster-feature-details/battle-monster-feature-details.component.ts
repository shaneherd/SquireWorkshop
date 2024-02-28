import {Component, Input, OnInit} from '@angular/core';
import {MonsterFeature} from '../../../../shared/models/creatures/monsters/monster';
import {ListObject} from '../../../../shared/models/list-object';
import {AbilityService} from '../../../../core/services/attributes/ability.service';
import {LimitedUseType} from '../../../../shared/models/limited-use-type.enum';
import {BattleMonsterFeature} from '../../../../shared/models/creatures/battle-monster-feature';

@Component({
  selector: 'app-battle-monster-feature-details',
  templateUrl: './battle-monster-feature-details.component.html',
  styleUrls: ['./battle-monster-feature-details.component.scss']
})
export class BattleMonsterFeatureDetailsComponent implements OnInit {
  @Input() battleMonsterFeature: BattleMonsterFeature;
  @Input() feature: MonsterFeature;

  abilities: ListObject[] = [];
  isRecharge = false;

  constructor(
    private abilityService: AbilityService
  ) { }

  ngOnInit() {
    this.initializeAbilities();
    this.isRecharge = this.feature.limitedUse != null && this.feature.limitedUse.limitedUseType === LimitedUseType.RECHARGE;
  }

  private initializeAbilities(): void {
    this.abilities = [];
    this.abilityService.getAbilities().then().then((abilities: ListObject[]) => {
      this.abilities = abilities;
    });
  }

}
