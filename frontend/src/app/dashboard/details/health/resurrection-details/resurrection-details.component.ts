import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PlayerCharacter} from '../../../../shared/models/creatures/characters/player-character';
import {CreatureConfigurationCollection} from '../../../../shared/models/creatures/configs/creature-configuration-collection';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {TranslateService} from '@ngx-translate/core';
import * as _ from 'lodash';
import {CharacterService} from '../../../../core/services/creatures/character.service';
import {CreatureService} from '../../../../core/services/creatures/creature.service';
import {CreatureState} from '../../../../shared/models/creatures/creature-state.enum';
import {EVENTS, SID} from '../../../../constants';
import {EventsService} from '../../../../core/services/events.service';
import {CreatureConditions} from '../../../../shared/models/creatures/creature-conditions';
import {ActiveCondition} from '../../../../shared/models/creatures/active-condition';
import {ListObject} from '../../../../shared/models/list-object';
import {ConditionService} from '../../../../core/services/attributes/condition.service';

@Component({
  selector: 'app-resurrection-details',
  templateUrl: './resurrection-details.component.html',
  styleUrls: ['./resurrection-details.component.scss']
})
export class ResurrectionDetailsComponent implements OnInit {
  @Input() playerCharacter: PlayerCharacter;
  @Input() collection: CreatureConfigurationCollection;
  @Output() resurrect = new EventEmitter();
  @Output() close = new EventEmitter();

  returnWith1Hp = true;
  applyPenalties = true;
  resurrectionMessage = '';
  activeConditions: ListObject[] = [];

  constructor(
    private translate: TranslateService,
    private eventsService: EventsService,
    private characterService: CharacterService,
    private creatureService: CreatureService,
    private conditionService: ConditionService
  ) { }

  ngOnInit() {
    const genderPossessive = this.translate.instant('Gender.Possessive.' + this.playerCharacter.characteristics.gender);
    this.resurrectionMessage = this.translate.instant('Messages.Resurrection', {
      characterName: this.playerCharacter.name,
      genderPossessive: genderPossessive
    });
  }

  closeDetails(): void {
    this.close.emit();
  }

  resurrectClick(): void {
    const creatureHealth = _.cloneDeep(this.playerCharacter.creatureHealth);
    creatureHealth.currentHp = this.returnWith1Hp ? 1 : this.characterService.getMaxHP(this.playerCharacter, this.collection);
    creatureHealth.resurrectionPenalty = this.applyPenalties ? 4 : 0;
    creatureHealth.creatureState = CreatureState.CONSCIOUS;
    creatureHealth.numDeathSaveThrowSuccesses = 0;
    creatureHealth.numDeathSaveThrowFailures = 0;

    const promises = [];

    //update health
    promises.push(this.creatureService.updateCreatureHealth(this.playerCharacter, creatureHealth).then(() => {
      this.playerCharacter.creatureHealth = creatureHealth;
    }));

    //update conditions
    this.initializeActiveConditions();
    this.removeCondition(SID.CONDITIONS.UNCONSCIOUS);
    if (!this.playerCharacter.characterSettings.health.removeProneOnRevive) {
      this.addCondition(SID.CONDITIONS.PRONE);
    }

    const creatureConditions = new CreatureConditions();
    creatureConditions.activeConditions = this.activeConditions;
    promises.push(this.creatureService.updateConditions(this.playerCharacter.id, creatureConditions).then((activeConditions: ActiveCondition[]) => {
      this.playerCharacter.activeConditions = activeConditions;
    }));

    const self = this;
    Promise.all(promises).then(function () {
      self.eventsService.dispatchEvent(EVENTS.HpUpdated);
      self.resurrect.emit();
    });
  }

  private initializeActiveConditions(): void {
    const conditions: ListObject[] = [];
    this.playerCharacter.activeConditions.forEach((activeCondition: ActiveCondition) => {
      if (!activeCondition.inherited) {
        conditions.push(activeCondition.condition);
      }
    });
    this.activeConditions = conditions;
  }

  private addCondition(conditionSID: number): void {
    const index = this.getActiveConditionIndex(conditionSID);
    if (index === -1) {
      const condition = this.conditionService.getConditionBySID(conditionSID);
      const immune = this.creatureService.isConditionImmune(condition, this.playerCharacter);
      if (!immune) {
        this.activeConditions.push(condition);
      }
    }
  }

  private removeCondition(conditionSID: number): void {
    const index = this.getActiveConditionIndex(conditionSID);
    if (index > -1) {
      this.activeConditions.splice(index, 1);
    }
  }

  private getActiveConditionIndex(conditionSID: number): number {
    for (let i = 0; i < this.activeConditions.length; i++) {
      if (this.activeConditions[i].sid === conditionSID) {
        return i;
      }
    }
    return -1;
  }

  returnWith1Change(event: MatCheckboxChange): void {
    this.returnWith1Hp = event.checked;
  }

  applyPenaltiesChange(event: MatCheckboxChange): void {
    this.applyPenalties = event.checked;
  }

}
