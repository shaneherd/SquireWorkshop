import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MenuItem} from '../../../../shared/models/menuItem.model';
import {Monster, MonsterAction, MonsterFeature} from '../../../../shared/models/creatures/monsters/monster';
import {MonsterService} from '../../../../core/services/creatures/monster.service';

@Component({
  selector: 'app-add-remove-monster',
  templateUrl: './add-remove-monster.component.html',
  styleUrls: ['./add-remove-monster.component.scss']
})
export class AddRemoveMonsterComponent implements OnInit {
  @Input() monster: MenuItem;
  @Output() save = new EventEmitter();
  @Output() cancel = new EventEmitter();

  loading = true;
  viewingMonster: Monster = null;
  monsterActions: MonsterAction[] = [];
  monsterFeatures: MonsterFeature[] = [];

  constructor(
    private monsterService: MonsterService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.monsterService.getMonster(this.monster.id).then((monster: Monster) => {
      this.viewingMonster = monster;
      this.loading = false;
    });
  }

  close(): void {
    this.cancel.emit();
  }

  continue(): void {
    this.save.emit(this.monster);
  }
}
