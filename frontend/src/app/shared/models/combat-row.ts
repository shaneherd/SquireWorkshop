import {BattleCreature} from './campaigns/encounters/battle-creature';
import {CreatureConfigurationCollection} from './creatures/configs/creature-configuration-collection';
import {SpeedType} from './speed-type.enum';
import {CreatureState} from './creatures/creature-state.enum';
import {EncounterCreatureType} from './campaigns/encounters/encounter-creature-type.enum';
import {BattleMonster} from './creatures/battle-monsters/battle-monster';
import * as _ from 'lodash';
import {EncounterCharacter} from './campaigns/encounters/encounter-character';
import {Roll} from './rolls/roll';
import {EncounterMonsterGroup} from './campaigns/encounters/encounter-monster-group';
import {EncounterMonster} from './campaigns/encounters/encounter-monster';

export class CombatRow {
  id = '';
  ac = 0;
  speed = 0;
  speedType: SpeedType = SpeedType.WALK;
  currentHp = 0;
  maxHp = 0;
  displayName = '';
  combatCreatureDisplayName = '';
  selectedCreature: CombatCreature = null;
  labelRow = false;
  nextRow: CombatRow;
  previousRow: CombatRow;

  round = 0;
  turn = 0;
  selected = false;
  display = true;
  combatCreatures: CombatCreature[] = [];
  grouped = false;
  monster = false;

  // statuses
  someSurprised = false;
  someOngoingDamage = false;
  someConditions = false;
  someConcentrating = false;
  someDying = false;
  dead = false;

  // init20 = false;
  // init1 = false;

  updateStatuses(): void {
    //todo
    if (this.labelRow) {
      return;
    }
    const validCreatures = this.getValidCreatures();
    this.updateIsDead(validCreatures);
    this.updateSomeDying(validCreatures);
    this.updateSomeSurprised(validCreatures);
    this.updateSomeOngoingDamage(validCreatures);
    this.updateSomeConditions(validCreatures);
    this.updateSomeConcentrating(validCreatures);
  }

  updateSelectedCreature(combatCreature: CombatCreature): void {
    this.combatCreatureDisplayName = combatCreature.getDisplayName();
    this.selectedCreature = combatCreature;
  }

  setSelected(selected: boolean): void {
    this.selected = selected;
    if (selected && this.combatCreatures.length > 0) {
      const first = this.getFirstVisibleCombatCreature();
      if (first != null) {
        first.setSelected(true);
      }
    } else {
      this.combatCreatures.forEach((combatCreature: CombatCreature) => {
        combatCreature.setSelected(false);
      });
    }
  }

  private getFirstVisibleCombatCreature(): CombatCreature {
    for (let i = 0; i < this.combatCreatures.length; i++) {
      const combatCreature = this.combatCreatures[i];
      if (combatCreature.display && !combatCreature.isRemoved()) {
        return combatCreature;
      }
    }
    return null;
  }

  isRemoved(): boolean {
    if (this.labelRow) {
      return false;
    }
    for (let i = 0; i < this.combatCreatures.length; i++) {
      const combatCreature = this.combatCreatures[i];
      if (combatCreature.display && !combatCreature.isRemoved()) {
        return false;
      }
    }
    return true;
  }

  getMinimumRoundAdded(): number {
    if (this.labelRow) {
      return 0;
    }
    let min: number = null;
    for (let i = 0; i < this.combatCreatures.length; i++) {
      const round = this.combatCreatures[i].getRoundAdded();
      if (min == null || round < min) {
        min = round;
      }
    }
    return min;
  }

  updateAll(): void {
    if (this.labelRow) {
      return;
    }
    this.updateRoundTurn();
    this.updateId();
    this.updateCurrentHp();
    this.updateMaxHp();
    this.updateStatuses();
    this.updateDisplayName();
    this.updateAC();
    this.updateSpeed();
    this.grouped = this.combatCreatures.length > 0 && this.combatCreatures[0].battleCreature.groupedInitiative;
    this.monster = this.combatCreatures.length > 0 && this.combatCreatures[0].isMonster();
  }

  updateId(): void {
    if (this.combatCreatures.length > 0) {
      this.id = this.combatCreatures[0].id;
    }
  }

  updateCurrentHp(): void {
    if (this.labelRow) {
      return;
    }
    this.currentHp = 0;
    this.getValidCreatures().forEach((combatCreature: CombatCreature) => {
      this.currentHp += combatCreature.currentHp;
    });
  }

  updateMaxHp(): void {
    if (this.labelRow) {
      return;
    }
    this.maxHp = 0;
    this.getValidCreatures().forEach((combatCreature: CombatCreature) => {
      // if (combatCreature.display) { // todo - should this be checked? also what about combatCreature.isRemoved()?
      this.maxHp += combatCreature.maxHp;
      // }
    });
  }

  updateDefaultSelected(): void {
    const firstRow = this.getFirstVisibleCombatCreature();
    if (firstRow != null) {
      firstRow.setSelected(true);
    }
  }

  updateRoundTurn(): void {
    if (this.labelRow) {
      return;
    }
    this.round = this.getMinimumRound();
    this.turn = this.getMinimumTurn();
  }

  private getMinimumRound(): number {
    let min: number = null;
    for (let i = 0; i < this.combatCreatures.length; i++) {
      const round = this.combatCreatures[i].round;
      if (min == null || round < min) {
        min = round;
      }
    }
    return min;
  }

  private getMinimumTurn(): number {
    let min: number = null;
    for (let i = 0; i < this.combatCreatures.length; i++) {
      const turn = this.combatCreatures[i].turn;
      if (min == null || turn < min) {
        min = turn;
      }
    }
    return min;
  }

  updateDisplayName(): void {
    if (this.labelRow) {
      return;
    }
    if (this.combatCreatures.length === 1) {
      this.displayName = this.combatCreatures[0].getDisplayName();
    } else {
      const count = this.getDisplayedCount(false); // todo - should this just use combatCreatures.count?
      const battleMonster = this.combatCreatures[0].battleCreature.creature as BattleMonster;
      const monsterName = battleMonster.monster.name;
      this.displayName = monsterName + ' (x' + count + ')';
    }
  }

  getDisplayedCount(visibleOnly: boolean): number {
    if (this.labelRow) {
      return 0;
    }
    if (visibleOnly) {
      let count = 0;
      this.getValidCreatures().forEach((combatCreature: CombatCreature) => {
        if (combatCreature.display && !combatCreature.isRemoved()) {
          count++;
        }
      });
      return count;
    } else {
      return this.getValidCreatures().length;
    }
  }

  getValidCreatures(): CombatCreature[] {
    return _.filter(this.combatCreatures, (combatCreature: CombatCreature) => {
      return combatCreature.getRoundAdded() <= this.round;
    });
  }

  updateIsDead(validCreatures: CombatCreature[] = null): void {
    if (validCreatures == null) {
      validCreatures = this.getValidCreatures();
    }
    for (let i = 0; i < validCreatures.length; i++) {
      const combatCreature = validCreatures[i];
      if (combatCreature.display && !combatCreature.dead) {
        this.dead = false;
        return;
      }
    }
    this.dead = true;
  }

  updateSomeDying(validCreatures: CombatCreature[] = null): void {
    if (validCreatures == null) {
      validCreatures = this.getValidCreatures();
    }
    for (let i = 0; i < validCreatures.length; i++) {
      const combatCreature = validCreatures[i];
      if (combatCreature.display && combatCreature.dying) {
        this.someDying = true;
        return;
      }
    }
    this.someDying = false;
  }

  updateSomeSurprised(validCreatures: CombatCreature[] = null): void {
    if (validCreatures == null) {
      validCreatures = this.getValidCreatures();
    }
    for (let i = 0; i < validCreatures.length; i++) {
      const combatCreature = validCreatures[i];
      if (combatCreature.display && combatCreature.surprised) {
        this.someSurprised = true;
        return;
      }
    }
    this.someSurprised = false;
  }

  updateSomeOngoingDamage(validCreatures: CombatCreature[] = null): void {
    if (validCreatures == null) {
      validCreatures = this.getValidCreatures();
    }
    for (let i = 0; i < validCreatures.length; i++) {
      const combatCreature = validCreatures[i];
      if (combatCreature.display && combatCreature.ongoingDamage) {
        this.someOngoingDamage = true;
        return;
      }
    }
    this.someOngoingDamage = false;
  }

  updateSomeConditions(validCreatures: CombatCreature[] = null): void {
    if (validCreatures == null) {
      validCreatures = this.getValidCreatures();
    }
    for (let i = 0; i < validCreatures.length; i++) {
      const combatCreature = validCreatures[i];
      if (combatCreature.display && combatCreature.conditions) {
        this.someConditions = true;
        return;
      }
    }
    this.someConditions = false;
  }

  updateSomeConcentrating(validCreatures: CombatCreature[] = null): void {
    if (validCreatures == null) {
      validCreatures = this.getValidCreatures();
    }
    for (let i = 0; i < validCreatures.length; i++) {
      const combatCreature = validCreatures[i];
      if (combatCreature.display && combatCreature.concentrating) {
        this.someConcentrating = true;
        return;
      }
    }
    this.someConcentrating = false;
  }

  updateAC(): void {
    if (this.labelRow) {
      return;
    }
    const firstRow = this.getFirstVisibleCombatCreature();
    if (firstRow != null) {
      this.ac = firstRow.ac;
    }
  }

  updateSpeed(): void {
    if (this.labelRow) {
      return;
    }
    const firstRow = this.getFirstVisibleCombatCreature();
    if (firstRow != null) {
      this.speed = firstRow.speed;
      this.speedType = firstRow.speedType;
    }
  }

  setRound(round: number): void {
    this.round = round;
    if (!this.labelRow) {
      this.combatCreatures.forEach((combatCreature: CombatCreature) => {
        combatCreature.setRound(round);
      });
      this.updateSomeSurprised();
    }
  }

  getSelectedCombatCreature(): CombatCreature {
    let selectedCreature = _.find(this.combatCreatures, (combatCreature: CombatCreature) => { return combatCreature.selected; });
    if (selectedCreature == null && this.combatCreatures.length === 1) {
      selectedCreature = this.combatCreatures[0];
    }
    return selectedCreature;
  }
}

export class CombatCreature {
  id = '';
  battleCreature: BattleCreature;
  collection: CreatureConfigurationCollection;
  ac = 0;
  speed = 0;
  speedType: SpeedType = SpeedType.WALK;
  currentHp = 0;
  maxHp = 0;
  round = 1;
  turn = 1;
  display = true;
  combatRow: CombatRow;
  selected = false;

  // statuses
  surprised = false;
  ongoingDamage = false;
  conditions = false;
  concentrating = false;
  dying = false;
  dead = false;

  constructor(battleCreature: BattleCreature, round: number, turn: number) {
    this.battleCreature = battleCreature;
    this.id = battleCreature.id;
    this.currentHp = battleCreature.creature.creatureHealth.currentHp + battleCreature.creature.creatureHealth.tempHp;
    this.round = round;
    this.turn = turn;
    this.initializeStatuses();
  }

  initializeStatuses(): void {
    this.dead = this.battleCreature.creature.creatureHealth.creatureState === CreatureState.DEAD;
    this.dying = this.battleCreature.creature.creatureHealth.creatureState === CreatureState.UNSTABLE;
    this.surprised = this.battleCreature.surprised && this.round === 1;

    // this.ongoingDamage = true;
    // this.conditions = true;
    // this.concentrating = true;
  }

  isRemoved(): boolean {
    return this.battleCreature.removed || false; //default to false if undefined
  }

  getRoundAdded(): number {
    return this.battleCreature.roundAdded;
  }

  isMonster(): boolean {
    return this.battleCreature.encounterCreatureType === EncounterCreatureType.MONSTER;
  }

  updateCurrentHp(): void {
    this.currentHp = this.battleCreature.creature.creatureHealth.currentHp + this.battleCreature.creature.creatureHealth.tempHp;
    this.dead = this.battleCreature.creature.creatureHealth.creatureState === CreatureState.DEAD;
    this.dying = this.battleCreature.creature.creatureHealth.creatureState === CreatureState.UNSTABLE;
    if (this.combatRow != null) {
      this.combatRow.updateCurrentHp();
      this.combatRow.updateIsDead();
      this.combatRow.updateSomeDying();
    }
  }

  getDisplayName(): string {
    return this.battleCreature.creature.name;
  }

  setSelected(selected: boolean): void {
    this.selected = selected;
    if (selected && this.combatRow != null) {
      this.combatRow.updateSelectedCreature(this);
      this.combatRow.ac = this.ac;
      this.combatRow.speed = this.speed;
      this.combatRow.speedType = this.speedType;
    }
  }

  setRound(round: number): void {
    this.round = round;
    this.surprised = this.battleCreature.surprised && this.round === 1;
  }

  setOngoingDamage(ongoingDamage: boolean): void {
    this.ongoingDamage = ongoingDamage;
    if (this.combatRow != null) {
      if (this.ongoingDamage) {
        this.combatRow.someOngoingDamage = true;
      } else {
        this.combatRow.updateSomeOngoingDamage();
      }
    }
  }

  setConditions(conditions: boolean): void {
    this.conditions = conditions;
    if (this.combatRow != null) {
      if (this.conditions) {
        this.combatRow.someConditions = true;
      } else {
        this.combatRow.updateSomeConditions();
      }
    }
  }

  setConcentrating(concentrating: boolean): void {
    this.concentrating = concentrating;
    if (this.combatRow != null) {
      if (this.concentrating) {
        this.combatRow.someConcentrating = true;
      } else {
        this.combatRow.updateSomeConcentrating();
      }
    }
  }

  setAC(ac: number): void {
    this.ac = ac;
    if (this.selected) {
      this.combatRow.ac = ac;
    }
  }

  setSpeed(speed: number): void {
    this.speed = speed;
    if (this.selected) {
      this.combatRow.speed = speed;
    }
  }

  setSpeedType(speedType: SpeedType): void {
    this.speedType = speedType;
    if (this.selected) {
      this.combatRow.speedType = speedType;
    }
  }
}

export class EncounterCharacterConfiguration {
  encounterCharacter: EncounterCharacter;
  disabled = false;
  selected = true;
  initModifier = 0;
  initiativeTooltip = '';
  initModifierDisplay = '+0';
  level = 0;
  profModifier = 0;
  stealthModifier = 0;
  stealthModifierDisplay = '+0';
  stealthRoll: Roll = new Roll();
  stealthRollTooltip = '';
  perceptionModifier = 0;
  passivePerception = 10;
}

export class EncounterMonsterGroupConfiguration {
  group: EncounterMonsterGroup;
  disabled = false;
  calculatedInitiativeModifier = 0;
  initiativeModifierDisplay = '+0';
  calculatedMaxHp = 0;
  calculatedAverageHp = 0;
  calculatedPassivePerception = 0;
  calculatedStealth = 0;
  calculatedStealthDisplay = '+0';
  calculatedStealthRollDisplay = '';
  calculatedSurprised = false;
  calculatedSomeSurprised = false;
  originalQuantity = 0;

  constructor(group: EncounterMonsterGroup) {
    this.group = group;
  }
}

export class InitiativeOrderObject {
  name = '';
  initiative = 0;
  initiativeModifier = 0;
  initiativeModifierDisplay = '+0';
  character: EncounterCharacterConfiguration;
  group: EncounterMonsterGroupConfiguration;
  monster: EncounterMonster;
  order = 0;
  display = true;
  currentTurn = false;
}

export class InitiativeSimpleObject {
  name = '';
  order = 0;
  creatureCount = 0;
  roundAdded = 1;
}
