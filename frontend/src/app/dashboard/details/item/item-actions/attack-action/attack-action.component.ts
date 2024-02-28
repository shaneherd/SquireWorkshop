import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {CreatureItem} from '../../../../../shared/models/creatures/creature-item';
import {CreatureItemAction} from '../../../../../shared/models/creatures/creature-item-action.enum';
import {ListObject} from '../../../../../shared/models/list-object';
import {CreatureItemService} from '../../../../../core/services/creatures/creature-item.service';
import {EventsService} from '../../../../../core/services/events.service';
import {EVENTS, SID} from '../../../../../constants';
import {Subscription} from 'rxjs';
import {CreatureConfigurationCollection} from '../../../../../shared/models/creatures/configs/creature-configuration-collection';
import {DamageConfigurationCollection} from '../../../../../shared/models/damage-configuration-collection';
import {ItemType} from '../../../../../shared/models/items/item-type.enum';
import {Weapon} from '../../../../../shared/models/items/weapon';
import {CharacterService} from '../../../../../core/services/creatures/character.service';
import {Item} from '../../../../../shared/models/items/item';
import {CreatureAbilityProficiency} from '../../../../../shared/models/creatures/configs/creature-ability-proficiency';
import {CreatureService} from '../../../../../core/services/creatures/creature.service';
import {Proficiency} from '../../../../../shared/models/proficiency';
import {AbilityService} from '../../../../../core/services/attributes/ability.service';
import {ItemService} from '../../../../../core/services/items/item.service';
import {WeaponRangeType} from '../../../../../shared/models/items/weapon-range-type.enum';
import {CreatureItemState} from '../../../../../shared/models/creatures/creature-item-state.enum';
import * as _ from 'lodash';
import {TranslateService} from '@ngx-translate/core';
import {RollRequest} from '../../../../../shared/models/rolls/roll-request';
import {DiceService} from '../../../../../core/services/dice.service';
import {Roll} from '../../../../../shared/models/rolls/roll';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {RollResultDialogData} from '../../../../../core/components/roll-results/roll-result-dialog/roll-result-dialog-data';
import {RollResultDialogComponent} from '../../../../../core/components/roll-results/roll-result-dialog/roll-result-dialog.component';
import {EquipmentSlotType} from '../../../../../shared/models/items/equipment-slot-type.enum';
import {MagicalItem} from '../../../../../shared/models/items/magical-item';
import {MagicalItemType} from '../../../../../shared/models/items/magical-item-type.enum';
import {Ammo} from '../../../../../shared/models/items/ammo';
import {DamageConfiguration} from '../../../../../shared/models/damage-configuration';
import {PowerService} from '../../../../../core/services/powers/power.service';
import {Creature} from '../../../../../shared/models/creatures/creature';
import {CreatureType} from '../../../../../shared/models/creatures/creature-type.enum';
import {PlayerCharacter} from '../../../../../shared/models/creatures/characters/player-character';

@Component({
  selector: 'app-attack-action',
  templateUrl: './attack-action.component.html',
  styleUrls: ['./attack-action.component.scss']
})
export class AttackActionComponent implements OnInit, OnDestroy, OnChanges {
  @Input() creature: Creature;
  @Input() collection: CreatureConfigurationCollection;
  @Input() creatureItem: CreatureItem;
  @Input() creatureItemAction: CreatureItemAction;
  @Input() confirmationMessage: string;
  @Input() containers: ListObject[];
  @Input() showThrowSource: boolean;
  @Input() attackWithUnequipped = false;
  @Output() continue = new EventEmitter<null>();
  @Output() cancel = new EventEmitter<null>();

  name = '';
  eventSub: Subscription;
  loading = false;
  damageConfigurationCollection: DamageConfigurationCollection = null;
  item: Item;
  versatile = false;
  finesse = false;
  disabled = false;

  ability: CreatureAbilityProficiency;
  abilities: CreatureAbilityProficiency[] = [];
  twoHanded = false;
  hasEmptyHand = false;

  range = '';
  attackProficiency: Proficiency = new Proficiency();

  melee = false;

  useAmmo = false;
  selectedAmmo: CreatureItem = null;
  ammos: CreatureItem[] = [];
  ammoType: ListObject = null;
  ammoSources: CreatureItem[] = [];
  selectedAmmoSource: CreatureItem = null;
  ammoItemToExpend: CreatureItem = null;
  ammoCount = 0;

  useThrow = false;
  throwSources: CreatureItem[] = [];
  selectedThrowSource: CreatureItem = null;
  throwCount = 0;
  throwItemToExpend: CreatureItem = null;

  constructor(
    private creatureService: CreatureService,
    private characterService: CharacterService,
    private itemService: ItemService,
    private creatureItemService: CreatureItemService,
    private eventsService: EventsService,
    private abilityService: AbilityService,
    private translate: TranslateService,
    private dialog: MatDialog,
    private diceService: DiceService,
    private powerService: PowerService
  ) { }

  ngOnInit() {
    this.initializeAbilities();
    this.initializeValues();

    this.eventSub = this.eventsService.events.subscribe(event => {
      if (event === EVENTS.AbilityScoreChange
        || event === EVENTS.ModifiersUpdated
        || event === EVENTS.SettingsUpdated) {
        this.initializeValues();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        if (propName === 'creatureItem') {
          const value = changes[propName].currentValue as CreatureItem;
          if (value == null) {
            this.cancelClick();
          }
          this.initializeValues();
        }
      }
    }
  }

  ngOnDestroy() {
    this.eventSub.unsubscribe();
  }

  private initializeAbilities(): void {
    const abilities = this.collection.proficiencyCollection.abilities;
    this.abilities = [];
    abilities.forEach((ability: CreatureAbilityProficiency) => {
      if (ability.ability.sid === SID.ABILITIES.STRENGTH || ability.ability.sid === SID.ABILITIES.DEXTERITY) {
        this.abilities.push(ability);
      }
    });
  }

  private initializeSelectedAbility(): void {
    const ability = this.creatureItemService.getAttackAbility(this.item, this.creatureItemAction, this.collection);
    this.abilityChange(ability);
  }

  private initializeValues(): void {
    this.name = this.creatureItemService.getItemName(this.creatureItem);
    this.updateDisabledState();

    this.melee = this.creatureItemAction === CreatureItemAction.MELEE || this.creatureItemAction === CreatureItemAction.ATTACK;

    this.item = this.creatureItem.item;
    if (this.item.itemType === ItemType.WEAPON) {
      const weapon = this.item as Weapon;
      this.initializeWeapon(weapon);
    } else if (this.item.itemType === ItemType.MAGICAL_ITEM) {
      if (this.creatureItem.magicalItem != null && this.creatureItem.magicalItem.itemType === ItemType.WEAPON) {
        const weapon = this.creatureItem.magicalItem as Weapon;
        this.initializeWeapon(weapon);
      }
    } else {
      this.versatile = false;
      this.finesse = false;
    }
    this.range = this.creatureItemService.getItemRange(this.creatureItem, this.creatureItemAction);
    this.initializeSelectedAbility();
  }

  private initializeWeapon(weapon: Weapon): void {
    this.versatile = this.itemService.hasWeaponProperty(weapon, SID.WEAPON_PROPERTIES.VERSATILE);
    this.finesse = this.itemService.hasWeaponProperty(weapon, SID.WEAPON_PROPERTIES.FINESSE);

    if (this.versatile) {
      this.hasEmptyHand = true; //todo - check for empty hand
    }
    if (this.creatureItemAction === CreatureItemAction.THROW) {
      this.useThrow = true;
      if (this.showThrowSource) {
        this.initializeThrowSource();
      } else {
        this.throwItemToExpend = this.creatureItem;
        this.throwCount = this.throwItemToExpend == null ? 0 : this.throwItemToExpend.quantity;
        this.updateDisabledState();
      }
    }
    if (weapon.rangeType === WeaponRangeType.RANGED) {
      this.initializeAmmo(weapon);
    }
  }

  private initializeAmmo(weapon: Weapon): void {
    this.ammoType = weapon.ammoType
    this.useAmmo = this.creatureItemAction === CreatureItemAction.SHOOT && this.ammoType != null && this.itemService.hasWeaponProperty(weapon, SID.WEAPON_PROPERTIES.AMMUNITION);
    if (this.useAmmo) {
      this.initializeAmmos(weapon);
    }
    this.updateDisabledState();
  }

  private initializeAmmos(weapon: Weapon): void {
    this.ammos = this.getAmmos(weapon)
    if (this.ammos.length > 0) {
      let index = this.getAmmoIndex();
      if (index === -1) {
        index = 0;
      }
      this.ammoChange(this.ammos[index]);
    } else {
      this.ammoChange(null);
    }
  }

  private getAmmoIndex(): number {
    if (this.selectedAmmo == null) {
      return -1;
    }
    for (let i = 0; i < this.ammos.length; i++) {
      if (this.ammos[i].id === this.selectedAmmo.id) {
        return i;
      }
    }
    return -1;
  }

  ammoChange(ammo: CreatureItem): void {
    this.selectedAmmo = ammo;
    this.initializeDamages();
    this.initializeAmmoSources();
  }

  private initializeAmmoSources(): void {
    this.ammoSources = this.getAmmoSources(null, this.creatureItemService.getCarriedItems(this.creature.items));
    if (this.ammoSources.length > 0) {
      let index = this.getSelectedAmmoSourceIndex();
      if (index === -1) {
        index = 0;
      }
      this.ammoSourceChange(this.ammoSources[index]);
    } else {
      this.ammoSourceChange(null);
    }
  }

  private getSelectedAmmoSourceIndex(): number {
    if (this.selectedAmmoSource == null) {
      return -1;
    }
    for (let i = 0; i < this.ammoSources.length; i++) {
      if (this.ammoSources[i].id === this.selectedAmmoSource.id) {
        return i;
      }
    }
    return -1;
  }

  ammoSourceChange(source: CreatureItem): void {
    this.selectedAmmoSource = source;
    this.ammoItemToExpend = this.getAmmoItem();
    this.ammoCount = this.ammoItemToExpend == null ? 0 : this.ammoItemToExpend.quantity;
  }

  private getAmmoItem(): CreatureItem {
    let items = [];
    if (this.selectedAmmoSource != null) {
      items = this.selectedAmmoSource.items;
    }
    for (let i = 0; i < items.length; i++) {
      const creatureItem = items[i];
      if (creatureItem.item.id === this.selectedAmmo.item.id
        && creatureItem.silvered === this.selectedAmmo.silvered
        && creatureItem.poisoned === this.selectedAmmo.poisoned) {
        return creatureItem;
      }
    }

    return null;
  }

  private getAmmos(weapon: Weapon): CreatureItem[] {
    const ammos: CreatureItem[] = [];
    if (weapon.ammoType != null && weapon.ammoType.id !== '0') {
      const carriedItems = this.creatureItemService.getCarriedItems(this.creature.items);
      const uniqueCopies = this.creatureItemService.getUniqueAmmoCopies(weapon.ammoType.id, carriedItems);
      uniqueCopies.forEach((creatureItem: CreatureItem) => {
        let name = this.creatureItemService.getItemName(creatureItem);
        const properties = [];
        if (creatureItem.poisoned) {
          properties.push('P');
        }
        if (creatureItem.silvered) {
          properties.push('S');
        }
        if (creatureItem.attuned) {
          properties.push('A');
        }
        if (creatureItem.cursed) {
          properties.push('C');
        }
        const suffix = properties.join(', ');
        if (suffix !== '') {
          name += ' - ' + suffix;
        }

        const item = _.cloneDeep(creatureItem);
        item.name = name;
        ammos.push(item);
      });
    }
    return ammos;
  }

  private getAmmoSources(parent: CreatureItem, items: CreatureItem[]): CreatureItem[] {
    let sources: CreatureItem[] = [];
    if (this.selectedAmmo != null) {
      items.forEach((creatureItem: CreatureItem) => {
        if (creatureItem.creatureItemState === CreatureItemState.CARRIED || creatureItem.creatureItemState === CreatureItemState.EQUIPPED) {
          if (creatureItem.item.id === this.selectedAmmo.item.id
            && creatureItem.silvered === this.selectedAmmo.silvered
            && creatureItem.poisoned === this.selectedAmmo.poisoned) {
            if (parent == null) {
              parent = new CreatureItem();
              parent.name = this.translate.instant('Carried');
              parent.items = items;
            }
            sources.push(parent);
          }
          if (creatureItem.items.length > 0) {
            sources = sources.concat(this.getAmmoSources(creatureItem, creatureItem.items));
          }
        }
      });
    }

    return sources;
  }

  private initializeThrowSource(): void {
    this.throwSources = this.getEquippedThrowSources();
    if (this.attackWithUnequipped) {
      this.throwSources = this.throwSources.concat(this.getThrowSources(null, this.creatureItemService.getCarriedItems(this.creature.items, false)));
    }

    if (this.throwSources.length > 0) {
      let index = this.getSelectedThrowSourceIndex();
      if (index === -1) {
        index = 0;
      }
      this.throwSourceChange(this.throwSources[index]);
    } else {
      this.throwSourceChange(null);
    }
  }

  private getSelectedThrowSourceIndex(): number {
    if (this.selectedThrowSource == null) {
      return -1;
    }
    for (let i = 0; i < this.throwSources.length; i++) {
      if (this.throwSources[i].id === this.selectedThrowSource.id) {
        return i;
      }
    }
    return -1;
  }

  private getEquippedThrowSources(): CreatureItem[] {
    const equippedItems = this.creatureItemService.getEquippedItems(this.creature);
    const sources: CreatureItem[] = [];
    equippedItems.forEach((creatureItem: CreatureItem) => {
      if (creatureItem.equipmentSlot != null && creatureItem.equipmentSlot.equipmentSlotType === EquipmentSlotType.HAND) {
        if (this.matchesThrownItem(creatureItem)) {
          const source = new CreatureItem();
          source.id = creatureItem.equipmentSlot.id + '-equipped';
          source.name = creatureItem.equipmentSlot.name;
          source.items = [creatureItem];
          sources.push(source);
        }
      }
    });
    return sources;
  }

  private getThrowSources(parent: CreatureItem, items: CreatureItem[]): CreatureItem[] {
    let sources: CreatureItem[] = [];
    items.forEach((creatureItem: CreatureItem) => {
      if (this.matchesThrownItem(creatureItem)) {
        if (parent == null) {
          parent = new CreatureItem();
          parent.name = this.translate.instant('Carried');
          parent.items = items;
        }
        sources.push(parent);
      }
      if (creatureItem.items.length > 0) {
        sources = sources.concat(this.getThrowSources(creatureItem, creatureItem.items));
      }
    });

    return sources;
  }

  private matchesThrownItem(creatureItem: CreatureItem): boolean {
    return creatureItem.item.id === this.creatureItem.item.id
      && (
        (creatureItem.magicalItem == null && this.creatureItem.magicalItem == null)
        || (creatureItem.magicalItem != null && this.creatureItem.magicalItem != null && creatureItem.magicalItem.id === this.creatureItem.magicalItem.id)
      )
      && creatureItem.poisoned === this.creatureItem.poisoned
      && creatureItem.silvered === this.creatureItem.silvered;
  }

  throwSourceChange(source: CreatureItem): void {
    this.selectedThrowSource = source;
    this.throwItemToExpend = this.getThrowItem();
    this.throwCount = this.throwItemToExpend == null ? 0 : this.throwItemToExpend.quantity;
    this.updateDisabledState();
  }

  private getThrowItem(): CreatureItem {
    let items: CreatureItem[] = [];
    if (this.selectedThrowSource != null) {
      items = this.selectedThrowSource.items;
    }
    for (let i = 0; i < items.length; i++) {
      const creatureItem = items[i];
      if (this.matchesThrownItem(creatureItem)) {
        return creatureItem;
      }
    }

    return null;
  }

  private initializeDamages(): void {
    if (this.versatile && this.twoHanded) {
      this.damageConfigurationCollection = this.creatureItemService.getItemDamagesByAbility(this.ability, this.item, this.creatureItem, this.creature, this.collection, true, this.melee);
    } else {
      this.damageConfigurationCollection = this.creatureItemService.getItemDamagesByAbility(this.ability, this.item, this.creatureItem, this.creature, this.collection, false, this.melee);
    }

    if (this.selectedAmmo != null) {
      let ammoDamages: DamageConfiguration[] = [];
      if (this.selectedAmmo.item.itemType === ItemType.AMMO) {
        const ammo = this.selectedAmmo.item as Ammo;
        ammoDamages = ammo.damages;
      } else if (this.selectedAmmo.item.itemType === ItemType.MAGICAL_ITEM) {
        const magicalAmmo = this.selectedAmmo.item as MagicalItem;
        if (magicalAmmo.magicalItemType === MagicalItemType.AMMO) {
          ammoDamages = magicalAmmo.damages;
          if (magicalAmmo.attackMod !== 0) {
            this.damageConfigurationCollection.attackMod += magicalAmmo.attackMod;
            this.damageConfigurationCollection.attackModTooltip += `\n${this.creatureItemService.getItemName(this.selectedAmmo)}: ${this.abilityService.convertScoreToString(magicalAmmo.attackMod)}`;
          }

          if (this.selectedAmmo.magicalItem != null && this.selectedAmmo.magicalItem.itemType === ItemType.AMMO) {
            const baseAmmo = this.selectedAmmo.magicalItem as Ammo;
            ammoDamages = ammoDamages.concat(baseAmmo.damages);
          }
        }
      }

      if (ammoDamages.length > 0) {
        this.damageConfigurationCollection.damageConfigurations = this.damageConfigurationCollection.damageConfigurations.concat(ammoDamages);
        this.damageConfigurationCollection.damageConfigurations = this.powerService.combineDamages(this.damageConfigurationCollection.damageConfigurations);
      }
    }
  }

  private initializeProficiency(): void {
    this.attackProficiency = new Proficiency();
    const abilityScore = this.creatureService.getAbilityScore(this.ability, this.collection);
    const modifier = this.abilityService.getAbilityModifier(abilityScore);
    this.attackProficiency.miscModifier = modifier - this.creature.creatureHealth.resurrectionPenalty;

    if (this.creature.creatureType === CreatureType.CHARACTER) {
      const playerCharacter = this.creature as PlayerCharacter;
      if (this.characterService.hasModifiedAttackRollDisadvantage(playerCharacter, this.collection, this.ability.ability.sid)) {
        this.attackProficiency.disadvantage = true;
        this.attackProficiency.disadvantageDisabled = true;
        this.attackProficiency.disadvantageTooltip = this.characterService.getModifiedAbilityCheckDisadvantageTooltip(playerCharacter, this.collection, this.ability.ability.sid);
      }
    } else {
      if (this.creatureService.hasModifiedAttackRollDisadvantage(this.creature, this.ability.ability.sid, this.collection)) {
        this.attackProficiency.disadvantage = true;
        this.attackProficiency.disadvantageDisabled = true;
        this.attackProficiency.disadvantageTooltip = this.creatureService.getModifiedAbilityCheckDisadvantageTooltip(this.creature, this.ability.ability.sid, null, this.collection);
      }
    }
  }

  abilityChange(ability: CreatureAbilityProficiency): void {
    this.ability = ability;
    this.initializeProficiency();
    this.initializeDamages();
  }

  versatileChange(twoHanded: boolean): void {
    this.twoHanded = twoHanded;
    this.initializeDamages();
  }

  continueClick(): void {
    if (this.creatureItemAction === CreatureItemAction.THROW && this.throwItemToExpend != null) {
      this.creatureItemService.performAction(CreatureItemAction.DROP, this.creature, this.throwItemToExpend, 1).then(() => {
        this.eventsService.dispatchEvent(EVENTS.FetchItemsList);
        if (!this.showThrowSource && this.throwCount === 1) {
          this.continue.emit();
        }
      });
    } else if (this.creatureItemAction === CreatureItemAction.SHOOT && this.ammoItemToExpend != null) {
      this.creatureItemService.performAction(CreatureItemAction.EXPEND, this.creature, this.ammoItemToExpend, 1).then(() => {
        this.eventsService.dispatchEvent(EVENTS.FetchItemsList);
      });
    }
    this.rollAttack();
  }

  private rollAttack(): void {
    const attackRequest = this.getAttackRequest();
    const damageRequest = this.getDamageRequest();

    this.creatureService.rollAttackDamage(this.creature, attackRequest, damageRequest).then((roll: Roll) => {
      this.showAttackResult(roll);
    });
  }

  private showAttackResult(roll: Roll): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = new RollResultDialogData(this.creature, roll);
    this.dialog.open(RollResultDialogComponent, dialogConfig);
  }

  private getAttackRequest(): RollRequest {
    return this.diceService.getAttackRollRequest(
      this.creatureItemService.getItemName(this.creatureItem),
      this.damageConfigurationCollection.attackMod,
      false,
      this.attackProficiency.advantage,
      this.attackProficiency.disadvantage);
  }

  private getDamageRequest(): RollRequest {
    const damages = this.damageConfigurationCollection.damageConfigurations;
    return this.diceService.getDamageRollRequest(this.creatureItemService.getItemName(this.creatureItem), damages);
  }

  cancelClick(): void {
    this.cancel.emit();
  }

  private updateDisabledState(): void {
    this.disabled = this.creatureItem.creatureItemState === CreatureItemState.DROPPED
      || (this.creatureItem.creatureItemState === CreatureItemState.CARRIED && !this.attackWithUnequipped)
      || (this.useThrow && this.throwCount === 0)
      || (this.useAmmo && this.ammoCount === 0);
  }

}
