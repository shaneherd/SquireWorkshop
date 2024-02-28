import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {Encounter, EncounterListObject, RoundTurn} from '../../shared/models/campaigns/encounters/encounter';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {HealthCalculationType} from '../../shared/models/creatures/characters/health-calculation-type.enum';
import {MonsterService} from './creatures/monster.service';
import {EncounterMonster} from '../../shared/models/campaigns/encounters/encounter-monster';
import {RollRequest} from '../../shared/models/rolls/roll-request';
import {RollType} from '../../shared/models/rolls/roll-type.enum';
import {DiceSize} from '../../shared/models/dice-size.enum';
import {Roll} from '../../shared/models/rolls/roll';
import {CreatureService} from './creatures/creature.service';
import {DiceService} from './dice.service';
import {CampaignCharacterType} from '../../shared/models/campaigns/campaign-character-type.enum';
import {EncounterDifficulty, EncounterSummary} from '../../dashboard/gm-mode/encounter-summary/encounter-summary.component';
import {CharacterLevelService} from './character-level.service';
import {Proficiency} from '../../shared/models/proficiency';
import {AbilityService} from './attributes/ability.service';
import {BattleCreatureResponse} from '../../shared/models/campaigns/encounters/battle-creature-response';
import {BattleCreature} from '../../shared/models/campaigns/encounters/battle-creature';
import {CreatureHealth} from '../../shared/models/creatures/creature-health';
import {EncounterCharacter} from '../../shared/models/campaigns/encounters/encounter-character';
import * as _ from 'lodash';
import {EncounterMonsterGroup} from '../../shared/models/campaigns/encounters/encounter-monster-group';
import {SpeedType} from '../../shared/models/speed-type.enum';
import {
  EncounterCharacterConfiguration,
  EncounterMonsterGroupConfiguration,
  InitiativeOrderObject,
  InitiativeSimpleObject
} from '../../shared/models/combat-row';

@Injectable({
  providedIn: 'root'
})
export class EncounterService {

  constructor(
    private http: HttpClient,
    private monsterService: MonsterService,
    private creatureService: CreatureService,
    private diceService: DiceService,
    private characterLevelService: CharacterLevelService,
    private abilityService: AbilityService
  ) { }

  getEncounter(id: string): Promise<Encounter> {
    return this.http.get<Encounter>(`${environment.backendUrl}/encounters/${id}`).toPromise();
  }

  getEncounters(campaignId: string): Promise<EncounterListObject[]> {
    return this.http.get<EncounterListObject[]>(`${environment.backendUrl}/campaigns/${campaignId}/encounters`).toPromise();
  }

  createEncounter(encounter: Encounter, campaignId: string): Promise<string> {
    const options = {
      responseType: 'text' as 'json'
    };
    return this.http.put<string>(`${environment.backendUrl}/campaigns/${campaignId}/encounters`, encounter, options).toPromise();
  }

  updateEncounter(encounter: Encounter): Promise<any> {
    return this.http.post<any>(`${environment.backendUrl}/encounters/${encounter.id}`, encounter).toPromise();
  }

  duplicateEncounter(encounterId: string, campaignId: string, name: string): Promise<string> {
    const body = new URLSearchParams();
    body.set('name', name);
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
      responseType: 'text' as 'json'
    };
    return this.http.post<any>(`${environment.backendUrl}/campaigns/${campaignId}/encounters/${encounterId}/duplicate`, body.toString(), options).toPromise();
  }

  deleteEncounter(id: string): Promise<any> {
    return this.http.delete<any>(`${environment.backendUrl}/encounters/${id}`).toPromise();
  }

  createBattleCreatures(encounterId: string): Promise<BattleCreatureResponse> {
    return this.http.post<BattleCreatureResponse>(`${environment.backendUrl}/encounters/${encounterId}/battleCreatures/missing`, {}).toPromise();
  }

  startEncounter(encounterId: string): Promise<any> {
    return this.http.post<any>(`${environment.backendUrl}/encounters/${encounterId}/start`, {}).toPromise();
  }

  continueEncounter(encounterId: string): Promise<any> {
    return this.http.post<any>(`${environment.backendUrl}/encounters/${encounterId}/continue`, {}).toPromise();
  }

  restartEncounter(encounterId: string): Promise<any> {
    return this.http.post<any>(`${environment.backendUrl}/encounters/${encounterId}/restart`, {}).toPromise();
  }

  finishEncounter(encounterId: string): Promise<any> {
    return this.http.post<any>(`${environment.backendUrl}/encounters/${encounterId}/finish`, {}).toPromise();
  }

  updateRoundTurn(encounterId: string, round: number, turn: number): Promise<any> {
    const roundTurn = new RoundTurn(round, turn);
    return this.http.post<any>(`${environment.backendUrl}/encounters/${encounterId}/turn`, roundTurn).toPromise();
  }

  getBattleCreatures(encounterId: string): Promise<BattleCreature[]> {
    return this.http.get<BattleCreature[]>(`${environment.backendUrl}/encounters/${encounterId}/battleCreatures`).toPromise();
  }

  updateHealth(creatureId: string, creatureHealth: CreatureHealth): Promise<any> {
    return this.http.post<any>(`${environment.backendUrl}/creatures/${creatureId}/health`, creatureHealth).toPromise();
  }

  removeGroup(encounterId: string, groupId: string): Promise<any> {
    return this.http.delete<any>(`${environment.backendUrl}/encounters/${encounterId}/groups/${groupId}`).toPromise();
  }

  removeCreature(encounterId: string, battleCreatureId: string): Promise<any> {
    return this.http.delete<any>(`${environment.backendUrl}/encounters/${encounterId}/battleCreatures/${battleCreatureId}`).toPromise();
  }

  updateBattleCreatureSpeedType(encounterId: string, battleCreatureId: string, speedType: SpeedType): Promise<any> {
    return this.http.post<any>(`${environment.backendUrl}/encounters/${encounterId}/battleCreatures/${battleCreatureId}/speed`, speedType).toPromise();
  }

  updateGroupSpeedType(encounterId: string, groupId: string, speedType: SpeedType): Promise<any> {
    return this.http.post<any>(`${environment.backendUrl}/encounters/${encounterId}/groups/${groupId}/speed`, speedType).toPromise();
  }

  updateHideKilled(encounterId: string, hideKilled: boolean): Promise<any> {
    return this.http.post<any>(`${environment.backendUrl}/encounters/${encounterId}/hideKilled`, hideKilled).toPromise();
  }

  /******************************* Calculate Campaign Character ******************************/

  initializeEncounterCharacterConfiguration(config: EncounterCharacterConfiguration): void {
    const level = this.characterLevelService.getLevelByExpInstant(config.encounterCharacter.character.characterExp);
    config.level = level == null ? 0 : parseInt(level.name, 10);
    config.profModifier = level.profBonus + config.encounterCharacter.character.profMisc;
    config.initModifier = this.getModifierValue(config.encounterCharacter.character.initiative, config.profModifier);
    config.perceptionModifier = this.getModifierValue(config.encounterCharacter.character.perception, config.profModifier);
    config.stealthModifier = this.getModifierValue(config.encounterCharacter.character.stealth, config.profModifier);
    config.passivePerception = config.perceptionModifier + 10;
    config.initModifierDisplay = this.abilityService.convertScoreToString(config.initModifier);
    config.stealthModifierDisplay = this.abilityService.convertScoreToString(config.stealthModifier);
    if (config.encounterCharacter.initiative !== 0) {
      config.initiativeTooltip = `${config.encounterCharacter.initiative - config.initModifier} + ${config.initModifier}`;
    }
  }

  private getModifierValue(proficiency: Proficiency, profModifier: number): number {
    const totalProfValue = this.creatureService.getProfModifierValue(profModifier, proficiency.proficient, proficiency);
    return totalProfValue + proficiency.miscModifier;
  }

  /******************************* Calculate Encounter Monster Group ******************************/

  initializeEncounterMonsterGroupConfiguration(config: EncounterMonsterGroupConfiguration, encounterStarted: boolean): void {
    config.calculatedInitiativeModifier = this.monsterService.getInitiativeModifier(config.group.monster);
    config.initiativeModifierDisplay = this.abilityService.convertScoreToString(config.calculatedInitiativeModifier);
    config.calculatedMaxHp = this.monsterService.getMaxHp(config.group.monster);
    config.calculatedAverageHp = this.monsterService.getAverageHp(config.group.monster);
    config.calculatedPassivePerception = this.monsterService.getPassivePerception(config.group.monster);
    config.calculatedStealth = this.monsterService.getStealthModifier(config.group.monster);
    config.calculatedStealthDisplay = this.abilityService.convertScoreToString(config.calculatedStealth);
    config.originalQuantity = encounterStarted ? config.group.monsters.length : 0;
  }

  /******************************************* Roll ******************************************/

  async rollEncounterGroup(config: EncounterMonsterGroupConfiguration, reRoll: boolean, local: boolean = false): Promise<any> {
    await this.rollEncounterGroupHp(config, reRoll, local);
    await this.rollEncounterGroupInitiative(config, reRoll, local);
  }

  async rollEncounterGroupStealth(config: EncounterMonsterGroupConfiguration, local: boolean = false): Promise<void> {
    for (const setup of config.group.monsters) {
      setup.stealthRoll = await this.monsterService.rollStealth(config.group.monster, setup.monsterNumber, local);
      const naturalRoll = this.diceService.getNaturalRoll(setup.stealthRoll);
      setup.stealthRollTooltip = `${naturalRoll} + ${setup.stealthRoll.totalResult - naturalRoll}`;
    }
  }

  private async rollEncounterGroupHp(config: EncounterMonsterGroupConfiguration, reRoll: boolean, local: boolean = false): Promise<any> {
    if (config.group.monsters.length === 0) {
      return Promise.resolve();
    }
    if (config.group.healthCalculationType !== HealthCalculationType.ROLL) {
      const hp = config.group.healthCalculationType === HealthCalculationType.AVERAGE ? config.calculatedAverageHp : config.calculatedMaxHp;
      config.group.monsters.forEach((setup: EncounterMonster) => {
        setup.hp = hp;
      });
      return Promise.resolve();
    }

    if (config.group.groupedHp) {
      if ((reRoll && config.originalQuantity === 0) || config.group.monsters[0].hp === 0) {
        const hp = await this.monsterService.rollHp(config.group.monster, 0, local);
        config.group.monsters.forEach((setup: EncounterMonster) => {
          setup.hp = hp;
        });
      } else {
        // ensure that all in the group have the same hp value set
        const hp = config.group.monsters[0].hp;
        config.group.monsters.forEach((setup: EncounterMonster) => {
          setup.hp = hp;
        });
      }
    } else {
      for (const setup of config.group.monsters) {
        if ((reRoll && setup.monsterNumber > config.originalQuantity) || setup.hp === 0) {
          setup.hp = await this.monsterService.rollHp(config.group.monster, setup.monsterNumber, local);
        }
      }
    }
  }

  private async rollEncounterGroupInitiative(config: EncounterMonsterGroupConfiguration, reRoll: boolean, local: boolean = false): Promise<any> {
    if (config.group.monsters.length === 0) {
      return Promise.resolve();
    }
    if (config.group.groupedInitiative) {
      if ((reRoll && config.originalQuantity === 0) || config.group.monsters[0].initiative === 0) {
        const init = await this.monsterService.rollInitiative(config.group.monster, 0, local);
        const tooltip = `${init - config.calculatedInitiativeModifier} + ${config.calculatedInitiativeModifier}`;
        config.group.monsters.forEach((setup: EncounterMonster) => {
          setup.initiative = init;
          setup.initiativeTooltip = tooltip;
        });
      } else {
        const init = config.group.monsters[0].initiative;
        const tooltip = config.group.monsters[0].initiativeTooltip;
        config.group.monsters.forEach((setup: EncounterMonster) => {
          setup.initiative = init;
          setup.initiativeTooltip = tooltip;
        });
      }
    } else {
      for (const setup of config.group.monsters) {
        if ((reRoll && setup.monsterNumber > config.originalQuantity) || setup.initiative === 0) {
          setup.initiative = await this.monsterService.rollInitiative(config.group.monster, setup.monsterNumber, local);
          setup.initiativeTooltip = `${setup.initiative - config.calculatedInitiativeModifier} + ${config.calculatedInitiativeModifier}`;
        }
      }
    }
  }

  async rollEncounterCharacterInitiative(character: EncounterCharacterConfiguration, reRoll: boolean, local: boolean = false): Promise<any> {
    if (reRoll || character.encounterCharacter.initiative === 0) {
      character.encounterCharacter.initiative = await this.rollInitiative(character, local);
      character.initiativeTooltip = `${character.encounterCharacter.initiative - character.initModifier} + ${character.initModifier}`;
    }
  }

  private rollInitiative(character: EncounterCharacterConfiguration, local: boolean = false): Promise<number> {
    if (local) {
      const roll = this.diceService.roll(this.getCharacterInitiativeRollRequest(character));
      return Promise.resolve(roll.totalResult);
    } else {
      return this.creatureService.roll(character.encounterCharacter.character.creatureId, this.getCharacterInitiativeRollRequest(character)).then((roll: Roll) => {
        return roll.totalResult;
      });
    }
  }

  private getCharacterInitiativeRollRequest(character: EncounterCharacterConfiguration): RollRequest {
    return this.diceService.getRollRequest(
      RollType.STANDARD,
      character.encounterCharacter.character.name + ' Initiative',
      DiceSize.TWENTY,
      character.initModifier,
      false,
      false,
      false
    );
  }

  async rollEncounterCharacterStealth(character: EncounterCharacterConfiguration, reRoll: boolean, local: boolean = false): Promise<void> {
    if (reRoll || character.stealthRoll == null || character.stealthRoll.totalResult === 0) {
      character.stealthRoll = await this.rollStealth(character, local);
      const naturalRoll = this.diceService.getNaturalRoll(character.stealthRoll);
      character.stealthRollTooltip = `${naturalRoll} + ${character.stealthRoll.totalResult - naturalRoll}`;
    }
  }

  private rollStealth(character: EncounterCharacterConfiguration, local: boolean = false): Promise<Roll> {
    if (local) {
      const roll = this.diceService.roll(this.getCharacterStealthRollRequest(character));
      return Promise.resolve(roll);
    } else {
      return this.creatureService.roll(character.encounterCharacter.character.creatureId, this.getCharacterStealthRollRequest(character));
    }
  }

  private getCharacterStealthRollRequest(character: EncounterCharacterConfiguration): RollRequest {
    return this.diceService.getRollRequest(
      RollType.STANDARD,
      character.encounterCharacter.character.name + ' Stealth',
      DiceSize.TWENTY,
      character.stealthModifier,
      false,
      false,
      false
    );
  }

  /******************************************* Initiative ******************************************/

  initialSortInitiative(list: InitiativeOrderObject[]): void {
    list.sort((left: InitiativeOrderObject, right: InitiativeOrderObject) => {
      return left.order - right.order;
    });
  }

  sortInitiative(initiativeOrder: InitiativeOrderObject[], natural20First: boolean): void {
    initiativeOrder.sort((left: InitiativeOrderObject, right: InitiativeOrderObject) => {
      if (natural20First) {
        const leftNatural20 = left.initiative - left.initiativeModifier === 20;
        const rightNatural20 = right.initiative - right.initiativeModifier === 20;

        if (leftNatural20 && !rightNatural20) {
          return -1;
        } else if (rightNatural20 && !leftNatural20) {
          return 1;
        }
      }
      let diff = right.initiative - left.initiative;
      if (diff === 0) {
        diff = right.initiativeModifier - left.initiativeModifier; // highest modifier goes first
        if (diff === 0) {
          //characters go first
          if (left.character != null && right.character == null) {
            return -1;
          } else if (left.character == null && right.character != null) {
            return 1;
          }

          if (left.character != null && right.character != null) {
            //both characters
            const leftType = left.character.encounterCharacter.character.campaignCharacterType;
            const rightType = right.character.encounterCharacter.character.campaignCharacterType;

            // characters go before npcs
            if (leftType === CampaignCharacterType.CHARACTER && rightType !== CampaignCharacterType.CHARACTER) {
              return -1;
            } else if (leftType !== CampaignCharacterType.CHARACTER && rightType === CampaignCharacterType.CHARACTER) {
              return 1;
            } else {
              const leftName = left.character.encounterCharacter.character.name;
              const rightName = right.character.encounterCharacter.character.name;
              return leftName.localeCompare(rightName);
            }
          } else if (left.group != null && right.group != null) {
            //both monsters
            //todo - sort by challenge rating?
            const leftGroupNumber = left.group.group.groupNumber;
            const rightGroupNumber = right.group.group.groupNumber;
            diff = leftGroupNumber - rightGroupNumber;
            if (diff === 0) {
              diff = left.group.group.monster.name.localeCompare(right.group.group.monster.name);

              if (diff === 0) {
                if (left.monster != null && right.monster == null) {
                  return -1;
                } else if (left.monster == null && right.monster != null) {
                  return 1;
                } else if (left.monster == null && right.monster == null) {
                  return 0;
                } else if (left.monster != null && right.monster != null) {
                  return left.monster.monsterNumber - right.monster.monsterNumber;
                }
              }
            }
          }
        }
      }
      return diff;
    });
  }

  getTrueInitiativeIndex(list: InitiativeOrderObject[], index: number): number {
    let count = 0;
    for (let i = 0; i < list.length; i++) {
      const init = list[i];
      if (count === index && init.display) {
        return i;
      }
      if (init.display) {
        count++;
      }
    }
    return -1;
  }

  getEncounterCharacters(characters: EncounterCharacterConfiguration[], includeDisabled: boolean = true): EncounterCharacter[] {
    const list = _.filter(characters, (character: EncounterCharacterConfiguration) => {
      return character.selected && (!character.disabled || includeDisabled);
    }).map(character => character.encounterCharacter);
    list.forEach((character: EncounterCharacter) => {
      character.removed = false;
    });
    return list;
  }

  getEncounterMonsterGroups(groups: EncounterMonsterGroupConfiguration[], includeDisabled: boolean = true): EncounterMonsterGroup[] {
    if (includeDisabled) {
      return groups.map(config => config.group);
    } else {
      return _.filter(groups, (group: EncounterMonsterGroupConfiguration) => {
        return !group.disabled;
      }).map(config => config.group);
    }
  }

  updateInitOrder(list: InitiativeOrderObject[]): void {
    list.forEach((order: InitiativeOrderObject, index: number) => {
      order.order = index;
      if (order.character != null) {
        order.character.encounterCharacter.order = index;
      } else if (order.group != null) {
        if (order.group.group.groupedInitiative) {
          order.group.group.order = index;
          order.group.group.monsters.forEach((encounterMonster: EncounterMonster) => {
            encounterMonster.order = index;
          });
        } else if (order.monster != null) {
          order.group.group.order = 0;
          order.monster.order = index;
        }
      }
    });
  }

  addToInitiative(init: InitiativeOrderObject, list: InitiativeOrderObject[], index: number): void {
    if (index === -1) {
      list.push(init);
    } else {
      list.splice(index, 0, init);
    }
  }

  addCharacterToInitiative(character: EncounterCharacterConfiguration, list: InitiativeOrderObject[]): void {
    const init = new InitiativeOrderObject();
    init.name = character.encounterCharacter.character.name;
    init.initiative = character.encounterCharacter.initiative;
    init.initiativeModifier = character.initModifier;
    init.initiativeModifierDisplay = character.initModifierDisplay;
    init.character = character;
    init.order = character.encounterCharacter.order;
    this.addToInitiative(init, list, -1);
  }

  addGroupToInitiative(config: EncounterMonsterGroupConfiguration, list: InitiativeOrderObject[], index: number): void {
    const group = config.group;
    const initiativeModifier = this.monsterService.getInitiativeModifier(group.monster);
    const initiativeModifierDisplay = this.abilityService.convertScoreToString(initiativeModifier);
    if (group.groupedInitiative) {
      const init = new InitiativeOrderObject();
      init.name = group.monster.name + ' (x' + group.quantity + ')';
      init.initiative = group.monsters.length > 0 ? group.monsters[0].initiative : 0;
      init.initiativeModifier = initiativeModifier;
      init.initiativeModifierDisplay = initiativeModifierDisplay;
      init.display = group.quantity > 0;
      init.group = config;
      init.order = group.monsters.length > 0 ? group.monsters[0].order : 0;
      this.addToInitiative(init, list, index);
    } else {
      group.monsters.forEach((encounterMonster: EncounterMonster) => {
        const init = new InitiativeOrderObject();
        init.name = group.monster.name + ' #' + encounterMonster.monsterNumber;
        init.initiative = encounterMonster.initiative;
        init.initiativeModifier = initiativeModifier;
        init.initiativeModifierDisplay = initiativeModifierDisplay;
        init.group = config;
        init.monster = encounterMonster;
        init.order = encounterMonster.order;
        this.addToInitiative(init, list, index);
      });
    }
  }

  getSimpleInitiativeList(encounter: Encounter): InitiativeSimpleObject[] {
    const initiativeOrder: InitiativeSimpleObject[] = [];
    encounter.encounterCharacters.forEach((encounterCharacter: EncounterCharacter) => {
      const init = new InitiativeSimpleObject();
      init.name = encounterCharacter.character.name;
      init.order = encounterCharacter.order;
      init.creatureCount = 1;
      init.roundAdded = encounterCharacter.roundAdded;
      initiativeOrder.push(init);
    });

    encounter.encounterMonsterGroups.forEach((group: EncounterMonsterGroup) => {
      if (group.groupedInitiative) {
        const init = new InitiativeSimpleObject();
        init.name = group.monster.name + ' (x' + group.quantity + ')';
        init.order = group.order;
        init.creatureCount = group.monsters.length;
        init.roundAdded = this.getGroupRoundAdded(group);
        initiativeOrder.push(init);
      } else {
        group.monsters.forEach((encounterMonster: EncounterMonster) => {
          const init = new InitiativeSimpleObject();
          init.name = group.monster.name + ' #' + encounterMonster.monsterNumber;
          init.order = encounterMonster.order;
          init.creatureCount = 1;
          init.roundAdded = encounterMonster.roundAdded;
          initiativeOrder.push(init);
        })
      }
    });

    initiativeOrder.sort((left: InitiativeSimpleObject, right: InitiativeSimpleObject) => {
      return left.order - right.order;
    });
    return initiativeOrder;
  }

  private getGroupRoundAdded(group: EncounterMonsterGroup): number {
    if (group.monsters.length > 0) {
      return group.monsters[0].roundAdded;
    }
    return 1;
  }

  updateCurrentTurn(list: InitiativeOrderObject[], currentTurn: number): void {
    let temp = 1;
    for (let i = 0; i < list.length; i++) {
      const current = list[i];
      if (temp === currentTurn && this.validForTurn(current)) {
        current.currentTurn = true;
        break;
      }
      if (current.character != null) {
        temp++; // only 1 character
      } else if (current.monster != null) {
        temp++; // only 1 monster
      } else if (current.group != null) {
        // turn increases by the number of monsters in the group
        temp += current.group.group.monsters.length;
      }
    }
  }

  private validForTurn(init: InitiativeOrderObject): boolean {
    if (init.character != null) {
      return true;
    } else if (init.monster != null) {
      return true;
    } else if (init.group != null) {
      return init.group.group.monsters.length > 0;
    }
    return false;
  }

  /******************************************* Summary ******************************************/

  getEncounterSummary(characters: EncounterCharacterConfiguration[], groups: EncounterMonsterGroupConfiguration[]): EncounterSummary {
    const summary = new EncounterSummary();
    summary.totalCr = 0;
    summary.totalExp = 0;
    groups.forEach((config: EncounterMonsterGroupConfiguration) => {
      const cr = this.monsterService.convertChallengeRatingToNumber(config.group.monster.challengeRating);
      const exp = config.group.monster.experience;
      summary.totalCr += (config.group.quantity * cr);
      summary.totalExp += (config.group.quantity * exp);
    });

    const partyCount = this.getPartyCount(characters);
    if (partyCount > 0) {
      summary.expPerPlayer = Math.floor(summary.totalExp / partyCount);
    } else {
      summary.expPerPlayer = 0;
    }

    const monsterCount = this.getMonsterCount(groups);
    summary.partyThreshold = this.getPartyExpThreshold(characters);
    const multiplier = this.getExpMultiplier(monsterCount, partyCount);
    summary.adjustedExp = summary.totalExp * multiplier;
    if (partyCount > 0) {
      summary.adjustedExpPerPlayer = Math.floor(summary.adjustedExp / partyCount);
    } else {
      summary.adjustedExpPerPlayer = 0;
    }

    if (summary.partyThreshold[3] < summary.adjustedExp) {
      summary.difficulty = EncounterDifficulty.DEADLY;
    } else if (summary.partyThreshold[2] < summary.adjustedExp) {
      summary.difficulty = EncounterDifficulty.HARD;
    } else if (summary.partyThreshold[1] < summary.adjustedExp) {
      summary.difficulty = EncounterDifficulty.MEDIUM;
    } else {
      summary.difficulty = EncounterDifficulty.EASY;
    }

    return summary;
  }

  private getPartyCount(characters: EncounterCharacterConfiguration[]): number {
    let partyCount = 0;
    characters.forEach((character: EncounterCharacterConfiguration) => {
      if (character.selected) {
        partyCount++;
      }
    });
    return partyCount;
  }

  private getMonsterCount(groups: EncounterMonsterGroupConfiguration[]): number {
    let monsterCount = 0;
    groups.forEach((config: EncounterMonsterGroupConfiguration) => {
      monsterCount += config.group.monsters.length;
    });
    return monsterCount;
  }

  private getPartyExpThreshold(characters: EncounterCharacterConfiguration[]): number[] {
    const totalThreshold = [0, 0, 0, 0];
    characters.forEach((character: EncounterCharacterConfiguration) => {
      if (character.selected) {
        const current = this.getCharacterExpThreshold(character);
        totalThreshold[0] += current[0];
        totalThreshold[1] += current[1];
        totalThreshold[2] += current[2];
        totalThreshold[3] += current[3];
      }
    });
    return totalThreshold;
  }

  private getCharacterExpThreshold(character: EncounterCharacterConfiguration): number[] {
    switch (character.level) {
      case 1:
        return [25, 50, 75, 100];
      case 2:
        return [50, 100, 150, 200];
      case 3:
        return [75, 150, 225, 400];
      case 4:
        return [125, 250, 375, 500];
      case 5:
        return [250, 500, 750, 1100];
      case 6:
        return [300, 600, 900, 1400];
      case 7:
        return [350, 750, 1100, 1700];
      case 8:
        return [450, 900, 1400, 2100];
      case 9:
        return [550, 1100, 1600, 2400];
      case 10:
        return [600, 1200, 1900, 2800];
      case 11:
        return [800, 1600, 2400, 3600];
      case 12:
        return [1000, 2000, 3000, 4500];
      case 13:
        return [1100, 2200, 3400, 5100];
      case 14:
        return [1250, 2500, 3800, 5700];
      case 15:
        return [1400, 2800, 4300, 6400];
      case 16:
        return [1600, 3200, 4800, 7200];
      case 17:
        return [2000, 3900, 5900, 8800];
      case 18:
        return [2100, 4200, 6300, 9500];
      case 19:
        return [2400, 4900, 7300, 10900];
      case 20:
        return [2800, 5700, 8500, 12700];
      default:
        return [0, 0, 0, 0];
    }
  }

  private getExpMultiplier(monsterCount: number, partyCount: number): number {
    if (monsterCount <= 0) {
      return 0;
    }
    const multipliers = [0.5, 1, 1.5, 2, 2.5, 3, 4, 5];
    let index = 0;
    if (monsterCount <= 1) {
      index = 1;
    } else if (monsterCount === 2) {
      index = 2;
    } else if (monsterCount <= 6) {
      index = 3;
    } else if (monsterCount <= 10) {
      index = 4;
    } else if (monsterCount <= 14) {
      index = 5;
    } else if (monsterCount > 15) {
      index = 6;
    }

    if (partyCount < 3) {
      index++;
      if (index > 7) {
        index = 7;
      }
    } else if (partyCount > 5) {
      index--;
      if (index < 0) {
        index = 0;
      }
    }

    return multipliers[index];
  }
}
