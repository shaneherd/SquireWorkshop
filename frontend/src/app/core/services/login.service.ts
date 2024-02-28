import { Injectable } from '@angular/core';
import {CharacterLevelService} from './character-level.service';
import {ConditionService} from './attributes/condition.service';
import {AbilityService} from './attributes/ability.service';
import {CostUnitService} from './items/cost-unit.service';
import {EquipmentSlotService} from './items/equipment-slot.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private characterLevelService: CharacterLevelService,
    private conditionService: ConditionService,
    private abilityService: AbilityService,
    private costUnitService: CostUnitService,
    private equipmentSlotService: EquipmentSlotService
  ) { }

  initializeDetails(): Promise<any> {
    const promises = [];
    promises.push(this.characterLevelService.initializeLevelsDetailed());
    promises.push(this.conditionService.initializeConditions());
    promises.push(this.abilityService.initializeAbilitiesDetailed());
    promises.push(this.costUnitService.initializeCostUnitsDetailed());
    promises.push(this.equipmentSlotService.initializeEquipmentSlotsDetailed());
    return Promise.all(promises);
  }
}
