import { Injectable } from '@angular/core';
import {DiceSize} from '../../shared/models/dice-size.enum';
import {CreatureHitDiceModification} from '../../shared/models/creatures/creature-hit-dice-modification';
import {CreatureHitDice} from '../../shared/models/creatures/creature-hit-dice';
import {HitDiceConfiguration} from '../../dashboard/details/health/health-configuration-details/health-configuration-details.component';
import {PlayerCharacter} from '../../shared/models/creatures/characters/player-character';
import {CharacterService} from './creatures/character.service';
import {CreatureConfigurationCollection} from '../../shared/models/creatures/configs/creature-configuration-collection';

@Injectable({
  providedIn: 'root'
})
export class HitDiceService {

  constructor(
    private characterService: CharacterService
  ) { }

  getHitDice(playerCharacter: PlayerCharacter, collection: CreatureConfigurationCollection, sortAscending = true): CreatureHitDiceModification[] {
    const map: Map<DiceSize, Map<string, number>> = this.characterService.getMaxHitDiceMapped(playerCharacter, collection);
    const hitDice = [];
    map.forEach((value: Map<string, number>, diceSize: DiceSize) => {
      const hitDie = new CreatureHitDiceModification();
      hitDie.diceSize = diceSize;
      hitDie.max = 0;

      const tooltipParts: string[] = [];
      value.forEach((max: number, characteristicId: string) => {
        hitDie.max += max;
        tooltipParts.push(this.getClassName(playerCharacter, characteristicId) + ': ' + max);
      });
      hitDie.maxTooltip = tooltipParts.join('\n');
      hitDice.push(hitDie);
    });

    hitDice.sort((left: CreatureHitDiceModification, right: CreatureHitDiceModification) => {
      if (sortAscending) {
        return this.getDiceSizeIndex(left.diceSize) - this.getDiceSizeIndex(right.diceSize);
      } else {
        //sort descending
        return this.getDiceSizeIndex(right.diceSize) - this.getDiceSizeIndex(left.diceSize);
      }
    });

    playerCharacter.creatureHealth.creatureHitDice.forEach((creatureHitDice: CreatureHitDice) => {
      const hitDie = this.getHitDie(creatureHitDice.diceSize, hitDice);
      if (hitDie != null) {
        hitDie.remaining = creatureHitDice.remaining;
      }
    });

    return hitDice;
  }

  private getDiceSizeIndex(diceSize: DiceSize): number {
    let index = 0;
    for (const currentDiceSize of Object.keys(DiceSize)) {
      if (DiceSize.hasOwnProperty(currentDiceSize)) {
        if (currentDiceSize === diceSize) {
          return index;
        }
      }

      index++;
    }
    return -1;
  }

  private getClassName(playerCharacter: PlayerCharacter, characteristicId: string): string {
    for (let i = 0; i < playerCharacter.classes.length; i++) {
      const chosenClass = playerCharacter.classes[i];
      if (chosenClass.characterClass.id === characteristicId) {
        return chosenClass.characterClass.name;
      }
      if (chosenClass.subclass != null && chosenClass.subclass.id === characteristicId) {
        return chosenClass.subclass.name;
      }
    }
    return '';
  }

  private getHitDie(diceSize: DiceSize, hitDice: CreatureHitDiceModification[]): CreatureHitDiceModification {
    for (let i = 0; i < hitDice.length; i++) {
      const hitDie = hitDice[i];
      if (hitDie.diceSize === diceSize) {
        return hitDie;
      }
    }
    return null;
  }

  private getPointsAvailable(hitDice: CreatureHitDiceModification[]): number {
    let totalMaxHitDice = 0;
    hitDice.forEach((hitDie: HitDiceConfiguration) => {
      totalMaxHitDice += hitDie.max;
    });

    let pointsAvailable = Math.floor(totalMaxHitDice / 2);
    if (pointsAvailable < 1) {
      pointsAvailable = 1;
    }

    return pointsAvailable;
  }

  autoRegainHitDice(hitDice: CreatureHitDiceModification[]): void {
    let pointsRemaining = this.getPointsAvailable(hitDice);
    hitDice.forEach((hitDie: HitDiceConfiguration) => {
      const missing = hitDie.max - hitDie.remaining;
      if (missing > 0 && pointsRemaining > 0) {
        if (missing > pointsRemaining) {
          hitDie.remaining += pointsRemaining;
          pointsRemaining = 0;
        } else {
          hitDie.remaining = hitDie.max;
          pointsRemaining -= missing;
        }
      }
    });
  }
}
