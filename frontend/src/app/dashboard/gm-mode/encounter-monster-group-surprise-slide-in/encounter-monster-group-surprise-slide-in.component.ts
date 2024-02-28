import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {EncounterMonster} from '../../../shared/models/campaigns/encounters/encounter-monster';
import * as _ from 'lodash';
import {EncounterService} from '../../../core/services/encounter.service';
import {
  ENCOUNTER_MONSTER_USE_LOCAL_ROLL
} from '../encounter-configure-slide-in/encounter-configure-slide-in.component';
import {EncounterMonsterGroupConfiguration} from '../../../shared/models/combat-row';

@Component({
  selector: 'app-encounter-monster-group-surprise-slide-in',
  templateUrl: './encounter-monster-group-surprise-slide-in.component.html',
  styleUrls: ['./encounter-monster-group-surprise-slide-in.component.scss']
})
export class EncounterMonsterGroupSurpriseSlideInComponent implements OnInit {
  @Input() group: EncounterMonsterGroupConfiguration;
  @Output() cancel = new EventEmitter();
  @Output() continue = new EventEmitter();

  loading = false;
  editingGroup: EncounterMonsterGroupConfiguration = null;

  constructor(
    private encounterService: EncounterService
  ) { }

  ngOnInit() {
    this.editingGroup = _.cloneDeep(this.group);
  }

  cancelClick(): void {
    this.cancel.emit();
  }

  rollClick(): void {
    if (!this.group.disabled) {
      this.encounterService.rollEncounterGroupStealth(this.editingGroup, ENCOUNTER_MONSTER_USE_LOCAL_ROLL);
    }
  }

  continueClick(): void {
    if (this.group.disabled) {
      return;
    }
    let surpriseCount = 0;
    this.group.group.monsters.forEach((encounterMonster: EncounterMonster, index: number) => {
      const editingMonster = this.editingGroup.group.monsters[index];
      encounterMonster.surprised = editingMonster.surprised;
      if (encounterMonster.surprised) {
        surpriseCount++;
      }
      encounterMonster.stealthRoll = editingMonster.stealthRoll;
    });
    this.group.calculatedSurprised = surpriseCount === this.group.group.monsters.length;
    this.group.calculatedSomeSurprised = surpriseCount > 0 && surpriseCount !== this.group.group.monsters.length;
    this.continue.emit();
  }

  surpriseChange(event: MatCheckboxChange, encounterMonster: EncounterMonster): void {
    if (!this.group.disabled) {
      encounterMonster.surprised = event.checked;
    }
  }

  stealthChange(input, encounterMonster: EncounterMonster): void {
    if (!this.group.disabled) {
      encounterMonster.stealthRoll.totalResult = parseInt(input.value, 10);
      const modifier = this.editingGroup.calculatedStealth;
      encounterMonster.stealthRollTooltip = `${encounterMonster.stealthRoll.totalResult - modifier} + ${modifier}`;
    }
  }
}
