import {Component, Input, OnInit} from '@angular/core';
import {BattleMonster} from '../../../../shared/models/creatures/battle-monsters/battle-monster';
import {CreatureConfigurationCollection} from '../../../../shared/models/creatures/configs/creature-configuration-collection';

@Component({
  selector: 'app-battle-monster-characteristics',
  templateUrl: './battle-monster-characteristics.component.html',
  styleUrls: ['./battle-monster-characteristics.component.scss']
})
export class BattleMonsterCharacteristicsComponent implements OnInit {
  @Input() battleMonster: BattleMonster;
  @Input() collection: CreatureConfigurationCollection;
  @Input() columnIndex: number;

  constructor() { }

  ngOnInit() {
  }

}
