import {Component, Input, OnInit} from '@angular/core';
import {RollResult} from '../../../../shared/models/rolls/roll-result';
import {DamageType} from '../../../../shared/models/attributes/damage-type';
import {DiceResult} from '../../../../shared/models/rolls/dice-result';
import {DamageRollGroup} from '../../../../shared/models/rolls/damage-roll-group';

@Component({
  selector: 'app-damage-roll-result',
  templateUrl: './damage-roll-result.component.html',
  styleUrls: ['./damage-roll-result.component.scss']
})
export class DamageRollResultComponent implements OnInit {
  @Input() rollResult: RollResult;
  @Input() healing = false;
  @Input() showDetails = false;
  @Input() half = false;

  groups: DamageRollGroup[] = [];
  total = 0;

  constructor() { }

  ngOnInit() {
    this.initializeGroups();
  }

  private initializeGroups(): void {
    this.groups = [];

    let total = 0;

    this.rollResult.results.forEach((diceResult: DiceResult) => {
      let group = this.getGroup(diceResult.damageType);
      if (group == null) {
        group = new DamageRollGroup();
        group.damageType = diceResult.damageType;
        this.groups.push(group);
      }
      group.results.push(diceResult);
      group.totalResult += (this.half ? Math.floor(diceResult.totalResult / 2) : diceResult.totalResult);
      total += group.totalResult;
    });

    if (this.half) {
      this.total = total;
    } else {
      this.total = this.rollResult.totalResult;
    }
  }

  private getGroup(damageType: DamageType): DamageRollGroup {
    for (let i = 0; i < this.groups.length; i++) {
      const group = this.groups[i];
      if (group.damageType.id === damageType.id) {
        return group;
      }
    }
    return null;
  }

}
