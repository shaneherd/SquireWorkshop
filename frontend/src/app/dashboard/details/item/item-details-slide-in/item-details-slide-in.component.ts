import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {CreatureConfigurationCollection} from '../../../../shared/models/creatures/configs/creature-configuration-collection';
import {CreatureItem} from '../../../../shared/models/creatures/creature-item';
import {ItemService} from '../../../../core/services/items/item.service';
import {Item} from '../../../../shared/models/items/item';
import {ButtonActionGroup} from '../../../../shared/models/button/button-action-group';
import {ButtonAction} from '../../../../shared/models/button/button-action';
import {ItemButtonAction} from '../../../../shared/models/button/item-button-action';
import {CreatureItemAction} from '../../../../shared/models/creatures/creature-item-action.enum';
import {CreatureItemService} from '../../../../core/services/creatures/creature-item.service';
import {ListObject} from '../../../../shared/models/list-object';
import {EVENTS} from '../../../../constants';
import {EventsService} from '../../../../core/services/events.service';
import {Subscription} from 'rxjs';
import {MagicalItemType} from '../../../../shared/models/items/magical-item-type.enum';
import {ConfirmDialogData} from '../../../../core/components/confirm-dialog/confirmDialogData';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ConfirmDialogComponent} from '../../../../core/components/confirm-dialog/confirm-dialog.component';
import {ItemType} from '../../../../shared/models/items/item-type.enum';
import {MagicalItem} from '../../../../shared/models/items/magical-item';
import {TranslateService} from '@ngx-translate/core';
import {CreatureService} from '../../../../core/services/creatures/creature.service';
import {MagicalItemSpellConfiguration} from '../../../../shared/models/items/magical-item-spell-configuration';
import {YesNoDialogData} from '../../../../core/components/yes-no-dialog/yes-no-dialog-data';
import {YesNoDialogComponent} from '../../../../core/components/yes-no-dialog/yes-no-dialog.component';
import {PowerService} from '../../../../core/services/powers/power.service';
import {Spell} from '../../../../shared/models/powers/spell';
import {RangeType} from '../../../../shared/models/powers/range-type.enum';
import {ModifierConfigurationCollection} from '../../../../shared/models/modifier-configuration-collection';
import {CharacterService} from '../../../../core/services/creatures/character.service';
import {AttackType} from '../../../../shared/models/attack-type.enum';
import {DiceService} from '../../../../core/services/dice.service';
import {Creature} from '../../../../shared/models/creatures/creature';
import {CreatureType} from '../../../../shared/models/creatures/creature-type.enum';
import {PlayerCharacter} from '../../../../shared/models/creatures/characters/player-character';
import {BattleMonster} from '../../../../shared/models/creatures/battle-monsters/battle-monster';

@Component({
  selector: 'app-item-details-slide-in',
  templateUrl: './item-details-slide-in.component.html',
  styleUrls: ['./item-details-slide-in.component.scss']
})
export class ItemDetailsSlideInComponent implements OnInit, OnDestroy, OnChanges {
  @Input() actionChoices: ListObject[] = [];
  @Input() creatureItem: CreatureItem;
  @Input() itemId: string;
  @Input() creature: Creature;
  @Input() collection: CreatureConfigurationCollection;
  @Input() allowActions = true;
  @Input() attackOnly = false;
  @Input() showThrowSource = false;
  @Input() attackWithUnequipped = false;
  @Input() watchItemsUpdate = true;
  @Output() save = new EventEmitter();
  @Output() close = new EventEmitter();
  @Output() selectionChange = new EventEmitter<string>();

  eventSub: Subscription;
  selectedAction: ListObject;
  headerName = '';
  loading = false;
  configuring = false;
  item: Item = null;
  viewingItem: CreatureItem = null;
  buttonActionGroups: ButtonActionGroup[] = [];
  attackAction: CreatureItemAction;
  commonAction: CreatureItemAction;
  confirmationMessage = '';
  containers: ListObject[] = [];
  equipping = false;
  selling = false;
  gaining = false;
  editingCharges = false;
  editingSpells = false;
  notInClassList = false;
  usingTool = false;

  constructor(
    private dialog: MatDialog,
    private translate: TranslateService,
    private creatureService: CreatureService,
    private itemService: ItemService,
    private creatureItemService: CreatureItemService,
    private eventsService: EventsService,
    private powerService: PowerService,
    private characterService: CharacterService,
    private diceService: DiceService
  ) { }

  ngOnInit() {
    this.initializeSelectedAction();
    this.initializeItem();

    this.eventSub = this.eventsService.events.subscribe(event => {
      if (this.watchItemsUpdate && event === EVENTS.ItemsUpdated) {
        this.creatureItem = this.getCreatureItem();
        if (this.creatureItem == null || this.creatureItem.quantity === 0) {
          this.closeDetails();
          return;
        }
        this.initializeItem();
      } else if (event === EVENTS.SettingsUpdated) {
        this.initializeActions();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        if (propName === 'creatureItem') {
          this.initializeItem();
        }
      }
    }
  }

  private initializeSelectedAction(): void {
    for (let i = 0; i < this.actionChoices.length; i++) {
      const action = this.actionChoices[i];
      if (action.id === this.creatureItem.id) {
        this.selectedAction = action;
        break;
      }
    }
  }

  actionChange(action: ListObject): void {
    this.selectedAction = action;
    this.selectionChange.emit(action.id);
  }

  private getCreatureItem(): CreatureItem {
    const flatItems = this.creatureItemService.getFlatItemList(this.creature.items);
    for (let i = 0; i < flatItems.length; i++) {
      const creatureItem = flatItems[i];
      if (creatureItem.id === this.creatureItem.id) {
        return creatureItem;
      }
    }
    return null;
  }

  ngOnDestroy() {
    this.eventSub.unsubscribe();
  }

  private initializeItem(): void {
    this.loading = true;
    if (this.creatureItem != null) {
      this.item = this.creatureItem.item;
      this.initializeActions();
      this.headerName = this.creatureItem.name;
      this.loading = false;
    } else {
      this.allowActions = false;
      this.itemService.getItem(this.itemId).then((item: Item) => {
        this.item = item;
        this.headerName = this.item.name;
        this.initializeActions();
        this.loading = false;
      });
    }

    this.eventsService.dispatchEvent(EVENTS.ItemUpdated + this.creatureItem.id);
  }

  private initializeActions(): void {
    if (this.allowActions) {
      const attackWithUnequipped = this.attackWithUnequipped;
      if (this.attackOnly) {
        this.buttonActionGroups = this.creatureItemService.getAttackButtonActions(this.creatureItem, attackWithUnequipped);
      } else {
        this.buttonActionGroups = this.creatureItemService.getButtonActionGroups(this.creatureItem, this.item, this.creature, attackWithUnequipped);
      }

      if (this.creatureItem.item.itemType === ItemType.MAGICAL_ITEM) {
        const magicalItem = this.creatureItem.item as MagicalItem;
        if (magicalItem.magicalItemType === MagicalItemType.SCROLL && this.creatureItem.spells.length > 0) {
          const spell = this.creatureItem.spells[0].spell;
          if (this.creature.creatureType === CreatureType.CHARACTER) {
            const playerCharacter = this.creature as PlayerCharacter;
            this.characterService.isSpellInClassList(spell, playerCharacter).then((inClassList: boolean) => {
              this.notInClassList = !inClassList;

              if (this.notInClassList) {
                this.buttonActionGroups.forEach((buttonActionGroup: ButtonActionGroup) => {
                  buttonActionGroup.actions.forEach((action: ButtonAction) => {
                    const itemAction = action as ItemButtonAction;
                    if (itemAction.action === CreatureItemAction.USE_SCROLL) {
                      action.disabled = true;
                    }
                  });
                });
              }
            });
          } else if (this.creature.creatureType === CreatureType.MONSTER) {
            const battleMonster = this.creature as BattleMonster;
            //todo
          }
        }
      }
    }
  }

  closeDetails(): void {
    this.close.emit();
  }

  primaryAction(action: ButtonAction): void {
    const itemButtonAction = action as ItemButtonAction;

    switch (itemButtonAction.action) {
      case CreatureItemAction.ATTACK:
      case CreatureItemAction.MELEE:
      case CreatureItemAction.THROW:
      case CreatureItemAction.SHOOT:
        this.handleAttackAction(itemButtonAction.action);
        break;
      case CreatureItemAction.USE_POTION:
        this.handlePotionAction();
        break;
      case CreatureItemAction.USE_SCROLL:
        this.handleScrollAction();
        break;
      case CreatureItemAction.CAST:
        this.handleCastAction();
        break;
      case CreatureItemAction.USE_TOOL:
        this.usingTool = true;
        break;
      case CreatureItemAction.EQUIP:
      case CreatureItemAction.MOUNT:
        this.equipping = true;
        break;
      case CreatureItemAction.SELL:
        this.selling = true;
        break;
      case CreatureItemAction.GAIN:
        this.gaining = true;
        break;
      case CreatureItemAction.UNEQUIP:
      case CreatureItemAction.DROP:
      case CreatureItemAction.PICKUP:
      case CreatureItemAction.PICKUP_EXPENDED:
      case CreatureItemAction.DISCARD:
      case CreatureItemAction.MOVE:
      case CreatureItemAction.USE:
      case CreatureItemAction.POISON:
      case CreatureItemAction.REMOVE_POISON:
      case CreatureItemAction.SILVER:
      case CreatureItemAction.REMOVE_SILVER:
      case CreatureItemAction.REMOVE_CURSE:
      case CreatureItemAction.ATTUNE:
      case CreatureItemAction.UNATTUNE:
      case CreatureItemAction.DISENCHANT:
      case CreatureItemAction.EMPTY:
        this.handleCommonAction(itemButtonAction.action);
        break;
      case CreatureItemAction.STABLE:
      case CreatureItemAction.UNSTABLE:
      case CreatureItemAction.DISMOUNT:
        this.handleNoPromptAction(itemButtonAction.action);
        break;
      case CreatureItemAction.ENCHANT:
        //todo
        break;
      case CreatureItemAction.SPELLS:
        this.editingSpells = true;
        break;
      case CreatureItemAction.CHARGES:
        this.editingCharges = true;
        break;
    }
  }

  private handleAttackAction(action: CreatureItemAction): void {
    //todo
    this.attackAction = action;
  }

  private handleCommonAction(action: CreatureItemAction): void {
    const quantity = this.creatureItem.quantity;
    this.confirmationMessage = this.creatureItemService.getConfirmationMessage(action);
    this.containers = this.creatureItemService.getContainerList(this.creature, action, this.creatureItem);
    if (quantity === 1 && this.confirmationMessage === '' && this.containers.length === 0) { //containers always has 'none' option
      this.handleNoPromptAction(action);
    } else {
      this.commonAction = action;
    }
  }

  private handleNoPromptAction(action: CreatureItemAction): void {
    this.continueAction(action, 1, null);
  }

  private continueAction(action: CreatureItemAction, quantity: number, container: ListObject = null, equipmentSlot: ListObject = null, charges = 0): void {
    this.loading = true;
    this.creatureItemService.performAction(action, this.creature, this.creatureItem, quantity, container, equipmentSlot, charges).then(() => {
      this.loading = false;
      this.eventsService.dispatchEvent(EVENTS.ItemUpdated + this.creatureItem.id);
      this.save.emit();
    });
  }

  attackActionContinue(): void {
    this.attackAction = null;
    this.eventsService.dispatchEvent(EVENTS.ItemUpdated + this.creatureItem.id);
    this.save.emit();
  }

  attackActionCancel(): void {
    this.attackAction = null;
  }

  commonActionContinue(): void {
    this.commonAction = null;
    this.eventsService.dispatchEvent(EVENTS.ItemUpdated + this.creatureItem.id);
    this.save.emit();
  }

  commonActionCancel(): void {
    this.commonAction = null;
  }

  continueEquip(): void {
    this.equipping = false;
    this.eventsService.dispatchEvent(EVENTS.ItemUpdated + this.creatureItem.id);
    this.save.emit();
  }

  cancelEquip(): void {
    this.equipping = false;
  }

  continueGain(): void {
    this.gaining = false;
    this.eventsService.dispatchEvent(EVENTS.WealthUpdated);
    this.eventsService.dispatchEvent(EVENTS.ItemUpdated + this.creatureItem.id);
    this.save.emit();
  }

  cancelGain(): void {
    this.gaining = false;
  }

  continueSell(): void {
    this.selling = false;
    this.eventsService.dispatchEvent(EVENTS.WealthUpdated);
    this.eventsService.dispatchEvent(EVENTS.ItemUpdated + this.creatureItem.id);
    this.save.emit();
  }

  cancelSell(): void {
    this.selling = false;
  }

  chargesContinue(): void {
    this.editingCharges = false;
    this.eventsService.dispatchEvent(EVENTS.EquipmentChargesUpdated);
    this.eventsService.dispatchEvent(EVENTS.ItemUpdated + this.creatureItem.id);
    this.save.emit();
  }

  chargesRecharge(): void {
    this.editingCharges = false;
    this.eventsService.dispatchEvent(EVENTS.EquipmentChargesUpdated);
    this.eventsService.dispatchEvent(EVENTS.ItemUpdated + this.creatureItem.id);
    this.save.emit();
  }

  chargesCancel(): void {
    this.editingCharges = false;
  }

  spellsContinue(): void {
    this.editingSpells = false;
    this.eventsService.dispatchEvent(EVENTS.EquipmentSpellsUpdated);
    this.eventsService.dispatchEvent(EVENTS.ItemUpdated + this.creatureItem.id);
    this.save.emit();
  }

  spellsCancel(): void {
    this.editingSpells = false;
  }

  saveItem(): void {
    this.viewingItem = null;
    this.eventsService.dispatchEvent(EVENTS.ItemUpdated + this.creatureItem.id);
    this.save.emit();
  }

  closeItem(): void {
    this.viewingItem = null;
  }

  onItemClick(creatureItem: CreatureItem): void {
    this.viewingItem = creatureItem;
  }

  private handlePotionAction(): void {
    if (this.creatureItem.item.itemType === ItemType.MAGICAL_ITEM) {
      const magicalItem = this.creatureItem.item as MagicalItem;

      if (magicalItem.magicalItemType === MagicalItemType.POTION) {
        let spell: MagicalItemSpellConfiguration = null;
        if (this.creatureItem.spells.length > 0) {
          spell = this.creatureItem.spells[0];
        }

        if (magicalItem.attackType === AttackType.HEAL) {
          this.promptIsSelfTargetOfPotion(magicalItem, spell);
        } else {
          this.continueUsingPotion(magicalItem, spell, false);
        }
      }
    }
  }

  private promptIsSelfTargetOfPotion(magicalItem: MagicalItem, spell: MagicalItemSpellConfiguration): void {
    const data = new YesNoDialogData();
    data.title = this.translate.instant('PotionTarget');
    data.message = this.translate.instant('AreYouThePotionTarget');
    data.yes = () => {
      this.continueUsingPotion(magicalItem, spell, true);
    };
    data.no = () => {
      this.continueUsingPotion(magicalItem, spell, false);
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = data;
    this.dialog.open(YesNoDialogComponent, dialogConfig);
  }

  private continueUsingPotion(magicalItem: MagicalItem, spell: MagicalItemSpellConfiguration, isTarget: boolean): void {
    this.creatureItemService.rollMagicalItemEffect(magicalItem, this.creature, this.collection, isTarget).then(() => {
      if (magicalItem.attackType === AttackType.HEAL && isTarget) {
        this.eventsService.dispatchEvent(EVENTS.HpUpdated);
      }
    });
    if (spell != null) {
      this.handleCastAction();
    } else {
      this.creatureItemService.performAction(CreatureItemAction.DISCARD, this.creature, this.creatureItem, 1).then(() => {
        this.eventsService.dispatchEvent(EVENTS.ItemUpdated + this.creatureItem.id);
        this.save.emit();
      })
    }
  }

  private handleScrollAction(): void {
    if (this.creatureItem.item.itemType === ItemType.MAGICAL_ITEM && this.creatureItem.spells.length > 0) {
      const magicalItem = this.creatureItem.item as MagicalItem;
      const spell = this.creatureItem.spells[0];
      if (magicalItem.magicalItemType === MagicalItemType.SCROLL) {
        const data = new ConfirmDialogData();
        const casterMaxSpellLevel = this.creatureService.getMaxSpellLevel(this.creature, this.collection);
        if (casterMaxSpellLevel < spell.storedLevel) {
          data.title = this.translate.instant('MagicalItem.Spell.Scroll.ChanceOfFailure.Confirmation.Title');
          data.message = this.translate.instant('MagicalItem.Spell.Scroll.ChanceOfFailure.Confirmation.Message', {dc: (10 + spell.storedLevel)});
        } else {
          data.title = this.translate.instant('MagicalItem.Spell.Scroll.OneTimeUse.Confirmation.Title');
          data.message = this.translate.instant('MagicalItem.Spell.Scroll.OneTimeUse.Confirmation.Message');
        }
        data.confirm = () => {
          this.continueCastingScroll();
        };
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = data;
        this.dialog.open(ConfirmDialogComponent, dialogConfig);
      } else {
        this.handleCastAction();
      }
    }
  }

  private continueCastingScroll(): void {
    this.creatureItemService.rollForScrollCheck(this.creatureItem, this.creature, this.collection).then((success: boolean) => {
      if (success) {
        this.handleCastAction();
      } else {
        // failed check - destroy scroll
        this.creatureItemService.performAction(CreatureItemAction.DISCARD, this.creature, this.creatureItem, 1).then(() => {
          this.eventsService.dispatchEvent(EVENTS.ItemUpdated + this.creatureItem.id);
          this.save.emit();
        });
      }
    });
  }

  private handleCastAction(): void {
    if (this.creatureItem.item.itemType === ItemType.MAGICAL_ITEM && this.creatureItem.spells.length > 0) {
      const magicalItem = this.creatureItem.item as MagicalItem;
      const spell = this.creatureItem.spells[0];
      const charges = spell.charges;

      if (magicalItem.magicalItemType !== MagicalItemType.SCROLL && magicalItem.magicalItemType !== MagicalItemType.POTION
        && (spell.removeOnCasting || (magicalItem.hasCharges && magicalItem.chanceOfDestruction && this.creatureItem.chargesRemaining <= charges))) {
        const data = new ConfirmDialogData();
        if (spell.removeOnCasting) {
          data.title = this.translate.instant('MagicalItem.Spell.RemoveOnCasting.Confirmation.Title');
          data.message = this.translate.instant('MagicalItem.Spell.RemoveOnCasting.Confirmation.Message');
        } else {
          data.title = this.translate.instant('MagicalItem.ChanceOfDestruction.Confirmation.Title');
          data.message = this.translate.instant('MagicalItem.ChanceOfDestruction.Confirmation.Message');
        }
        data.confirm = () => {
          this.continueCasting(magicalItem, spell);
        };
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = data;
        this.dialog.open(ConfirmDialogComponent, dialogConfig);
      } else {
        this.continueCasting(magicalItem, spell);
      }
    }
  }

  private continueCasting(magicalItem: MagicalItem, config: MagicalItemSpellConfiguration): void {
    this.powerService.getPower(config.spell.id).then((spell: Spell) => {
      const modifiers = this.getSpellModifiers(spell);
      if (config.active || spell.instantaneous || modifiers == null || modifiers.modifierConfigurations.length === 0) {
        this.rollSpellAttack(magicalItem, spell, config);
        this.finishProcessingSpell(false, config, spell);
      } else if (spell.rangeType === RangeType.SELF) {
        this.rollSpellAttack(magicalItem, spell, config);
        this.finishProcessingSpell(true, config, spell);
      } else {
        this.promptIsSelfTarget(magicalItem, config, spell);
      }
    });
  }

  private rollSpellAttack(magicalItem: MagicalItem, spell: Spell, config: MagicalItemSpellConfiguration): void {
    this.creatureItemService.castMagicalItemSpell(magicalItem, spell, config, this.creature, this.collection);
  }

  private getSpellModifiers(spell: Spell): ModifierConfigurationCollection {
    if (this.creature.creatureType === CreatureType.CHARACTER) {
      const playerCharacter = this.creature as PlayerCharacter;
      return this.characterService.getPowerModifiers(spell, playerCharacter, this.collection.totalLevel, this.collection);
    } else {
      return null;
    }
  }

  private finishProcessingSpell(isSelfTarget: boolean, config: MagicalItemSpellConfiguration, spell: Spell): Promise<any> {
    return this.creatureItemService.processMagicalItemRules(this.creatureItem, this.creature, config.charges).then((removed: boolean) => {
      if (!config.active && (spell.concentration || !spell.instantaneous)) {
        return this.finishActivatingSpell(isSelfTarget, spell).then(() => {
          // this.cast.emit(removed);
          this.eventsService.dispatchEvent(EVENTS.ItemUpdated + this.creatureItem.id);
          this.save.emit();
        });
      } else {
        // this.cast.emit(removed);
        this.eventsService.dispatchEvent(EVENTS.ItemUpdated + this.creatureItem.id);
        this.save.emit();
      }
    });
  }

  private promptIsSelfTarget(magicalItem: MagicalItem, config: MagicalItemSpellConfiguration, spell: Spell): void {
    const data = new YesNoDialogData();
    data.title = this.translate.instant('SpellTarget');
    data.message = this.translate.instant('AreYouTheSpellTarget');
    data.yes = () => {
      this.rollSpellAttack(magicalItem, spell, config);
      this.finishProcessingSpell(true, config, spell);
    };
    data.no = () => {
      this.rollSpellAttack(magicalItem, spell, config);
      this.finishProcessingSpell(false, config, spell);
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = data;
    this.dialog.open(YesNoDialogComponent, dialogConfig);
  }

  private finishActivatingSpell(isSelfTarget: boolean, spell: Spell): Promise<any> {
    return this.creatureItemService.activateMagicalItemSpell(this.creature, isSelfTarget, spell);
  }

  toolContinue(): void {
    this.usingTool = false;
  }

  toolCancel(): void {
    this.usingTool = false;
  }
}
