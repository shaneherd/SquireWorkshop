import {Injectable} from '@angular/core';
import {AttributeService} from './attribute.service';
import {ListObject} from '../../../shared/models/list-object';
import {Ability} from '../../../shared/models/attributes/ability.model';
import {LOCAL_STORAGE} from '../../../constants';
import {AttributeType} from '../../../shared/models/attributes/attribute-type.enum';
import {HttpClient} from '@angular/common/http';
import {CreatureListModifierValue} from '../../../shared/models/creatures/creature-list-modifier-value';
import {CreatureAbilityProficiency} from '../../../shared/models/creatures/configs/creature-ability-proficiency';
import {ModifierService} from '../modifier.service';
import * as _ from 'lodash';
import {environment} from '../../../../environments/environment';
import {ListSource} from '../../../shared/models/list-source.enum';

@Injectable({
  providedIn: 'root'
})
export class AbilityService {
  private abilities: ListObject[] = [];
  private abilitiesDetailed: Ability[] = [];

  constructor(
    private attributeService: AttributeService,
    private modifierService: ModifierService,
    private http: HttpClient
  ) {
  }

  getAbilities(listSource: ListSource = ListSource.MY_STUFF): Promise<ListObject[]> {
    if (this.abilities.length > 0) {
      return Promise.resolve(this.abilities);
    }
    return this.attributeService.getAbilities(listSource).then((abilities: ListObject[]) => {
      this.abilities = abilities;
      return abilities;
    });
  }

  initializeAbilitiesDetailed(): Promise<Ability[]> {
    const listSource = ListSource.MY_STUFF;
    return this.http.get<Ability[]>(`${environment.backendUrl}/attributes/type/${AttributeType.ABILITY}/detailed?source=${listSource}`)
      .toPromise().then((abilities: Ability[]) => {
        abilities.forEach((ability: Ability) => {
          ability.type = 'Ability';
        });
        localStorage.setItem(LOCAL_STORAGE.ABILITIES, JSON.stringify(abilities));
        return abilities;
      });
  }

  getAbilitiesDetailedFromStorage(): Ability[] {
    let abilities: Ability[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE.ABILITIES));
    if (abilities == null) {
      abilities = [];
    }
    return abilities;
  }

  getAbilitiesDetailedFromStorageAsListObject(): ListObject[] {
    const abilities = this.getAbilitiesDetailedFromStorage();
    const list: ListObject[] = [];
    abilities.forEach((ability: Ability) => {
      list.push(new ListObject(ability.id, ability.name, ability.sid));
    });
    return list;
  }

  getAbilityByName(name: string): Ability {
    const abilities = this.getAbilitiesDetailedFromStorage();
    return _.find(abilities, function(ability) { return ability.name === name });
  }

  getAbilityById(id: string): Ability {
    const abilities = this.getAbilitiesDetailedFromStorage();
    return _.find(abilities, function(ability) { return ability.id === id });
  }

  getAbilitiesDetailed(): Promise<Ability[]> {
    const abilitiesDetailed = this.getAbilitiesDetailedFromStorage();
    if (abilitiesDetailed != null && abilitiesDetailed.length > 0) {
      return Promise.resolve(abilitiesDetailed);
    }
    return this.initializeAbilitiesDetailed();
  }

  getAbilityBySid(sid: number): Ability {
    const abilities = this.getAbilitiesDetailedFromStorage();
    for (let i = 0; i < abilities.length; i++) {
      const ability = abilities[i];
      if (ability.sid === sid) {
        return ability;
      }
    }
    return null;
  }

  /******************************************** Score Utilities *****************************************************/

  updateBaseScore(ability: CreatureAbilityProficiency, value: number): void {
    if (ability.abilityScore != null) {
      ability.abilityScore.value = value;
    }
  }

  getMiscModifier(ability: CreatureAbilityProficiency): number {
    if (ability.abilityScore != null) {
      return ability.abilityScore.miscModifier
    }
    return 0;
  }

  getASI(ability: CreatureAbilityProficiency): number {
    if (ability.abilityScore != null) {
      return ability.abilityScore.asiModifier;
    }
    return 0;
  }

  updateMiscModifier(ability: CreatureAbilityProficiency, value: number): void {
    if (ability.abilityScore != null) {
      ability.abilityScore.miscModifier = value;
    }
  }

  getAbilityScoreIncreaseModifier(ability: CreatureAbilityProficiency): number {
    if (ability == null) {
      return 0;
    }
    const increased = ability.abilityProficiency != null && ability.abilityProficiency.proficient;
    return increased ? 1 : 0;
  }

  getInheritedAbilityModifier(ability: CreatureAbilityProficiency): number {
    let total = 0;
    if (ability.abilityModifier != null) {
      ability.abilityModifier.inheritedValues.forEach((inheritedValue: CreatureListModifierValue) => {
        total += inheritedValue.value;
      });
    }
    return total;
  }

//  getProfModifier(ability: CreatureAbilityProficiency, profValue: number): number {
//    if (ability.abilityProficiency != null) {
//      if (ability.abilityProficiency.proficient || ability.abilityProficiency.inheritedFrom.length > 0) {
//        return profValue;
//      }
//    }
//    return 0;
//  }

  /************************** Saves ********************************/

  getSaveMiscModifier(ability: CreatureAbilityProficiency) {
    if (ability.saveProficiency != null) {
      return ability.saveProficiency.proficiency.miscModifier;
    }
    return 0;
  }

  getSaveInheritedModifier(ability: CreatureAbilityProficiency): number {
    let total = 0;
    if (ability.saveModifier != null) {
      ability.saveModifier.inheritedValues.forEach((inheritedValue: CreatureListModifierValue) => {
        total += inheritedValue.value;
      });
    }
    return total;
  }

  /***************************** Misc ***************************/

  getAbilityModifier(score: number): number {
    const value = (score - 10) / 2.0;
    return Math.floor(value);
  }

  getAbilityModifierAsString(score: number): string {
    const modifier = this.getAbilityModifier(score);
    return this.convertScoreToString(modifier);
  }

  getScoreAndModifier(score: number): string {
    const modifier = this.getAbilityModifierAsString(score);
    return score + ' (' + modifier + ')'
  }

  convertScoreToString(score: number): string {
    if (score >= 0) {
      return '+' + score;
    } else {
      return '-' + (score * -1);
    }
  }
}
