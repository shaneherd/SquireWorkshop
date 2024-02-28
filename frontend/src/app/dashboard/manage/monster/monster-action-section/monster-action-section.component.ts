import {Component, Input, OnInit} from '@angular/core';
import {Monster, MonsterAction} from '../../../../shared/models/creatures/monsters/monster';
import * as _ from 'lodash';
import {MonsterService} from '../../../../core/services/creatures/monster.service';

@Component({
  selector: 'app-monster-action-section',
  templateUrl: './monster-action-section.component.html',
  styleUrls: ['./monster-action-section.component.scss']
})
export class MonsterActionSectionComponent implements OnInit {
  @Input() monster: Monster;
  @Input() editing = false;
  @Input() isPublic = false;
  @Input() isShared = false;

  actions: MonsterAction[] = [];
  disabled = false;
  viewingAction: MonsterAction = null;

  constructor(
    private monsterService: MonsterService
  ) { }

  ngOnInit() {
    this.initializeActions();
  }

  private initializeActions(): void {
    this.monsterService.getActions(this.monster.id).then((actions: MonsterAction[]) => {
      this.actions = actions;
    });
  }

  actionClick(action: MonsterAction): void {
    this.viewingAction = _.cloneDeep(action);
    this.updateClickDisabled();
  }

  addAction(): void {
    const newAction = new MonsterAction();
    newAction.author = true;
    this.viewingAction = newAction;
    this.updateClickDisabled();
  }

  closeAction(): void {
    this.viewingAction = null;
    this.updateClickDisabled();
  }

  saveAction(): void {
    this.viewingAction = null;
    this.updateClickDisabled();
    this.initializeActions();
  }

  private updateClickDisabled(): void {
    this.disabled = this.viewingAction != null;
  }

}
