import {Injectable} from '@angular/core';
import {CreatureItem} from '../../../shared/models/creatures/creature-item';
import {Item} from '../../../shared/models/items/item';
import {ButtonActionGroup} from '../../../shared/models/button/button-action-group';
import {CreatureItemActionGroup} from '../../../shared/models/creatures/creature-item-action-group.enum';
import {CreatureItemAction} from '../../../shared/models/creatures/creature-item-action.enum';
import {ItemButtonAction} from '../../../shared/models/button/item-button-action';
import {ItemType} from '../../../shared/models/items/item-type.enum';
import {EquipmentSlotType} from '../../../shared/models/items/equipment-slot-type.enum';
import {TranslateService} from '@ngx-translate/core';
import {ListObject} from '../../../shared/models/list-object';
import {Creature} from '../../../shared/models/creatures/creature';
import {CreatureItemActionRequest} from '../../../shared/models/creatures/creature-item-action-request';
import {SID} from '../../../constants';
import {HttpClient} from '@angular/common/http';
import {EquipmentSlot} from '../../../shared/models/items/equipment-slot';
import {Weapon} from '../../../shared/models/items/weapon';
import {ItemService} from '../items/item.service';
import {CreatureItemState} from '../../../shared/models/creatures/creature-item-state.enum';
import {ButtonAction} from '../../../shared/models/button/button-action';
import {WeaponRangeType} from '../../../shared/models/items/weapon-range-type.enum';
import {CreatureAbilityProficiency} from '../../../shared/models/creatures/configs/creature-ability-proficiency';
import {CreatureConfigurationCollection} from '../../../shared/models/creatures/configs/creature-configuration-collection';
import {CreatureService} from './creature.service';
import {DamageConfigurationCollection} from '../../../shared/models/damage-configuration-collection';
import {DamageConfiguration} from '../../../shared/models/damage-configuration';
import * as _ from 'lodash';
import {Ability} from '../../../shared/models/attributes/ability.model';
import {AbilityService} from '../attributes/ability.service';
import {PowerService} from '../powers/power.service';
import {CreatureListProficiency} from '../../../shared/models/creatures/creature-list-proficiency';
import {ModifierService} from '../modifier.service';
import {Ammo} from '../../../shared/models/items/ammo';
import {MagicalItem} from '../../../shared/models/items/magical-item';
import {CreatureItemsRequest} from '../../../shared/models/creatures/creature-items-request';
import {CreatureItemRequest} from '../../../shared/models/creatures/creature-item-request';
import {PlayerCharacter} from '../../../shared/models/creatures/characters/player-character';
import {CreatureType} from '../../../shared/models/creatures/creature-type.enum';
import {MagicalItemSpellConfiguration} from '../../../shared/models/items/magical-item-spell-configuration';
import {CharacterService} from './character.service';
import {RollRequest} from '../../../shared/models/rolls/roll-request';
import {DiceService} from '../dice.service';
import {Roll} from '../../../shared/models/rolls/roll';
import {MagicalItemSpellAttackCalculationType} from '../../../shared/models/items/magical-item-spell-attack-calculation-type.enum';
import {MagicalItemType} from '../../../shared/models/items/magical-item-type.enum';
import {NotificationService} from '../notification.service';
import {AttackType} from '../../../shared/models/attack-type.enum';
import {PowerModifier} from '../../../shared/models/powers/power-modifier';
import {Proficiency} from '../../../shared/models/proficiency';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {RollResultDialogData} from '../../components/roll-results/roll-result-dialog/roll-result-dialog-data';
import {RollResultDialogComponent} from '../../components/roll-results/roll-result-dialog/roll-result-dialog.component';
import {Spell} from '../../../shared/models/powers/spell';
import {SpellService} from '../powers/spell.service';
import {environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CreatureItemService {

  constructor(
    private dialog: MatDialog,
    private http: HttpClient,
    private translate: TranslateService,
    private itemService: ItemService,
    private creatureService: CreatureService,
    private abilityService: AbilityService,
    private powerService: PowerService,
    private modifierService: ModifierService,
    private characterService: CharacterService,
    private diceService: DiceService,
    private notificationService: NotificationService,
    private spellService: SpellService
  ) { }

  getAttackButtonActions(creatureItem: CreatureItem, attackWithUnequipped: boolean): ButtonActionGroup[] {
    const buttonActions: ButtonAction[] = [];

    let actions: CreatureItemAction[] = [];
    let magicalItem: MagicalItem = null;

    if (creatureItem.item.itemType === ItemType.MAGICAL_ITEM) {
      magicalItem = creatureItem.item as MagicalItem;
    }

    if (magicalItem != null && magicalItem.magicalItemType !== MagicalItemType.WEAPON) {
      if (magicalItem.magicalItemType === MagicalItemType.SCROLL) {
        actions.push(CreatureItemAction.USE_SCROLL);
      } else if (magicalItem.magicalItemType === MagicalItemType.POTION) {
        actions.push(CreatureItemAction.USE_POTION);
        // actions.push(CreatureItemAction.GAIN);
      } else if (creatureItem.spells.length === 1) {
        actions.push(CreatureItemAction.CAST);
      }
    } else {
      actions = this.getAttackCreatureItemActions(creatureItem);
    }
    actions.forEach((creatureItemAction: CreatureItemAction) => {
        const buttonAction: ItemButtonAction = this.getButtonAction(creatureItemAction);
        if (creatureItem.creatureItemState === CreatureItemState.DROPPED || (!attackWithUnequipped && creatureItem.creatureItemState !== CreatureItemState.EQUIPPED)) {
          buttonAction.disabled = true;
        }
        buttonActions.push(buttonAction);
    });
    const groups: ButtonActionGroup[] = [];
    const group = new ButtonActionGroup('');
    group.actions = buttonActions;
    groups.push(group);
    return groups;
  }

  getButtonActionGroups(creatureItem: CreatureItem, item: Item, creature: Creature, attackWithUnequipped: boolean): ButtonActionGroup[] {
    if (creatureItem == null) {
      return [];
    }
    const groupMap: Map<CreatureItemActionGroup, ButtonActionGroup> = this.getButtonActionGroupMap();
    const actionMap: Map<CreatureItemAction, CreatureItemActionGroup> = this.getCreatureItemActionMap();
    const actions: CreatureItemAction[] = this.getCreatureItemActions(creatureItem, item, creature, attackWithUnequipped);

    actions.forEach((creatureItemAction: CreatureItemAction) => {
      const group = actionMap.get(creatureItemAction);
      if (group != null) {
        const buttonGroup = groupMap.get(group);
        if (buttonGroup != null) {
          const buttonAction: ItemButtonAction = this.getButtonAction(creatureItemAction);
          if (buttonAction.action === CreatureItemAction.ATTUNE) {
            let disabled = false;
            if (creature.creatureType === CreatureType.CHARACTER) {
              const playerCharacter = creature as PlayerCharacter;
              if (!this.characterService.canAttune(playerCharacter, creatureItem)) {
                disabled = true;
              } else if (playerCharacter.characterSettings.equipment.enforceAttunedLimit) {
                const attunedCount = this.getAttunedCount(playerCharacter);
                if (attunedCount >= playerCharacter.characterSettings.equipment.maxAttunedItems) {
                  disabled = true;
                }
              }
            } else {
              const attunedCount = this.getAttunedCount(creature);
              if (attunedCount >= 3) {
                disabled = true;
              }
            }
            buttonAction.disabled = disabled;
          }
          buttonGroup.actions.push(buttonAction);
        }
      }
    });

    const groups: ButtonActionGroup[] = [];
    const values = Array.from(groupMap.values());
    values.forEach((buttonActionGroup: ButtonActionGroup) => {
      if (buttonActionGroup.actions.length > 0) {
        groups.push(buttonActionGroup);
      }
    });
    return groups;
  }

  private getButtonAction(creatureItemAction: CreatureItemAction): ItemButtonAction {
    return new ItemButtonAction(
      creatureItemAction,
      this.translate.instant('CreatureItemAction.' + creatureItemAction + '.Label')
    );
  }

  private getButtonActionGroupMap(): Map<CreatureItemActionGroup, ButtonActionGroup> {
    const map = new Map<CreatureItemActionGroup, ButtonActionGroup>();
    map.set(CreatureItemActionGroup.ACTIONS, new ButtonActionGroup(this.translate.instant('CreatureItemActionGroup.ACTIONS')));
    map.set(CreatureItemActionGroup.MAGICAL_ACTIONS, new ButtonActionGroup(this.translate.instant('CreatureItemActionGroup.MAGICAL_ACTIONS')));
    map.set(CreatureItemActionGroup.PROPERTIES, new ButtonActionGroup(this.translate.instant('CreatureItemActionGroup.PROPERTIES')));
    return map;
  }

  private getCreatureItemActionMap(): Map<CreatureItemAction, CreatureItemActionGroup> {
    const map = new Map<CreatureItemAction, CreatureItemActionGroup>();

    map.set(CreatureItemAction.CAST, CreatureItemActionGroup.ACTIONS);
    map.set(CreatureItemAction.USE_POTION, CreatureItemActionGroup.ACTIONS);
    map.set(CreatureItemAction.USE_SCROLL, CreatureItemActionGroup.ACTIONS);
    map.set(CreatureItemAction.USE_TOOL, CreatureItemActionGroup.ACTIONS);
    map.set(CreatureItemAction.ATTACK, CreatureItemActionGroup.ACTIONS);
    map.set(CreatureItemAction.THROW, CreatureItemActionGroup.ACTIONS);
    map.set(CreatureItemAction.SHOOT, CreatureItemActionGroup.ACTIONS);
    map.set(CreatureItemAction.MELEE, CreatureItemActionGroup.ACTIONS);
    map.set(CreatureItemAction.EQUIP, CreatureItemActionGroup.ACTIONS);
    map.set(CreatureItemAction.UNEQUIP, CreatureItemActionGroup.ACTIONS);
    map.set(CreatureItemAction.DROP, CreatureItemActionGroup.ACTIONS);
    map.set(CreatureItemAction.PICKUP, CreatureItemActionGroup.ACTIONS);
    map.set(CreatureItemAction.PICKUP_EXPENDED, CreatureItemActionGroup.ACTIONS);
    map.set(CreatureItemAction.SELL, CreatureItemActionGroup.ACTIONS);
    map.set(CreatureItemAction.DISCARD, CreatureItemActionGroup.ACTIONS);
    map.set(CreatureItemAction.MOVE, CreatureItemActionGroup.ACTIONS);
    map.set(CreatureItemAction.EMPTY, CreatureItemActionGroup.ACTIONS);
    map.set(CreatureItemAction.USE, CreatureItemActionGroup.ACTIONS);
    map.set(CreatureItemAction.GAIN, CreatureItemActionGroup.ACTIONS);
    map.set(CreatureItemAction.MOUNT, CreatureItemActionGroup.ACTIONS);
    map.set(CreatureItemAction.DISMOUNT, CreatureItemActionGroup.ACTIONS);
    map.set(CreatureItemAction.STABLE, CreatureItemActionGroup.ACTIONS);
    map.set(CreatureItemAction.UNSTABLE, CreatureItemActionGroup.ACTIONS);

    map.set(CreatureItemAction.POISON, CreatureItemActionGroup.PROPERTIES);
    map.set(CreatureItemAction.REMOVE_POISON, CreatureItemActionGroup.PROPERTIES);
    map.set(CreatureItemAction.SILVER, CreatureItemActionGroup.PROPERTIES);
    map.set(CreatureItemAction.REMOVE_SILVER, CreatureItemActionGroup.PROPERTIES);

    map.set(CreatureItemAction.ENCHANT, CreatureItemActionGroup.MAGICAL_ACTIONS);
    map.set(CreatureItemAction.DISENCHANT, CreatureItemActionGroup.MAGICAL_ACTIONS);
    map.set(CreatureItemAction.SPELLS, CreatureItemActionGroup.MAGICAL_ACTIONS);
    map.set(CreatureItemAction.REMOVE_CURSE, CreatureItemActionGroup.MAGICAL_ACTIONS);
    map.set(CreatureItemAction.ATTUNE, CreatureItemActionGroup.MAGICAL_ACTIONS);
    map.set(CreatureItemAction.UNATTUNE, CreatureItemActionGroup.MAGICAL_ACTIONS);
    map.set(CreatureItemAction.CHARGES, CreatureItemActionGroup.MAGICAL_ACTIONS);

    return map;
  }

  private getAttackCreatureItemActions(creatureItem: CreatureItem): CreatureItemAction[] {
    const actions: CreatureItemAction[] = [];
    if (creatureItem != null) {
      if (creatureItem.itemType !== ItemType.WEAPON) {
        if (creatureItem.itemType === ItemType.MAGICAL_ITEM) {
          const magicalItem = creatureItem.item as MagicalItem;
          if (magicalItem.magicalItemType === MagicalItemType.WEAPON && creatureItem.magicalItem != null && creatureItem.magicalItem.itemType === ItemType.WEAPON) {
            const baseWeapon = creatureItem.magicalItem as Weapon;
            if (baseWeapon.rangeType === WeaponRangeType.RANGED) {
              actions.push(CreatureItemAction.SHOOT);
              actions.push(CreatureItemAction.MELEE);
              actions.push(CreatureItemAction.THROW);
            } else {
              actions.push(CreatureItemAction.ATTACK);
              actions.push(CreatureItemAction.THROW);
            }
          } else {
            actions.push(CreatureItemAction.ATTACK);
            actions.push(CreatureItemAction.THROW);
          }
        } else {
          actions.push(CreatureItemAction.ATTACK);
          actions.push(CreatureItemAction.THROW);
        }
      } else {
        const weapon = creatureItem.item as Weapon;
        if (weapon.rangeType === WeaponRangeType.RANGED) {
          actions.push(CreatureItemAction.SHOOT);
          actions.push(CreatureItemAction.MELEE);
          actions.push(CreatureItemAction.THROW);
        } else {
          actions.push(CreatureItemAction.ATTACK);
          actions.push(CreatureItemAction.THROW);
        }
      }
    }
    return actions;
  }

  private getCreatureItemActions(creatureItem: CreatureItem, item: Item, creature: Creature, attackWithUnequipped: boolean): CreatureItemAction[] {
    let actions: CreatureItemAction[] = [];

    const equipped = creatureItem.creatureItemState === CreatureItemState.EQUIPPED && creatureItem.equipmentSlot != null && creatureItem.equipmentSlot.id !== '0';
    const mount = creatureItem.itemType === ItemType.MOUNT;
    const tool = creatureItem.itemType === ItemType.TOOL;
    const vehicle = creatureItem.itemType === ItemType.VEHICLE;
    const expended = (creatureItem.itemType === ItemType.AMMO || creatureItem.itemType === ItemType.MAGICAL_ITEM) && creatureItem.creatureItemState === CreatureItemState.EXPENDED;
    const dropped = creatureItem.creatureItemState === CreatureItemState.DROPPED;
    const carried = !equipped && !mount && !vehicle && !expended && !dropped;

    let magicalItem: MagicalItem = null;

    if (item.itemType === ItemType.MAGICAL_ITEM) {
      magicalItem = item as MagicalItem;
    }

    if (magicalItem != null) {
      if (magicalItem.magicalItemType === MagicalItemType.SCROLL) {
        actions.push(CreatureItemAction.USE_SCROLL);
      } else if (magicalItem.magicalItemType === MagicalItemType.POTION) {
        actions.push(CreatureItemAction.USE_POTION);
        // actions.push(CreatureItemAction.GAIN);
      } else if (creatureItem.spells.length === 1) {
        actions.push(CreatureItemAction.CAST);
      }
    }

    if (equipped) {
      if (item.slot === EquipmentSlotType.HAND) {
        actions = actions.concat(this.getAttackCreatureItemActions(creatureItem));
      }
      if (!mount) {
        actions.push(CreatureItemAction.UNEQUIP);
      } else {
        actions.push(CreatureItemAction.DISMOUNT);
      }
      actions.push(CreatureItemAction.DROP);
    } else if (carried) {
      if (attackWithUnequipped && item.slot === EquipmentSlotType.HAND) {
        actions = actions.concat(this.getAttackCreatureItemActions(creatureItem));
      }
      if (item.equippable && item.slot != null && item.slot !== EquipmentSlotType.NONE) {
        actions.push(CreatureItemAction.EQUIP);
      }
      actions.push(CreatureItemAction.DROP);
    } else if (mount) {
      const stabled = creatureItem.creatureItemState === CreatureItemState.DROPPED;
      if (stabled) {
        actions.push(CreatureItemAction.UNSTABLE)
      } else {
        actions.push(CreatureItemAction.MOUNT);
        actions.push(CreatureItemAction.STABLE)
      }
    } else if (expended) {
      actions.push(CreatureItemAction.PICKUP_EXPENDED);
    } else if (dropped) {
      actions.push(CreatureItemAction.PICKUP);
    }

    const containers = this.getAllContainers(creature, creatureItem);
    const containersAvailable = containers.length > 0;
    if (containersAvailable || creatureItem.containerId !== '0') {
      actions.push(CreatureItemAction.MOVE);
    }

    if (item.expendable) {
      actions.push(CreatureItemAction.USE);
      actions.push(CreatureItemAction.GAIN);
    } else if (tool) {
      actions.push(CreatureItemAction.USE_TOOL);
    }

    if (item.itemType === ItemType.WEAPON
      || item.itemType === ItemType.AMMO
      || (magicalItem != null &&
        (magicalItem.magicalItemType === MagicalItemType.WEAPON
          || magicalItem.magicalItemType === MagicalItemType.AMMO))) {
      if (creatureItem.poisoned) {
        actions.push(CreatureItemAction.REMOVE_POISON);
      } else {
        actions.push(CreatureItemAction.POISON);
      }

      if (creatureItem.silvered) {
        actions.push(CreatureItemAction.REMOVE_SILVER);
      } else {
        actions.push(CreatureItemAction.SILVER);
      }
    }

    //todo - do i want to allow enchanting?
    // if (item.itemType === ItemType.WEAPON || item.itemType === ItemType.ARMOR || item.itemType === ItemType.AMMO) {
    //   actions.push(CreatureItemAction.ENCHANT);
    // }

    if ((item.container || item.itemType === ItemType.MOUNT || item.itemType === ItemType.VEHICLE) && creatureItem.items.length > 0) {
      actions.push(CreatureItemAction.EMPTY);
    }

    if (magicalItem != null) {
      if (creatureItem.magicalItem != null) {
        actions.push(CreatureItemAction.DISENCHANT);
      }
      if (magicalItem.additionalSpells) {
        actions.push(CreatureItemAction.SPELLS);
      }
      if (creatureItem.cursed) {
        actions.push(CreatureItemAction.REMOVE_CURSE);
      }
      if (magicalItem.requiresAttunement) {
        if (creatureItem.attuned) {
          actions.push(CreatureItemAction.UNATTUNE);
        } else {
          actions.push(CreatureItemAction.ATTUNE);
        }
      }
      if (magicalItem.hasCharges) {
        actions.push(CreatureItemAction.CHARGES);
      }
    }

    actions.push(CreatureItemAction.SELL);
    actions.push(CreatureItemAction.DISCARD);

    return actions;
  }

  getAttunedCount(creature: Creature): number {
    let count = 0;
    const items = this.getFlatItemList(creature.items);
    items.forEach((creatureItem: CreatureItem) => {
      if (creatureItem.attuned) {
        count++;
      }
    });
    return count;
  }

  getConfirmationMessage(creatureItemAction: CreatureItemAction): string {
    return this.translate.instant('CreatureItemAction.' + creatureItemAction + '.ConfirmationMessage');
  }

  updateExpanded(creature: Creature, creatureItem: CreatureItem, expanded: boolean): Promise<any> {
    return this.http.post<any>(`${environment.backendUrl}/creatures/${creature.id}/items/${creatureItem.id}?expanded=${expanded}`, {}).toPromise();
  }

  updateSpells(creature: Creature, creatureItem: CreatureItem, spells: MagicalItemSpellConfiguration[]): Promise<any> {
    return this.performAction(CreatureItemAction.SPELLS, creature, creatureItem, 1, null, null, 0, spells);
  }

  performAction(creatureItemAction: CreatureItemAction, creature: Creature, creatureItem: CreatureItem, quantity: number,
                container: ListObject = null, equipmentSlot: ListObject = null, charges = 0, spells: MagicalItemSpellConfiguration[] = []): Promise<string> {
    const options = {
      responseType: 'text' as 'json'
    };

    const request = new CreatureItemActionRequest();
    request.creatureItemId = creatureItem.id;
    request.action = creatureItemAction;
    request.quantity = quantity;
    request.containerId = container == null ? '0' : container.id;
    request.equipmentSlotId = equipmentSlot == null ? '0' : equipmentSlot.id;
    request.charges = charges;
    request.spells = spells;
    return this.http.post<string>(`${environment.backendUrl}/creatures/${creature.id}/items/${creatureItem.id}/${creatureItemAction}`, request, options).toPromise();
  }

  resetAttunement(creatureItems: CreatureItem[], creature: Creature): Promise<any> {
    creatureItems.forEach((creatureItem: CreatureItem) => {
      creatureItem.attuned = false;
    });
    return this.updateItems(creatureItems, creature);
  }

  async rechargeItems(creatureItems: CreatureItem[], creature: Creature): Promise<any> {
    let count = 0;
    for (let i = 0; i < creatureItems.length; i++) {
      const creatureItem = creatureItems[i];
      if (creatureItem.chargesRemaining < creatureItem.maxCharges) {
        const request = this.getRollRequest(creatureItem);
        if (request != null) {
          await this.creatureService.rollStandard(creature, request).then((roll: Roll) => {
            creatureItem.chargesRemaining += roll.totalResult;
            if (creatureItem.chargesRemaining > creatureItem.maxCharges) {
              creatureItem.chargesRemaining = creatureItem.maxCharges;
            }
            count++;
          });
        }
      }
    }

    if (count > 0) {
      return this.updateItems(creatureItems, creature);
    } else {
      return Promise.resolve();
    }
  }

  private getRollRequest(creatureItem: CreatureItem): RollRequest {
    if (creatureItem.item.itemType !== ItemType.MAGICAL_ITEM) {
      return null;
    }
    const magicalItem = creatureItem.item as MagicalItem;
    if (!magicalItem.rechargeable || magicalItem.rechargeRate == null) {
      return null;
    }

    let name = creatureItem.item.name;
    if (creatureItem.magicalItem != null && creatureItem.magicalItem.name !== '') {
      name = `${name} - ${creatureItem.magicalItem.name}`;
    }
    return this.diceService.getDiceRollRequest(
      magicalItem.rechargeRate,
      this.translate.instant('RechargeItem', {item: name})
    );
  }

  resetCharges(creatureItems: CreatureItem[], creature: Creature): Promise<any> {
    creatureItems.forEach((creatureItem: CreatureItem) => {
      creatureItem.chargesRemaining = creatureItem.maxCharges;
    });
    return this.updateItems(creatureItems, creature);
  }

  useCharges(creatureItem: CreatureItem, amount: number, creature: Creature): Promise<any> {
    if (creatureItem.chargesRemaining === 0) {
      return Promise.resolve();
    }
    creatureItem.chargesRemaining -= amount;
    if (creatureItem.chargesRemaining < 0) {
      creatureItem.chargesRemaining = 0;
    }
    return this.updateItems([creatureItem], creature);
  }

  updateItems(creatureItems: CreatureItem[], creature: Creature): Promise<any> {
    const request = new CreatureItemsRequest();
    creatureItems.forEach((creatureItem: CreatureItem) => {
      const requestItem = new CreatureItemRequest();
      requestItem.creatureItemId = creatureItem.id;
      requestItem.charges = creatureItem.chargesRemaining;
      requestItem.attuned = creatureItem.attuned;
      request.items.push(requestItem);
    });
    return this.http.post<string>(`${environment.backendUrl}/creatures/${creature.id}/items`, request).toPromise();
  }

  getContainersAsList(containers: CreatureItem[], includeNone = true): ListObject[] {
    const containersList: ListObject[] = [];
    if (includeNone) {
      containersList.push(new ListObject('0', this.translate.instant('None')));
    }
    containers.forEach((container: CreatureItem) => {
      containersList.push(new ListObject(container.id, container.name));
    });
    //todo - sort
    return containersList;
  }

  getContainerList(creature: Creature, creatureItemAction: CreatureItemAction, containersForItem: CreatureItem): ListObject[] {
    let containers: CreatureItem[] = [];
    let includeNone = false;
    switch (creatureItemAction) {
      case CreatureItemAction.EQUIP:
      case CreatureItemAction.UNEQUIP:
      case CreatureItemAction.PICKUP:
      case CreatureItemAction.PICKUP_EXPENDED:
        containers = this.getCarriedContainers(creature, containersForItem);
        includeNone = true;
        break;
      case CreatureItemAction.DROP:
        containers = this.getDroppedContainers(creature, containersForItem);
        includeNone = true;
        break;
      case CreatureItemAction.MOVE:
      case CreatureItemAction.EMPTY:
        containers = this.getAllContainers(creature, containersForItem);
        includeNone = containersForItem == null || containersForItem.containerId !== '0';
        break;
    }
    return this.getContainersAsList(containers, includeNone);
  }

  private getContainers(creature: Creature, carried: boolean, containersForItem: CreatureItem): CreatureItem[] {
    if (containersForItem != null && (containersForItem.itemType === ItemType.MOUNT || containersForItem.itemType === ItemType.VEHICLE)) {
      return [];
    }
    let containers: CreatureItem[] = [];
    creature.items.forEach((item: CreatureItem) => {
      if (((carried && (item.creatureItemState === CreatureItemState.CARRIED || item.creatureItemState === CreatureItemState.EQUIPPED))
        || (!carried && item.creatureItemState === CreatureItemState.DROPPED))
        && (containersForItem == null || containersForItem.id !== item.id)) {
        if (item.container || item.itemType === ItemType.MOUNT || item.itemType === ItemType.VEHICLE) {
          if (containersForItem == null || containersForItem.containerId !== item.id) {
            containers.push(item);
          }
        }
        containers = containers.concat(this.getNestedContainers(item, containersForItem));
      }
    });

    return containers;
  }

  private getNestedContainers(creatureItem: CreatureItem, containersForItem: CreatureItem): CreatureItem[] {
    let containers: CreatureItem[] = [];
    if (creatureItem.items != null) {
      creatureItem.items.forEach((item: CreatureItem) => {
        if (containersForItem == null || containersForItem.id !== item.id) {
          if (item.container || item.itemType === ItemType.MOUNT) {
            if (containersForItem == null || containersForItem.containerId !== item.id) {
              containers.push(item);
            }
          }
          containers = containers.concat(this.getNestedContainers(item, containersForItem));
        }
      });
    }
    return containers;
  }

  getAllContainers(creature: Creature, containersForItem: CreatureItem): CreatureItem[] {
    const containers = this.getContainers(creature, true, containersForItem);
    return containers.concat(this.getContainers(creature, false, containersForItem));
  }

  getCarriedContainers(creature: Creature, containersForItem: CreatureItem): CreatureItem[] {
    return this.getContainers(creature, true, containersForItem);
  }

  getDroppedContainers(creature: Creature, containersForItem: CreatureItem): CreatureItem[] {
    return this.getContainers(creature, false, containersForItem);
  }

  getEquippedItemsBySlot(slots: EquipmentSlot[], creature: Creature): CreatureItem[] {
    const allEquippedItems = this.getEquippedItems(creature);
    const equippedItems: CreatureItem[] = [];
    allEquippedItems.forEach((creatureItem: CreatureItem) => {
      slots.forEach((slot: EquipmentSlot) => {
        if (creatureItem.equipmentSlot.id === slot.id) {
          equippedItems.push(creatureItem);
        } else if (slot.equipmentSlotType === EquipmentSlotType.HAND && creatureItem.itemType === ItemType.WEAPON) {
          const weapon = creatureItem.item as Weapon;
          if (this.itemService.isTwoHanded(weapon)) {
            equippedItems.push(creatureItem);
          }
        }
      });
    });
    return equippedItems;
  }

  getEquippedItems(creature: Creature): CreatureItem[] {
    const equippedItems: CreatureItem[] = [];
    creature.items.forEach((creatureItem: CreatureItem) => {
      if (creatureItem.creatureItemState === CreatureItemState.EQUIPPED && creatureItem.equipmentSlot != null && creatureItem.equipmentSlot.id !== '0') {
        equippedItems.push(creatureItem);
      }
    });
    return equippedItems;
  }

  getFlatItemList(items: CreatureItem[]): CreatureItem[] {
    let flatItems: CreatureItem[] = [];
    items.forEach((item: CreatureItem) => {
      flatItems.push(item);
      if (item.items.length > 0) {
        flatItems = flatItems.concat(this.getFlatItemList(item.items));
      }
    });
    return flatItems;
  }

  mergeItems(items: CreatureItem[]): CreatureItem[] {
    const mergedItems: CreatureItem[] = [];
    items.forEach((item: CreatureItem) => {
      const match: CreatureItem = this.getMatchedItem(item, mergedItems);
      if (match != null) {
        match.quantity += item.quantity;
      } else {
        mergedItems.push(item);
      }
    });
    return mergedItems;
  }

  private getMatchedItem(item: CreatureItem, items: CreatureItem[]): CreatureItem {
    for (let i = 0; i < items.length; i++) {
      const current = items[i];
      if (current.item.id === item.item.id) {
        if ((current.magicalItem == null && item.magicalItem) == null || (current.magicalItem != null && item.magicalItem != null && current.magicalItem.id === item.magicalItem.id)) {
          return current;
        }
      }
    }
    return null;
  }

  getCarriedItems(items: CreatureItem[], includeEquipped: boolean = true): CreatureItem[] {
    const carriedItems: CreatureItem[] = [];
    items.forEach((creatureItem: CreatureItem) => {
      if (creatureItem.creatureItemState === CreatureItemState.CARRIED || (includeEquipped && creatureItem.creatureItemState === CreatureItemState.EQUIPPED)) {
        carriedItems.push(creatureItem);
      }
    });
    return carriedItems;
  }

  getUniqueCopies(itemId: string, subItemId: string, items: CreatureItem[]): CreatureItem[] {
    const flatItems = this.getFlatItemList(items);
    const uniqueItems: CreatureItem[] = [];
    flatItems.forEach((creatureItem: CreatureItem) => {
      const matches = creatureItem.item.id === itemId && ((subItemId == null && creatureItem.magicalItem == null) || (subItemId != null && creatureItem.magicalItem != null && creatureItem.magicalItem.id === subItemId));
      if (matches && (creatureItem.maxCharges > 0 || !this.isItemInList(creatureItem, uniqueItems))) {
        uniqueItems.push(creatureItem);
      }
    });
    return uniqueItems;
  }

  getUniqueAmmoCopies(baseAmmoId: string, items: CreatureItem[]): CreatureItem[] {
    const flatItems = this.getFlatItemList(items);
    const uniqueItems: CreatureItem[] = [];
    flatItems.forEach((creatureItem: CreatureItem) => {
      const matches = creatureItem.item.id === baseAmmoId || (creatureItem.magicalItem != null && creatureItem.magicalItem.id === baseAmmoId);
      if (matches && !this.isItemInList(creatureItem, uniqueItems)) {
        uniqueItems.push(creatureItem);
      }
    });
    return uniqueItems;
  }

  private isItemInList(creatureItem: CreatureItem, creatureItems: CreatureItem[]): boolean {
    for (let i = 0; i < creatureItems.length; i++) {
      const item = creatureItems[i];
      if (item.id === creatureItem.id) {
        return true;
      }
      if (item.silvered === creatureItem.silvered
        && item.poisoned === creatureItem.poisoned
        && item.attuned === creatureItem.attuned
        && item.cursed === creatureItem.cursed
        && (
          (item.magicalItem == null && creatureItem.magicalItem == null)
          || (item.magicalItem != null && creatureItem.magicalItem != null && item.magicalItem.id === creatureItem.magicalItem.id)
        ) && (item.spells.length === creatureItem.spells.length
          && (item.spells.length === 0 || (item.spells[0].spell.id === creatureItem.spells[0].spell.id))
      )) {
        return true;
      }
    }
    return false;
  }

  getDefaultAttackAbility(item: Item, creatureItem: CreatureItem, collection: CreatureConfigurationCollection): CreatureAbilityProficiency {
    let creatureItemAction = CreatureItemAction.MELEE;
    if (item.itemType === ItemType.WEAPON) {
      const weapon = item as Weapon;
      if (weapon.rangeType === WeaponRangeType.RANGED) {
        creatureItemAction = CreatureItemAction.SHOOT;
      }
    } else if (item.itemType === ItemType.MAGICAL_ITEM) {
      const magicalItem = item as MagicalItem;
      if (magicalItem.magicalItemType === MagicalItemType.WEAPON && creatureItem != null && creatureItem.magicalItem != null && creatureItem.magicalItem.itemType === ItemType.WEAPON) {
        const baseWeapon = creatureItem.magicalItem as Weapon;
        if (baseWeapon.rangeType === WeaponRangeType.RANGED) {
          creatureItemAction = CreatureItemAction.SHOOT;
        }
      }
    }

    return this.getAttackAbility(item, creatureItemAction, collection);
  }

  getAttackAbility(item: Item, creatureItemAction: CreatureItemAction, collection: CreatureConfigurationCollection): CreatureAbilityProficiency {
    const abilityIds: number[] = this.getAttackAbilities(item, creatureItemAction);
    const abilities: CreatureAbilityProficiency[] = [];
    abilityIds.forEach((sid: number) => {
      let creatureAbilityProficiency = this.creatureService.getAbilityBySid(sid, collection);
      if (creatureAbilityProficiency == null) {
        const ability = this.abilityService.getAbilityBySid(sid);
        creatureAbilityProficiency = new CreatureAbilityProficiency(ability);
      }
      abilities.push(creatureAbilityProficiency);
    });

    if (abilities.length === 1) {
      return abilities[0];
    } else if (abilities.length > 1) {
      return this.creatureService.getHighestOfAbilities(abilities, collection);
    }

    return null;
  }

  getAttackAbilities(item: Item, creatureItemAction: CreatureItemAction): number[] {
    let melee = true;
    let thrown = false;
    let finesse = false;
    if (item.itemType === ItemType.WEAPON) {
      const weapon = item as Weapon;
      melee = weapon.rangeType === WeaponRangeType.MELEE;
      finesse = this.itemService.hasWeaponProperty(weapon, SID.WEAPON_PROPERTIES.FINESSE);
      thrown = this.itemService.hasWeaponProperty(weapon, SID.WEAPON_PROPERTIES.THROWN);
    }

    const abilities: number[] = [];
    if (creatureItemAction === CreatureItemAction.ATTACK || creatureItemAction === CreatureItemAction.MELEE) {
      abilities.push(SID.ABILITIES.STRENGTH);
      if (finesse) {
        abilities.push(SID.ABILITIES.DEXTERITY);
      }
    } else if (creatureItemAction === CreatureItemAction.THROW) {
      if (melee) {
        if (thrown) {
          abilities.push(SID.ABILITIES.STRENGTH);
          if (finesse) {
            abilities.push(SID.ABILITIES.DEXTERITY);
          }
        } else {
          abilities.push(SID.ABILITIES.DEXTERITY);
        }
      } else {
        abilities.push(SID.ABILITIES.DEXTERITY);
        if (finesse && thrown) {
          abilities.push(SID.ABILITIES.STRENGTH);
        }
      }
    } else if (creatureItemAction === CreatureItemAction.SHOOT) {
      abilities.push(SID.ABILITIES.DEXTERITY);
      if (finesse) {
        abilities.push(SID.ABILITIES.STRENGTH);
      }
    }

    return abilities;
  }

  getItemRange(creatureItem: CreatureItem, creatureItemAction: CreatureItemAction): string {
    const item = creatureItem.item;
    if (item.itemType === ItemType.WEAPON) {
      const weapon = item as Weapon;

      if (creatureItemAction === CreatureItemAction.THROW || creatureItemAction === CreatureItemAction.SHOOT) {
        return weapon.normalRange + ' / ' + weapon.longRange;
      } else {
        if (this.itemService.hasWeaponProperty(weapon, SID.WEAPON_PROPERTIES.REACH)) {
          return '10';
        } else {
          return '5';
        }
      }
    } else {
      if (creatureItemAction === CreatureItemAction.THROW || creatureItemAction === CreatureItemAction.SHOOT) {
        return '20 / 60';
      } else {
        return '5';
      }
    }
  }

  getAttackMiscModifier(melee: boolean, collection: CreatureConfigurationCollection): CreatureListProficiency {
    const sid = melee ? SID.MISC_ATTRIBUTES.MELEE_ATTACK : SID.MISC_ATTRIBUTES.RANGED_ATTACK;
    return this.creatureService.getMiscModifier(sid, collection);
  }

  getDamageMiscModifier(melee: boolean, collection: CreatureConfigurationCollection): CreatureListProficiency {
    const sid = melee ? SID.MISC_ATTRIBUTES.MELEE_DAMAGE : SID.MISC_ATTRIBUTES.RANGED_DAMAGE;
    return this.creatureService.getMiscModifier(sid, collection);
  }

  initializeDamageConfigurations(magicalItem: MagicalItem): DamageConfigurationCollection {
    const collection = new DamageConfigurationCollection();
    collection.attackType = magicalItem.attackType;
    collection.temporaryHP = magicalItem.temporaryHP;
    collection.attackMod = magicalItem.attackMod;
    collection.saveProficiencyModifier = false;
    collection.saveAbilityModifier = '0';
    collection.saveType = new ListObject('0', '');
    collection.halfOnSave = magicalItem.halfOnSave;
    if (magicalItem.saveType != null) {
      collection.saveType.id = magicalItem.saveType.id;
      collection.saveType.name = magicalItem.saveType.name;
    }
    collection.damageConfigurations = this.getCollectionDamageConfigurations(magicalItem.damages.slice(0));
    return _.cloneDeep(collection);
  }

  getCollectionDamageConfigurations(configs: DamageConfiguration[]): DamageConfiguration[] {
    const list = configs.slice(0);
    list.forEach((config: DamageConfiguration) => {
      if (config.values.abilityModifier == null) {
        config.values.abilityModifier = new Ability();
      }
    });
    return list;
  }

  getMagicalItemDamages(magicalItem: MagicalItem , creatureItem: CreatureItem, creature: Creature, collection: CreatureConfigurationCollection): DamageConfigurationCollection {
    const configuration = this.initializeDamageConfigurations(magicalItem);
    if (creature == null || collection == null) {
      return configuration;
    }
    //todo

    if (creatureItem != null && creatureItem.magicalItem != null) {

    }

    return configuration;
  }

  getItemDamages(item: Item, creatureItem: CreatureItem, creature: Creature, collection: CreatureConfigurationCollection, versatile: boolean): DamageConfigurationCollection {
    if (item == null) {
      return null;
    }
    let defaultAbility = this.getDefaultAttackAbility(item, creatureItem, collection);
    if (defaultAbility == null) {
      return null;
    }

    let melee = true;
    if (item.itemType === ItemType.WEAPON) {
      const weapon = item as Weapon;
      if (weapon.rangeType === WeaponRangeType.RANGED) {
        melee = false;
      }
    } else if (item.itemType === ItemType.MAGICAL_ITEM) {
      const magicalItem = item as MagicalItem;
      if (magicalItem.magicalItemType === MagicalItemType.AMMO) {
        defaultAbility = null;
      } else if (magicalItem.magicalItemType === MagicalItemType.WEAPON && creatureItem != null && creatureItem.magicalItem != null && creatureItem.magicalItem.itemType === ItemType.WEAPON) {
        const baseWeapon = creatureItem.magicalItem as Weapon;
        if (baseWeapon.rangeType === WeaponRangeType.RANGED) {
          melee = false;
        }
      }
    } else if (item.itemType === ItemType.AMMO) {
      const ammo = item as Ammo;
      defaultAbility = null;
      if (ammo.attackAbilityModifier != null && ammo.attackAbilityModifier.id !== '0') {
        defaultAbility = this.creatureService.getAbility(ammo.attackAbilityModifier.id, collection);
      }
    }

    return this.getItemDamagesByAbility(defaultAbility, item, creatureItem, creature, collection, versatile, melee);
  }

  getItemDamagesByAbility(attackAbility: CreatureAbilityProficiency, item: Item, creatureItem: CreatureItem, creature: Creature, collection: CreatureConfigurationCollection, versatile: boolean, melee: boolean, includeAbilityOnDamage: boolean = true, includeMisc: boolean = true): DamageConfigurationCollection {
    if (item == null) {
      return null;
    }
    const configuration = this.itemService.initializeDamageConfigurations(item, creatureItem, versatile);
    if (creature == null || collection == null) {
      const baseDamages: DamageConfiguration[] = _.cloneDeep(configuration.damageConfigurations);
      configuration.damageConfigurations = this.powerService.combineDamages(baseDamages);
      return configuration;
    }

    let parts: string[] = [];
    let itemAttackModifier = 0;
    if (item.itemType === ItemType.MAGICAL_ITEM) {
      const magicalItem = item as MagicalItem;
      if (!magicalItem.requiresAttunement || creatureItem.attuned) {
        itemAttackModifier = magicalItem.attackMod;
        if (configuration.attackMod > 0) {
          configuration.attackMod -= itemAttackModifier;
        }
      }
    }
    const attackAbilityModifier = this.creatureService.getAbilityModifier(attackAbility, collection);
    const resurrectionPenalty = creature.creatureHealth.resurrectionPenalty;
    let profModifier = 0;
    if (this.creatureService.isItemProficient(creatureItem, collection)) {
      profModifier = this.creatureService.getProfModifier(collection);
    }
    if (itemAttackModifier !== 0) {
      parts.push(item.name + ': ' + this.abilityService.convertScoreToString(itemAttackModifier));
    }
    if (attackAbility != null && attackAbilityModifier !== 0) {
      parts.push(attackAbility.ability.name + ': ' + this.abilityService.convertScoreToString(attackAbilityModifier));
    }
    if (profModifier !== 0) {
      parts.push(this.translate.instant('Labels.Prof') + ' ' + this.abilityService.convertScoreToString(profModifier));
    }

    let miscAttackModifier = 0;
    if (includeMisc) {
      const misc = this.getAttackMiscModifier(melee, collection);
      if (misc != null) {
        miscAttackModifier = this.creatureService.getModifiers(misc.modifiers, collection, 0, false);
        parts = parts.concat(this.creatureService.getModifierTooltips(misc.modifiers, collection))
      }
    }

    if (configuration.attackMod !== 0) {
      parts.push(this.translate.instant('Labels.Misc') + ' ' + this.abilityService.convertScoreToString(configuration.attackMod));
    }
    if (resurrectionPenalty !== 0) {
      parts.push(this.translate.instant('Labels.ResurrectionPenalty') + ' -' + resurrectionPenalty);
    }
    // configuration.attackMod += (itemAttackModifier + attackAbilityModifier + profModifier + miscAttackModifier - resurrectionPenalty);
    configuration.attackMod += (itemAttackModifier + attackAbilityModifier + profModifier + miscAttackModifier - resurrectionPenalty);
    configuration.attackModTooltip = parts.join('\n');

    const damages: DamageConfiguration[] = _.cloneDeep(configuration.damageConfigurations);
    damages.forEach((damage: DamageConfiguration, index: number) => {
      if (damage.values.abilityModifier.id !== '0') {
        const ability: CreatureAbilityProficiency = this.creatureService.getAbility(damage.values.abilityModifier.id, collection);
        const modifier: number = this.creatureService.getAbilityModifier(ability, collection);
        damage.values.miscModifier += modifier;
        damage.values.abilityModifier = new Ability();
      }
      if (index === 0 && includeAbilityOnDamage && attackAbility != null && attackAbility.ability.id !== damage.values.abilityModifier.id) {
        damage.values.miscModifier += attackAbilityModifier;
      }
      if (index === 0 && includeMisc) {
        const misc = this.getDamageMiscModifier(melee, collection);
        if (misc != null) {
          damage.values.miscModifier += this.creatureService.getModifiers(misc.modifiers, collection, 0, false);
        }
      }
    });

    configuration.damageConfigurations = this.powerService.combineDamages(damages);
    //todo - sort damages
    return configuration;
  }

  getMagicalItemSpellAttack(magicalItem: MagicalItem, spellLevel: number, creature: Creature, collection: CreatureConfigurationCollection): number {
    switch (magicalItem.spellAttackCalculationType) {
      case MagicalItemSpellAttackCalculationType.TABLE:
        return this.itemService.getScrollSpellAttackModifier(spellLevel);
      case MagicalItemSpellAttackCalculationType.CASTER:
        if (creature != null && collection != null) {
          if (creature.creatureType === CreatureType.CHARACTER) {
            const playerCharacter = creature as PlayerCharacter;
            return this.characterService.getMaxSpellAttackModifier(magicalItem, playerCharacter, collection);
          } else {
            return this.creatureService.getMaxSpellAttackModifier(magicalItem, creature, collection);
          }
        }
        break;
      case MagicalItemSpellAttackCalculationType.CUSTOM:
        return magicalItem.spellAttackModifier;
    }
    return 0;
  }

  getMagicalItemSpellSaveDC(magicalItem: MagicalItem, spellLevel: number, creature: Creature, collection: CreatureConfigurationCollection): number {
    switch (magicalItem.spellAttackCalculationType) {
      case MagicalItemSpellAttackCalculationType.TABLE:
        return this.itemService.getScrollSpellSaveDC(spellLevel);
      case MagicalItemSpellAttackCalculationType.CASTER:
        if (creature != null && collection != null) {
          if (creature.creatureType === CreatureType.CHARACTER) {
            const playerCharacter = creature as PlayerCharacter;
            return this.characterService.getMaxSpellSaveDC(magicalItem, playerCharacter, collection);
          } else {
            return this.creatureService.getMaxSpellSaveDC(magicalItem, creature, collection);
          }
        }
        break;
      case MagicalItemSpellAttackCalculationType.CUSTOM:
        return magicalItem.spellSaveDC;
    }
    return 0;
  }

  getItemName(creatureItem: CreatureItem): string {
    let name = creatureItem.item.name;
    if (creatureItem.magicalItem != null) {
      name = `${name} (${creatureItem.magicalItem.name})`;
    } else if (creatureItem.item.itemType === ItemType.MAGICAL_ITEM) {
      const magicalItem = creatureItem.item as MagicalItem;
      if (magicalItem.magicalItemType === MagicalItemType.SCROLL && creatureItem.spells != null && creatureItem.spells.length > 0) {
        name = `${name} (${creatureItem.spells[0].spell.name})`;
      }
    }
    return name;
  }

  rollForScrollCheck(creatureItem: CreatureItem, creature: Creature, collection: CreatureConfigurationCollection): Promise<boolean> {
    if (creatureItem.item.itemType !== ItemType.MAGICAL_ITEM || creatureItem.spells.length === 0) {
      return Promise.resolve(false);
    }
    const spell = creatureItem.spells[0];
    return this.getScrollRollRequest(creatureItem, creature, collection).then((rollRequest: RollRequest) => {
      return this.creatureService.rollStandard(creature, rollRequest).then((roll: Roll) => {
        const dc = 10 + spell.storedLevel;
        const result = roll.totalResult;
        const displayData = {
          value: result,
          itemName: this.getItemName(creatureItem),
          dc: dc
        };

        let display;
        const success = result >= dc;
        if (!success) {
          display = this.translate.instant('MagicalItem.Spell.Scroll.ChanceOfFailure.Roll.Result.Fail', displayData);
          this.notificationService.error(display);
        } else {
          display = this.translate.instant('MagicalItem.Spell.Scroll.ChanceOfFailure.Roll.Result.Success', displayData);
          this.notificationService.success(display);
        }

        return success;
      });
    });
  }

  private async getScrollRollRequest(creatureItem: CreatureItem, creature: Creature, collection: CreatureConfigurationCollection): Promise<RollRequest> {
    const name = this.getItemName(creatureItem);
    let disadvantage: boolean;
    let modifier: number;
    const magicalItem = creatureItem.item as MagicalItem;
    if (creature.creatureType === CreatureType.CHARACTER) {
      const playerCharacter = creature as PlayerCharacter;
      const ability: CreatureAbilityProficiency = await this.characterService.getMagicalItemSpellMaxSpellcastingAbility(magicalItem, creatureItem.spells[0].spell, playerCharacter, collection);
      modifier = this.creatureService.getAbilityModifier(ability, collection);
      disadvantage = this.characterService.hasModifiedAbilityCheckDisadvantage(playerCharacter, collection, ability == null ? 0 : ability.ability.sid);
    } else {
      //todo - monster
      const abilitySID = 0;
      modifier = 0;
      disadvantage = this.creatureService.hasModifiedAbilityCheckDisadvantage(creature, abilitySID, null, collection);
    }
    return this.diceService.getStandardRollRequest(
      this.translate.instant('MagicalItem.Spell.Scroll.ChanceOfFailure.Roll.Title', {itemName: name}),
      modifier,
      false,
      disadvantage
    );
  }

  rollForDestruction(creatureItem: CreatureItem, creature: Creature): Promise<boolean> {
    return this.creatureService.rollStandard(creature, this.getDestructionRollRequest(creatureItem)).then((roll: Roll) => {
      const result = roll.totalResult;
      const displayData = {
        value: result,
        itemName: this.getItemName(creatureItem)
      };

      let display;
      let destroyed = false;
      if (result === 1) {
        display = this.translate.instant('MagicalItem.ChanceOfDestruction.Roll.Result.Fail', displayData);
        this.notificationService.error(display);
        destroyed = true;
      } else {
        display = this.translate.instant('MagicalItem.ChanceOfDestruction.Roll.Result.Success', displayData);
        this.notificationService.success(display);
      }

      return destroyed;
    });
  }

  private getDestructionRollRequest(creatureItem: CreatureItem): RollRequest {
    const name = this.getItemName(creatureItem);
    return this.diceService.getStandardRollRequest(
      this.translate.instant('MagicalItem.ChanceOfDestruction.Roll.Title', {itemName: name}),
      0
    );
  }

  processMagicalItemRules(creatureItem: CreatureItem, creature: Creature, charges: number, config: MagicalItemSpellConfiguration = null): Promise<boolean> {
    if (creatureItem.item.itemType === ItemType.MAGICAL_ITEM) {
      const magicalItem = creatureItem.item as MagicalItem;
      const magicalItemSpellConfiguration = config != null ? config : creatureItem.spells.length > 0 ? creatureItem.spells[0] : null;

      if (magicalItem.magicalItemType === MagicalItemType.SCROLL) {
        return this.performAction(CreatureItemAction.DISCARD, creature, creatureItem, 1).then(() => {
          return true;
        });
      } else if (magicalItem.magicalItemType === MagicalItemType.POTION) {
        return this.performAction(CreatureItemAction.DISCARD, creature, creatureItem, 1).then(() => {
          return true;
        });
      } else {
        if (magicalItem.hasCharges && magicalItem.chanceOfDestruction && creatureItem.chargesRemaining <= charges) {
          return this.rollForDestruction(creatureItem, creature).then((destroyed: boolean) => {
            if (destroyed) {
              return this.performAction(CreatureItemAction.DISCARD, creature, creatureItem, 1).then(() => {
                return true;
              });
            } else {
              this.useCharges(creatureItem, charges, creature);
              if (magicalItemSpellConfiguration != null && magicalItemSpellConfiguration.removeOnCasting) {
                return this.removeSpell(creatureItem, creature, magicalItemSpellConfiguration).then(() => {
                  return false;
                });
              }
            }
          });
        } else if (magicalItem.hasCharges) {
          this.useCharges(creatureItem, charges, creature);
          if (magicalItemSpellConfiguration != null && magicalItemSpellConfiguration.removeOnCasting) {
            return this.removeSpell(creatureItem, creature, magicalItemSpellConfiguration).then(() => {
              return false;
            });
          }
        } else if (magicalItemSpellConfiguration != null && magicalItemSpellConfiguration.removeOnCasting) {
          return this.removeSpell(creatureItem, creature, magicalItemSpellConfiguration).then(() => {
            return false;
          });
        }

        return Promise.resolve(false);
      }
    }
  }

  private removeSpell(creatureItem: CreatureItem, creature: Creature, spell: MagicalItemSpellConfiguration): Promise<boolean> {
    const index = creatureItem.spells.indexOf(spell);
    if (index > -1) {
      creatureItem.spells.splice(index, 1);

      const spells = _.filter(creatureItem.spells, (config: MagicalItemSpellConfiguration) => { return config.additional === true; });
      return this.updateSpells(creature, creatureItem, spells).then(() => {
        return true;
      });
    } else {
      return Promise.resolve(false);
    }
  }

  castMagicalItemSpell(magicalItem: MagicalItem, spell: Spell, magicalItemSpellConfiguration: MagicalItemSpellConfiguration, creature: Creature, collection: CreatureConfigurationCollection): Promise<any> {
    const damages = this.getMagicalItemSpellSlotDamage(magicalItem, spell, magicalItemSpellConfiguration, creature, collection);

    if (damages.attackType !== AttackType.NONE) {
      const attackRequest = this.getSpellAttackRequest(magicalItem, magicalItemSpellConfiguration, creature, collection, damages);
      const damageRequest = this.getSpellDamageRequest(magicalItemSpellConfiguration, damages);

      return this.creatureService.rollAttackDamage(creature, attackRequest, damageRequest).then((roll: Roll) => {
        this.showCastResult(roll, creature);
      });
    }

    return Promise.resolve();
  }

  private getSpellAttackRequest(magicalItem: MagicalItem, magicalItemSpellConfiguration: MagicalItemSpellConfiguration, creature: Creature, collection: CreatureConfigurationCollection, damages: DamageConfigurationCollection): RollRequest {
    switch (damages.attackType) {
      case AttackType.ATTACK:
        let powerModifier: PowerModifier = null;
        let attackDisadvantage = false;

        if (magicalItem.spellAttackCalculationType === MagicalItemSpellAttackCalculationType.CASTER) {
          if (creature.creatureType === CreatureType.CHARACTER) {
            const playerCharacter = creature as PlayerCharacter;
            powerModifier = this.characterService.getMagicalItemMaxPowerModifier(magicalItem, playerCharacter, AttackType.ATTACK, collection);
            attackDisadvantage = this.characterService.hasModifiedAttackRollDisadvantage(playerCharacter, collection, powerModifier.ability.ability.sid);
          } else {
            //todo - monster
            powerModifier = new PowerModifier();
            powerModifier.proficiency = new Proficiency();
            //   attackDisadvantage = this.creatureService.hasModifiedAttackRollDisadvantage(this.creature, abilitySID, this.collection);
          }
        }

        return this.diceService.getAttackRollRequest(
          magicalItemSpellConfiguration.spell.name,
          damages.attackMod,
          damages.halfOnSave,
          powerModifier == null ? false : powerModifier.proficiency.advantage,
          powerModifier == null ? false : (powerModifier.proficiency.disadvantage || attackDisadvantage));
      case AttackType.SAVE:
        return this.diceService.getSaveRollRequest(
          magicalItemSpellConfiguration.spell.name,
          damages.attackMod,
          damages.halfOnSave);
      case AttackType.HEAL:
        return this.diceService.getHealRollRequest(magicalItemSpellConfiguration.spell.name);
    }

    return null;
  }

  private getMagicalItemSpellSlotDamage(magicalItem: MagicalItem, spell: Spell, magicalItemSpellConfiguration: MagicalItemSpellConfiguration, creature: Creature, collection: CreatureConfigurationCollection): DamageConfigurationCollection {
    let slotDamageConfigurationCollection: DamageConfigurationCollection = null;
    const selectedSlot = magicalItemSpellConfiguration == null ? spell.level : magicalItemSpellConfiguration.storedLevel;
    const damageConfigurationCollection = this.creatureService.getPowerDamages(spell, creature, collection.totalLevel, collection, null, null);
    if (damageConfigurationCollection != null) {
      slotDamageConfigurationCollection = this.spellService.getDamageForSelectedLevel(damageConfigurationCollection, spell.level, selectedSlot);
    }

    if (magicalItemSpellConfiguration != null && slotDamageConfigurationCollection != null) {
      let spellAttackModifier = 0;
      let spellSaveDC = 0;

      if (magicalItemSpellConfiguration.overrideSpellAttackCalculation) {
        spellAttackModifier = magicalItemSpellConfiguration.spellAttackModifier;
        spellSaveDC = magicalItemSpellConfiguration.spellSaveDC;
      } else {
        spellAttackModifier = this.getMagicalItemSpellAttack(magicalItem, selectedSlot, creature, collection);
        spellSaveDC = this.getMagicalItemSpellSaveDC(magicalItem, selectedSlot, creature, collection);
      }

      if (slotDamageConfigurationCollection.attackType === AttackType.ATTACK) {
        slotDamageConfigurationCollection.attackMod = spellAttackModifier;
      } else if (slotDamageConfigurationCollection.attackType === AttackType.SAVE) {
        slotDamageConfigurationCollection.attackMod = spellSaveDC;
      }
    }

    return slotDamageConfigurationCollection;
  }

  private getSpellDamageRequest(magicalItemSpellConfiguration: MagicalItemSpellConfiguration, damages: DamageConfigurationCollection): RollRequest {
    return this.diceService.getDamageRollRequest(magicalItemSpellConfiguration.spell.name, damages.damageConfigurations);
  }

  private showCastResult(roll: Roll, creature: Creature): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = new RollResultDialogData(creature, roll);
    this.dialog.open(RollResultDialogComponent, dialogConfig);
  }

  activateMagicalItemSpell(creature: Creature, isSelfTarget: boolean, spell: Spell): Promise<any> {
    const active = !spell.instantaneous;
    const concentrating = spell.concentration;
    const activeTargetCreatureId = isSelfTarget ? creature.id : '0';
    //todo - handle concentration spell
    return Promise.resolve(); //todo
    // return this.characterService.updateCreatureSpell(this.creature, this.magicalItemSpellConfiguration, active, activeTargetCreatureId, concentrating, this.selectedSlot, this.concentratingSpell, this.collection).then(() => {
    //   if (this.concentratingSpell != null && concentrating) {
    //     this.eventsService.dispatchEvent(EVENTS.SpellUpdated + this.concentratingSpell.spell.id);
    //   }
    //   this.eventsService.dispatchEvent(EVENTS.SpellUpdated + this.magicalItemSpellConfiguration.spell.id);
    //   this.eventsService.dispatchEvent(EVENTS.ModifiersUpdated);
    // });
  }

  rollMagicalItemEffect(magicalItem: MagicalItem, creature: Creature, collection: CreatureConfigurationCollection, isTarget: boolean): Promise<any> {
    const damages = this.initializeDamageConfigurations(magicalItem);

    if (damages.attackType !== AttackType.NONE) {
      const attackRequest = this.getPotionAttackRequest(magicalItem, damages);
      const damageRequest = this.getPotionDamageRequest(magicalItem, damages);

      return this.creatureService.rollAttackDamage(creature, attackRequest, damageRequest).then((roll: Roll) => {
        this.showCastResult(roll, creature);
        if (damages.attackType === AttackType.HEAL && isTarget && roll.childrenRolls.length > 0) {
          //apply healing
          const healingAmount = roll.childrenRolls[0].totalResult;
          const creatureHealth = _.cloneDeep(creature.creatureHealth);
          creatureHealth.currentHp += healingAmount;
          let max = 0;
          if (creature.creatureType === CreatureType.CHARACTER) {
            const playerCharacter = creature as PlayerCharacter;
            max = this.characterService.getMaxHP(playerCharacter, collection);
          } else {
            //todo - monster
          }
          if (creatureHealth.currentHp > max) {
            creatureHealth.currentHp = max;
          }
          return this.creatureService.updateCreatureHealth(creature, creatureHealth).then(() => {
            creature.creatureHealth = creatureHealth;
          })
        }
      });
    }

    return Promise.resolve();
  }

  private getPotionAttackRequest(magicalItem: MagicalItem, damages: DamageConfigurationCollection): RollRequest {
    switch (damages.attackType) {
      case AttackType.ATTACK:
        return this.diceService.getAttackRollRequest(
          magicalItem.name,
          damages.attackMod,
          damages.halfOnSave);
      case AttackType.SAVE:
        return this.diceService.getSaveRollRequest(
          magicalItem.name,
          damages.attackMod,
          damages.halfOnSave);
      case AttackType.HEAL:
        return this.diceService.getHealRollRequest(magicalItem.name);
    }

    return null;
  }

  private getPotionDamageRequest(magicalItem: MagicalItem, damages: DamageConfigurationCollection): RollRequest {
    return this.diceService.getDamageRollRequest(magicalItem.name, damages.damageConfigurations);
  }

  getCreatureItemEquipmentSlotType(creatureItem: CreatureItem): EquipmentSlotType {
    if (creatureItem == null) {
      return null;
    }
    let slot = creatureItem.item.slot;
    if (creatureItem.item.itemType === ItemType.MAGICAL_ITEM && creatureItem.magicalItem != null) {
      const magicalItem = creatureItem.item as MagicalItem;
      if (magicalItem.magicalItemType === MagicalItemType.ARMOR) {
        slot = creatureItem.magicalItem.slot;
      }
    }

    return slot;
  }
}
