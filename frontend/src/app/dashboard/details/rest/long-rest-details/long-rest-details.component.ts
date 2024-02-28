import {Component, EventEmitter, Input, Output} from '@angular/core';
import {PlayerCharacter} from '../../../../shared/models/creatures/characters/player-character';
import {CreatureConfigurationCollection} from '../../../../shared/models/creatures/configs/creature-configuration-collection';
import {CreatureHitDiceModification} from '../../../../shared/models/creatures/creature-hit-dice-modification';
import {CreatureHitDice} from '../../../../shared/models/creatures/creature-hit-dice';
import {CharacterService} from '../../../../core/services/creatures/character.service';
import * as _ from 'lodash';
import {CreatureService} from '../../../../core/services/creatures/creature.service';
import {CreatureState} from '../../../../shared/models/creatures/creature-state.enum';
import {EVENTS} from '../../../../constants';
import {EventsService} from '../../../../core/services/events.service';
import {HitDiceService} from '../../../../core/services/hit-dice.service';
import {CreaturePower} from '../../../../shared/models/creatures/creature-power';
import {CreatureItemService} from '../../../../core/services/creatures/creature-item.service';
import {CreatureItem} from '../../../../shared/models/creatures/creature-item';
import {ItemType} from '../../../../shared/models/items/item-type.enum';
import {MagicalItem} from '../../../../shared/models/items/magical-item';

@Component({
  selector: 'app-long-rest-details',
  templateUrl: './long-rest-details.component.html',
  styleUrls: ['./long-rest-details.component.scss']
})
export class LongRestDetailsComponent {
  @Input() playerCharacter: PlayerCharacter;
  @Input() collection: CreatureConfigurationCollection;
  @Output() save = new EventEmitter();
  @Output() close = new EventEmitter();

  constructor(
    private creatureService: CreatureService,
    private creatureItemService: CreatureItemService,
    private characterService: CharacterService,
    private eventsService: EventsService,
    private hitDiceService: HitDiceService
  ) { }

  closeDetails(): void {
    this.close.emit();
  }

  restClick(): void {
    const creatureHealth = _.cloneDeep(this.playerCharacter.creatureHealth);
    creatureHealth.currentHp = this.characterService.getMaxHP(this.playerCharacter, this.collection);
    creatureHealth.tempHp = 0;
    creatureHealth.creatureHitDice = this.getUpdatedHitDice();
    creatureHealth.numDeathSaveThrowFailures = 0;
    creatureHealth.numDeathSaveThrowSuccesses = 0;
    creatureHealth.creatureState = CreatureState.CONSCIOUS;
    creatureHealth.exhaustionLevel -= 1;
    if (creatureHealth.exhaustionLevel < 0) {
      creatureHealth.exhaustionLevel = 0;
    }
    creatureHealth.resurrectionPenalty -= 1;
    if (creatureHealth.resurrectionPenalty < 0) {
      creatureHealth.resurrectionPenalty = 0;
    }

    const promises = [];
    const powers: CreaturePower[] = this.getPowersToReset();
    if (powers.length > 0) {
      promises.push(this.characterService.resetPowerLimitedUses(powers, this.playerCharacter, this.collection, false, false, true));
    }
    const rechargeableItems = this.getRechargeableItems();
    if (rechargeableItems.length > 0) {
      promises.push(this.creatureItemService.rechargeItems(rechargeableItems, this.playerCharacter).then(() => {
        self.eventsService.dispatchEvent(EVENTS.FetchItemsList);
      }));
    }
    promises.push(this.creatureService.updateCreatureHealth(this.playerCharacter, creatureHealth));
    promises.push(this.creatureService.resetSpellSlots(this.playerCharacter, this.collection));

    const self = this;
    Promise.all(promises).then(function () {
      self.playerCharacter.creatureHealth = creatureHealth;
      self.eventsService.dispatchEvent(EVENTS.HpUpdated);
      self.save.emit();
    });
  }

  private getRechargeableItems(): CreatureItem[] {
    const items: CreatureItem[] = [];
    const flatList = this.creatureItemService.getFlatItemList(this.playerCharacter.items);
    flatList.forEach((creatureItem: CreatureItem) => {
      if (creatureItem.item.itemType === ItemType.MAGICAL_ITEM) {
        const magicalItem = creatureItem.item as MagicalItem;
        if (magicalItem.hasCharges && magicalItem.rechargeable && magicalItem.rechargeOnLongRest) {
          items.push(_.cloneDeep(creatureItem));
        }
      }
    });
    return items;
  }

  private getPowersToReset(): CreaturePower[] {
    let powers: CreaturePower[] = this.getRechargeablePowers(this.playerCharacter.creatureFeatures.features);
    powers = powers.concat(this.getRechargeablePowers(this.playerCharacter.creatureSpellCasting.spells));
    return powers;
  }

  private getRechargeablePowers(creaturePowers: CreaturePower[]): CreaturePower[] {
    const rechargeablePowers: CreaturePower[] = [];
    creaturePowers.forEach((creaturePower: CreaturePower) => {
      if (creaturePower.rechargeOnShortRest || creaturePower.rechargeOnLongRest) {
        rechargeablePowers.push(creaturePower);
      }
    });
    return rechargeablePowers;
  }

  private getUpdatedHitDice(): CreatureHitDice[] {
    const hitDiceModifications = this.hitDiceService.getHitDice(this.playerCharacter, this.collection, false);
    this.hitDiceService.autoRegainHitDice(hitDiceModifications);

    const hitDice: CreatureHitDice[] = [];
    hitDiceModifications.forEach((creatureHitDiceModification: CreatureHitDiceModification) => {
      const hitDie = new CreatureHitDice();
      hitDie.diceSize = creatureHitDiceModification.diceSize;
      hitDie.remaining = creatureHitDiceModification.remaining;
      hitDice.push(hitDie);
    });
    return hitDice;
  }

}
