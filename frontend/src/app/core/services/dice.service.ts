import {Injectable} from '@angular/core';
import {DiceSize} from '../../shared/models/dice-size.enum';
import {CharacterClass} from '../../shared/models/characteristics/character-class';
import {RollRequest} from '../../shared/models/rolls/roll-request';
import {RollType} from '../../shared/models/rolls/roll-type.enum';
import {RollRequestDiceCollection} from '../../shared/models/rolls/roll-request-dice-collection';
import {DamageConfiguration} from '../../shared/models/damage-configuration';
import {DiceResult} from '../../shared/models/rolls/dice-result';
import {Roll} from '../../shared/models/rolls/roll';
import {DiceCollection} from '../../shared/models/characteristics/dice-collection';
import {RollResult} from '../../shared/models/rolls/roll-result';
import {AttackDamageRollRequest} from '../../shared/models/rolls/attack-damage-roll-request';

@Injectable({
  providedIn: 'root'
})
export class DiceService {

  constructor() {
  }

  getDiceSizeValue(diceSize: DiceSize): number {
    switch (diceSize) {
      case DiceSize.ONE:
        return 1;
      case DiceSize.TWO:
        return 2;
      case DiceSize.THREE:
        return 3;
      case DiceSize.FOUR:
        return 4;
      case DiceSize.SIX:
        return 6;
      case DiceSize.EIGHT:
        return 8;
      case DiceSize.TEN:
        return 10;
      case DiceSize.TWELVE:
        return 12;
      case DiceSize.TWENTY:
        return 20;
      case DiceSize.HUNDRED:
        return 100;
    }
    return 1;
  }

  getDiceSizeByValue(value: number): DiceSize {
    switch (value) {
      case 1:
        return DiceSize.ONE;
      case 2:
        return DiceSize.TWO;
      case 3:
        return DiceSize.THREE;
      case 4:
        return DiceSize.FOUR;
      case 6:
        return DiceSize.SIX;
      case 8:
        return DiceSize.EIGHT;
      case 10:
        return DiceSize.TEN;
      case 12:
        return DiceSize.TWELVE;
      case 20:
        return DiceSize.TWENTY;
      case 100:
        return DiceSize.HUNDRED;
    }
    return DiceSize.ONE;
  }

  getMaxResult(numDice: number, diceSize: DiceSize): number {
    return numDice * this.getDiceSizeValue(diceSize);
  }

  getClassNumHpGainDice(characterClass: CharacterClass): number {
    if (characterClass == null) {
      return 0;
    }
    let total = 0;
    if (characterClass.parent != null) {
      total = this.getClassNumHpGainDice(characterClass.parent as CharacterClass);
    }
    total += characterClass.hpGain.numDice;
    return total;
  }

  getDiceSize(characterClass: CharacterClass): DiceSize {
    if (characterClass == null) {
      return DiceSize.ONE;
    }
    return characterClass.hitDice.diceSize;
  }

  getTotalRoll(rolls: number[]): number {
    let total = 0;
    rolls.forEach((roll: number) => {
      total += roll;
    });
    return total;
  }

  getRolls(numDice: number, diceSize: DiceSize): number[] {
    const results: number[] = [];
    for (let i = 0; i < numDice; i++) {
      results.push(this.getRandomRoll(diceSize));
    }
    return results;
  }

  private getRandomRoll(diceSize: DiceSize): number {
    const max = this.getDiceSizeValue(diceSize);
    const min = 1;
    return Math.floor(Math.random() * (max - min)) + min;
  }

  getStandardRollRequest(reason: string, modifier: number, advantage = false, disadvantage = false): RollRequest {
    return this.getRollRequest(RollType.STANDARD, reason, DiceSize.TWENTY, modifier, false, advantage, disadvantage);
  }

  getAttackRollRequest(reason: string, modifier: number, halfOnMiss = false, advantage = false, disadvantage = false): RollRequest {
    return this.getRollRequest(RollType.ATTACK, reason, DiceSize.TWENTY, modifier, halfOnMiss, advantage, disadvantage);
  }

  getSaveRollRequest(reason: string, modifier: number, halfOnSave = false): RollRequest {
    const rollRequest: RollRequest = new RollRequest();
    rollRequest.rollType = RollType.SAVE;
    rollRequest.reason = reason;
    rollRequest.halfOnMiss = halfOnSave;
    const diceCollections: RollRequestDiceCollection[] = [];
    const collection = new RollRequestDiceCollection();
    collection.modifier = modifier;
    collection.diceSize = DiceSize.TWENTY;
    diceCollections.push(collection);
    rollRequest.diceCollections = diceCollections;
    return rollRequest;
  }

  getHealRollRequest(reason: string): RollRequest {
    const rollRequest: RollRequest = new RollRequest();
    rollRequest.rollType = RollType.HEAL;
    rollRequest.reason = reason;
    const diceCollections: RollRequestDiceCollection[] = [];
    const collection = new RollRequestDiceCollection();
    collection.diceSize = DiceSize.TWENTY;
    diceCollections.push(collection);
    rollRequest.diceCollections = diceCollections;
    return rollRequest;
  }

  getDiceRollRequest(diceCollection: DiceCollection, reason: string, includeModifier = true): RollRequest {
    const rollRequest: RollRequest = new RollRequest();
    rollRequest.rollType = RollType.STANDARD;
    rollRequest.reason = reason;
    rollRequest.halfOnMiss = false;
    rollRequest.advantage = false;
    rollRequest.disadvantage = false;
    const diceCollections: RollRequestDiceCollection[] = [];
    const collection = new RollRequestDiceCollection();
    collection.numDice = diceCollection.numDice;
    collection.diceSize = diceCollection.diceSize;
    collection.modifier = includeModifier ? diceCollection.miscModifier : 0;
    diceCollections.push(collection);
    rollRequest.diceCollections = diceCollections;
    return rollRequest;
  }

  getRollRequest(rollType: RollType, reason: string, diceSize: DiceSize, modifier: number, halfOnMiss: boolean, advantage: boolean, disadvantage: boolean): RollRequest {
    const rollRequest: RollRequest = new RollRequest();
    rollRequest.rollType = rollType;
    rollRequest.reason = reason;
    rollRequest.halfOnMiss = halfOnMiss;
    rollRequest.advantage = advantage;
    rollRequest.disadvantage = disadvantage;
    const diceCollections: RollRequestDiceCollection[] = [];
    const collection = new RollRequestDiceCollection();
    collection.numDice = 1;
    collection.diceSize = diceSize;
    collection.modifier = modifier;
    diceCollections.push(collection);
    rollRequest.diceCollections = diceCollections;
    return rollRequest;
  }

  getDamageRollRequest(reason: string, damages: DamageConfiguration[]): RollRequest {
    if (damages.length === 0) {
      return null;
    }

    const rollRequest: RollRequest = new RollRequest();
    rollRequest.rollType = RollType.DAMAGE;
    rollRequest.reason = reason;
    const diceCollections: RollRequestDiceCollection[] = [];

    damages.forEach((damage: DamageConfiguration) => {
      const collection = new RollRequestDiceCollection();
      collection.numDice = damage.values.numDice;
      collection.diceSize = damage.values.diceSize;
      collection.modifier = damage.values.miscModifier;
      collection.damageType = damage.damageType;
      diceCollections.push(collection);
    });
    rollRequest.diceCollections = diceCollections;
    return rollRequest;
  }

  getDiceDisplay(diceResult: DiceResult, healing: boolean): string {
    let display = diceResult.results.length.toString(10) + 'd';
    display += this.getDiceSizeValue(diceResult.diceSize);

    if (diceResult.results.length === 0) {
      display = diceResult.modifier.toString(10);
    } else if (diceResult.modifier !== 0) {
      display += ' + ' + diceResult.modifier;
    }
    if (!healing && diceResult.damageType != null) {
      display += ' ' + diceResult.damageType.name;
    }
    return display;
  }

  getDiceValue(diceResult: DiceResult): string {
    const parts = [];
    diceResult.results.forEach((result: number) => {
      parts.push(result);
    });
    if (parts.length === 0) {
      return diceResult.modifier + ' = ' + diceResult.totalResult;
    } else if (diceResult.modifier !== 0) {
      const diceRolls = '(' + parts.join(' + ') + ')';
      return diceRolls + ' + ' + diceResult.modifier + ' = ' + diceResult.totalResult;
    } else {
      return parts.join(' + ') + ' = ' + diceResult.totalResult;
    }
  }

  getNaturalRoll(roll: Roll): number {
    if (roll.results.length > 1) {
      const total1 = roll.results[0].results[0].results[0];
      const total2 = roll.results[1].results[0].results[0];
      if (roll.advantage) {
        return Math.max(total1, total2);
      } else if (roll.disadvantage) {
        return Math.min(total1, total2);
      }
    } else {
      if (roll.results.length > 0) {
        return roll.results[0].results[0].results[0];
      } else {
        return 0;
      }
    }
  }

  /************************* Roll Local *************************/

  rollAttackDamage(rollRequest: AttackDamageRollRequest): Roll {
    if (rollRequest.attack != null) {
      const attackRoll = this.roll(rollRequest.attack);
      const damageRoll = this.rollDamage(rollRequest.damage, attackRoll.critical);
      if (damageRoll != null) {
        attackRoll.childrenRolls.push(damageRoll);
      }
      return attackRoll;
    } else {
      return this.rollDamage(rollRequest.damage, false);
    }
  }

  roll(rollRequest: RollRequest): Roll {
    const rollResults: RollResult[] = [];
    rollResults.push(this.getRollResult(rollRequest.diceCollections));
    if ((rollRequest.rollType === RollType.STANDARD || rollRequest.rollType === RollType.ATTACK) && (rollRequest.advantage || rollRequest.disadvantage) && !(rollRequest.advantage && rollRequest.disadvantage)) {
      rollResults.push(this.getRollResult(rollRequest.diceCollections));
    }

    const roll = new Roll();
    roll.rollType = rollRequest.rollType;
    roll.reason = rollRequest.reason;
    roll.halfOnMiss = rollRequest.halfOnMiss;
    roll.advantage = rollRequest.advantage;
    roll.disadvantage = rollRequest.disadvantage;
    roll.results = rollResults;
    roll.totalResult = this.getRollTotalResult(roll);
    roll.critical = this.isRollCritical(roll);
    return roll;
  }

  getRollTotalResult(roll: Roll): number {
    let total = 0;
    if (roll.results != null && roll.results.length > 0) {
      const roll1 = roll.results[0].totalResult;
      if (roll.results.length > 1 && (roll.advantage || roll.disadvantage) && !(roll.advantage && roll.disadvantage)) {
        const roll2 = roll.results[1].totalResult;
        if (roll.advantage) {
          total = Math.max(roll1, roll2);
        } else {
          total = Math.min(roll1, roll2);
        }
      } else {
        total = roll1;
      }
    }

    return total;
  }

  isRollCritical(roll: Roll): boolean {
    if (roll.advantage || roll.disadvantage) {
      if (roll.results.length > 1) {
        const total = roll.totalResult;
        if (roll.results[0].totalResult === total) {
          return roll.results[0].results[0].critical;
        } else {
          return roll.results[1].results[0].critical;
        }
      } else {
        return roll.results[0].results[0].critical;
      }
    } else {
      return roll.results[0].results[0].critical;
    }
  }

  rollDamage(rollRequest: RollRequest, critical: boolean): Roll {
    if (rollRequest == null) {
      return null;
    }
    const rollResults: RollResult[] = [];
    rollResults.push(this.getDamageRollResult(rollRequest.diceCollections, critical));

    const roll = new Roll();
    roll.rollType = rollRequest.rollType;
    roll.reason = rollRequest.reason;
    roll.halfOnMiss = rollRequest.halfOnMiss;
    roll.advantage = rollRequest.advantage;
    roll.disadvantage = rollRequest.disadvantage;
    roll.results = rollResults;
    roll.totalResult = this.getRollTotalResult(roll);
    roll.critical = this.isRollCritical(roll);

    return roll;
  }

  getRollResult(collections: RollRequestDiceCollection[]): RollResult {
    const results: DiceResult[] = [];
    collections.forEach((collection: RollRequestDiceCollection) => {
      const diceResult = new DiceResult();
      diceResult.diceSize = collection.diceSize;
      diceResult.damageType = collection.damageType;
      diceResult.modifier = collection.modifier;
      diceResult.results = this.rollCollection(collection, false)
      diceResult.totalResult = this.getDiceTotalResult(diceResult);
      diceResult.critical = this.isDiceResultCritical(diceResult);
      results.push(diceResult);
    });

    const result = new RollResult();
    result.results = results;
    result.totalResult = this.getRollResultTotalResult(result);
    return result;
  }

  getDamageRollResult(collections: RollRequestDiceCollection[], critical: boolean): RollResult {
    const results: DiceResult[] = [];
    collections.forEach((collection: RollRequestDiceCollection) => {
      const diceResult = new DiceResult();
      diceResult.diceSize = collection.diceSize;
      diceResult.damageType = collection.damageType;
      diceResult.modifier = collection.modifier;
      diceResult.results = this.rollCollection(collection, critical)
      diceResult.totalResult = this.getDiceTotalResult(diceResult);
      diceResult.critical = this.isDiceResultCritical(diceResult);
      results.push(diceResult);
    });

    const result = new RollResult();
    result.results = results;
    result.totalResult = this.getRollResultTotalResult(result);
    return result;
  }

  getDiceTotalResult(diceResult: DiceResult): number {
    let total = diceResult.modifier;
    diceResult.results.forEach((result: number) => {
      total += result;
    });
    return total;
  }

  getRollResultTotalResult(rollResult: RollResult): number {
    let total = 0;
    rollResult.results.forEach((result: DiceResult) => {
      total += result.totalResult;
    });
    return total;
  }

  isDiceResultCritical(diceResult: DiceResult): boolean {
    const total = diceResult.totalResult;
    const modifier = diceResult.modifier;
    const naturalRoll = total - modifier;
    return naturalRoll === 20;
  }

  private rollCollection(collection: RollRequestDiceCollection, doubleDice: boolean): number[] {
    const rolls: number[] = [];
    for (let i = 0; i < collection.numDice; i++) {
      rolls.push(this.rollDie(collection.diceSize, collection.max))
    }
    if (doubleDice) {
      for (let i = 0; i < collection.numDice; i++) {
        rolls.push(this.rollDie(collection.diceSize, collection.max))
      }
    }
    return rolls;
  }

  private rollDie(diceSize: DiceSize, maxOverride: number): number {
    if (diceSize === DiceSize.ONE) {
      return 1;
    }
    const min = 1;
    const max = diceSize == null ? maxOverride : this.getDiceSizeValue(diceSize);

    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}
