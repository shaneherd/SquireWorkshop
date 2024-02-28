import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {BattleMonster} from '../../../../shared/models/creatures/battle-monsters/battle-monster';
import {MonsterService} from '../../../../core/services/creatures/monster.service';

@Component({
  selector: 'app-battle-monster-legendary-points-slide-in',
  templateUrl: './battle-monster-legendary-points-slide-in.component.html',
  styleUrls: ['./battle-monster-legendary-points-slide-in.component.scss']
})
export class BattleMonsterLegendaryPointsSlideInComponent implements OnInit {
  @Input() battleMonster: BattleMonster;
  @Output() save = new EventEmitter();
  @Output() close = new EventEmitter();

  legendaryPoints = 0;

  constructor(
    private monsterService: MonsterService
  ) { }

  ngOnInit() {
    this.legendaryPoints = this.battleMonster.legendaryPoints;
  }

  saveClick(): void {
    this.monsterService.updateLegendaryPoints(this.battleMonster, this.legendaryPoints).then(() => {
      this.battleMonster.legendaryPoints = this.legendaryPoints;
      this.save.emit();
    });
  }

  closeClick(): void {
    this.close.emit();
  }

  resetClick(): void {
    this.monsterService.resetLegendaryPoints(this.battleMonster).then(() => {
      this.save.emit();
    });
  }
}
