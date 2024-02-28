import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ButtonAction} from '../../../shared/models/button/button-action';
import {
  ImportActionEvent,
  ImportArmorType,
  ImportCasterType,
  ImportCondition,
  ImportEquipmentObject,
  ImportFeature,
  ImportItemConfiguration,
  ImportLanguage,
  ImportMagicalItem,
  ImportMonster,
  ImportSkill,
  ImportSpell,
  ImportWeaponProperty
} from '../../../shared/imports/import-item';
import {TranslateService} from '@ngx-translate/core';
import {ImportService} from '../../../core/services/import/import.service';
import {ListObject} from '../../../shared/models/list-object';
import {ArmorType} from '../../../shared/models/attributes/armor-type';
import {CasterType} from '../../../shared/models/attributes/caster-type';
import {Background} from '../../../shared/models/characteristics/background';
import {CharacterClass} from '../../../shared/models/characteristics/character-class';
import {Condition} from '../../../shared/models/attributes/condition';
import {Feature} from '../../../shared/models/powers/feature';
import {Language} from '../../../shared/models/attributes/language';
import {Race} from '../../../shared/models/characteristics/race';
import {Skill} from '../../../shared/models/attributes/skill';
import {Spell} from '../../../shared/models/powers/spell';
import {WeaponProperty} from '../../../shared/models/attributes/weapon-property';
import {PlayerCharacter} from '../../../shared/models/creatures/characters/player-character';
import {Monster, MonsterAction, MonsterFeature} from '../../../shared/models/creatures/monsters/monster';
import {Item} from '../../../shared/models/items/item';
import {AttributeService} from '../../../core/services/attributes/attribute.service';
import {CharacteristicService} from '../../../core/services/characteristics/characteristic.service';
import {PowerService} from '../../../core/services/powers/power.service';
import {ItemService} from '../../../core/services/items/item.service';
import {CreatureService} from '../../../core/services/creatures/creature.service';
import {Attribute} from '../../../shared/models/attributes/attribute';
import {Creature} from '../../../shared/models/creatures/creature';
import {Power} from '../../../shared/models/powers/power';
import {Characteristic} from '../../../shared/models/characteristics/characteristic';
import {ImportAttributeService} from '../../../core/services/import/import-attribute.service';
import {ImportCharacteristicService} from '../../../core/services/import/import-characteristic.service';
import {ImportPowerService} from '../../../core/services/import/import-power.service';
import {ImportItemService} from '../../../core/services/import/import-item.service';
import {ImportCreatureService} from '../../../core/services/import/import-creature.service';
import {ConfirmDialogData} from '../../../core/components/confirm-dialog/confirmDialogData';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ConfirmDialogComponent} from '../../../core/components/confirm-dialog/confirm-dialog.component';
import {CreatureItem} from '../../../shared/models/creatures/creature-item';
import {ItemType} from '../../../shared/models/items/item-type.enum';
import {MagicalItem} from '../../../shared/models/items/magical-item';
import {MagicalItemType} from '../../../shared/models/items/magical-item-type.enum';
import {ImportCacheService} from '../../../core/services/import/import-cache.service';
import {ImportMonsterService} from '../../../core/services/import/import-monster.service';
import {MonsterService} from '../../../core/services/creatures/monster.service';

@Component({
  selector: 'app-compare-import',
  templateUrl: './compare-import.component.html',
  styleUrls: ['./compare-import.component.scss']
})
export class CompareImportComponent implements OnInit {
  @Input() config: ImportItemConfiguration;
  @Output() save = new EventEmitter();
  @Output() close = new EventEmitter();

  loading = true;
  buttonActions: ButtonAction[] = [];
  showExisting = false;
  selectedDuplicate: ListObject  = null;

  isItem = false;

  //attributes
  armorType: ArmorType = null;
  casterType: CasterType = null;
  condition: Condition = null;
  language: Language = null;
  skill: Skill = null;
  weaponProperty: WeaponProperty = null;

  existingArmorType: ArmorType = null;
  existingCasterType: CasterType = null;
  existingCondition: Condition = null;
  existingLanguage: Language = null;
  existingSkill: Skill = null;
  existingWeaponProperty: WeaponProperty = null;

  //characteristics
  background: Background = null;
  characterClass: CharacterClass = null;
  race: Race = null;

  existingBackground: Background = null;
  existingCharacterClass: CharacterClass = null;
  existingRace: Race = null;

  //powers
  feature: Feature = null;
  spell: Spell = null;
  existingFeature: Feature = null;
  existingSpell: Spell = null;

  //items
  creatureItem: CreatureItem = null;
  existingCreatureItem: CreatureItem = null;

  //creatures
  playerCharacter: PlayerCharacter = null;
  // existingPlayerCharacter: PlayerCharacter = null;

  //monsters
  monster: Monster = null;
  monsterActions: MonsterAction[] = [];
  monsterFeatures: MonsterFeature[] = [];
  existingMonster: Monster = null;
  existingMonsterActions: MonsterAction[] = [];
  existingMonsterFeatures: MonsterFeature[] = [];

  constructor(
    private importService: ImportService,
    private importCacheService: ImportCacheService,
    private importAttributeService: ImportAttributeService,
    private importCharacteristicService: ImportCharacteristicService,
    private importPowerService: ImportPowerService,
    private importItemService: ImportItemService,
    private importCreatureService: ImportCreatureService,
    private importMonsterService: ImportMonsterService,
    private translate: TranslateService,
    private attributeService: AttributeService,
    private characteristicService: CharacteristicService,
    private powerService: PowerService,
    private itemService: ItemService,
    private creatureService: CreatureService,
    private monsterService: MonsterService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.initializeSelectedDuplicate();
    this.initializeObject();
  }

  private initializeSelectedDuplicate(): void {
    if (this.config.importItem.finalId != null || this.config.importItem.duplicates == null || this.config.importItem.duplicates.length === 0) {
      this.selectionChange(null);
      return;
    }
    if (this.config.importItem.selectedDuplicate != null) {
      for (let i = 0; i < this.config.importItem.duplicates.length; i++) {
        const duplicate = this.config.importItem.duplicates[i];
        if (duplicate.id === this.config.importItem.selectedDuplicate.id) {
          this.selectionChange(duplicate);
          return;
        }
      }
    }

    if (this.config.importItem.duplicates.length > 0) {
      this.selectionChange(this.config.importItem.duplicates[0]);
    } else {
      this.selectionChange(null);
    }
  }

  private initializeObject(): void {
    this.isItem = false;
    const promises: Promise<any>[] = [];
    switch (this.config.importItem.type) {
      case 'ArmorType':
        this.armorType = this.importAttributeService.getArmorType(this.config.importItem as ImportArmorType);
        break;
      case 'Background':
        promises.push(this.importCharacteristicService.getBackground(this.config).then((background: Background) => {
          this.background = background;
        }));
        break;
      case 'CasterType':
        this.casterType = this.importAttributeService.getCasterType(this.config.importItem as ImportCasterType);
        break;
      case 'CharacterClass':
        promises.push(this.importCharacteristicService.getCharacterClass(this.config).then((characterClass: CharacterClass) => {
          this.characterClass = characterClass;
        }));
        break;
      case 'Subclass':
        promises.push(this.importCharacteristicService.getSubclass(this.config).then((characterClass: CharacterClass) => {
          this.characterClass = characterClass;
        }));
        break;
      case 'Condition':
        this.condition = this.importAttributeService.getCondition(this.config.importItem as ImportCondition);
        break;
      case 'Feature':
        promises.push(this.importPowerService.getFeature(this.config.importItem as ImportFeature).then((feature: Feature) => {
          this.feature = feature;
        }));
        break;
      case 'AmmoCategory':
      case 'Ammo':
      case 'BasicAmmo':
      case 'ArmorCategory':
      case 'Armor':
      case 'BasicArmor':
      case 'ContainerCategory':
      case 'GearCategory':
      case 'Gear':
      case 'MountCategory':
      case 'Mount':
      case 'BasicMount':
      case 'Tool':
      case 'ToolCategory':
      case 'WeaponCategory':
      case 'Weapon':
      case 'BasicWeapon':
      case 'MagicalItem':
      case 'MagicalItemCategory':
      case 'Treasure':
      case 'TreasureCategory':
      case 'Pack':
      case 'PackCategory':
      case 'EmptySlotItem':
        this.isItem = true;
        promises.push(this.importItemService.getCreatureItem(this.config.importItem).then((creatureItem: CreatureItem) => {
          this.creatureItem = creatureItem;
        }));
        break;
      case 'Language':
        this.language = this.importAttributeService.getLanguage(this.config.importItem as ImportLanguage);
        break;
      case 'Race':
        promises.push(this.importCharacteristicService.getRace(this.config).then((race: Race) => {
          this.race = race;
        }));
        break;
      case 'Skill':
        this.skill = this.importAttributeService.getSkill(this.config.importItem as ImportSkill);
        break;
      case 'Spell':
        promises.push(this.importPowerService.getSpell(this.config.importItem as ImportSpell).then((spell: Spell) => {
          this.spell = spell;
        }));
        break;
      case 'WeaponProperty':
        this.weaponProperty = this.importAttributeService.getWeaponProperty(this.config.importItem as ImportWeaponProperty);
        break;
      case 'Character':
        promises.push(this.importCreatureService.getPlayerCharacter(this.config).then((playerCharacter: PlayerCharacter) => {
          this.playerCharacter = playerCharacter;
        }));
        break;
      case 'Monster':
        promises.push(this.importMonsterService.getMonster(this.config).then((monster: Monster) => {
          this.monster = monster;
        }));
        promises.push(this.importMonsterService.getMonsterActions(this.config).then((actions: MonsterAction[]) => {
          this.monsterActions = actions;
        }));
        this.monsterFeatures = this.importMonsterService.getMonsterFeatures(this.config);
        break;
    }

    Promise.all(promises).then(() => {
      if (this.config.importItem.duplicates == null || this.config.importItem.duplicates.length === 0) {
        this.loading = false;
      }
    });
  }

  private initializeButtonActions(): void {
    this.buttonActions = [];
    if (this.config.importItem.status !== 'COMPLETE') {
      if (this.config.importItem.duplicates != null && this.config.importItem.duplicates.length > 0) {
        this.showExisting = true;
        const useExisting = new ButtonAction('USE_EXISTING', this.translate.instant('Imports.Action.USE_EXISTING'), null, this.config.useExistingDisabled);
        useExisting.icon = 'far fa-dot-circle use-existing';
        useExisting.selected = this.config.importItem.selectedAction === 'USE_EXISTING';
        this.buttonActions.push(useExisting);

        const replaceExistingDisabled = this.selectedDuplicate == null || !this.selectedDuplicate.author || this.config.useExistingDisabled;
        const replaceExisting = new ButtonAction('REPLACE_EXISTING', this.translate.instant('Imports.Action.REPLACE_EXISTING'), null, replaceExistingDisabled);
        replaceExisting.selected = this.config.importItem.selectedAction === 'REPLACE_EXISTING';
        replaceExisting.icon = 'fas fa-sync-alt replace-existing';
        this.buttonActions.push(replaceExisting);
      }
      const insertAsNew = new ButtonAction('INSERT_AS_NEW', this.translate.instant('Imports.Action.INSERT_AS_NEW'), null, this.config.insertAsNewDisabled);
      insertAsNew.icon = 'fas fa-plus-circle insert-as-new';
      insertAsNew.selected = this.config.importItem.selectedAction === 'INSERT_AS_NEW';
      this.buttonActions.push(insertAsNew);
      const skipEntry = new ButtonAction('SKIP_ENTRY', this.translate.instant('Imports.Action.SKIP_ENTRY'), null, this.config.skipDisabled);
      skipEntry.icon = 'fas fa-minus-circle skip-entry';
      skipEntry.selected = this.config.importItem.selectedAction === 'SKIP_ENTRY';
      this.buttonActions.push(skipEntry);
    }
  }

  primaryClick(action: ButtonAction): void {
    const selectedAction = action.event as ImportActionEvent;
    if ((selectedAction === 'SKIP_ENTRY' || selectedAction === 'INSERT_AS_NEW') && this.config.cascadeParentAction) {
      const data = new ConfirmDialogData();
      data.title = this.translate.instant('Imports.CascadeActionConfirmation.Title')
      data.message = this.translate.instant('Imports.CascadeActionConfirmation.Message');
      data.confirm = () => {
        this.continuePrimaryClick(selectedAction);
      };
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.data = data;
      this.dialog.open(ConfirmDialogComponent, dialogConfig);
    } else {
      this.continuePrimaryClick(selectedAction);
    }
  }

  private continuePrimaryClick(selectedAction: ImportActionEvent): void {
    if (selectedAction === 'USE_EXISTING' || selectedAction === 'REPLACE_EXISTING') {
      this.importService.updateSelectedDuplicate(this.config, this.selectedDuplicate);
    }
    this.importService.updateSelectedAction(this.config, selectedAction);
    this.save.emit();
  }

  closeDetails(): void {
    this.close.emit();
  }

  private clearExistingItem(): void {
    this.existingArmorType = null;
    this.existingCasterType = null;
    this.existingCondition = null;
    this.existingLanguage = null;
    this.existingSkill = null;
    this.existingWeaponProperty = null;
    this.existingBackground = null;
    this.existingCharacterClass = null;
    this.existingRace = null;
    this.existingFeature = null;
    this.existingSpell = null;
    this.existingCreatureItem = null;
    // this.existingPlayerCharacter = null;
    this.existingMonster = null;
  }

  selectionChange(selectedDuplicate: ListObject): void {
    this.loading = true;
    this.selectedDuplicate = selectedDuplicate;
    this.initializeButtonActions();
    if (this.selectedDuplicate == null) {
      this.clearExistingItem();
      this.loading = false;
      return;
    }

    switch (this.config.importItem.type) {
      case 'ArmorType':
      case 'CasterType':
      case 'Condition':
      case 'Language':
      case 'Skill':
      case 'WeaponProperty':
        this.initializeExistingAttribute();
        break;
      case 'Background':
      case 'CharacterClass':
      case 'Subclass':
      case 'Race':
        this.initializeExistingCharacteristic();
        break;
      case 'Feature':
      case 'Spell':
        this.initializeExistingPower();
        break;
      case 'AmmoCategory':
      case 'Ammo':
      case 'BasicAmmo':
      case 'ArmorCategory':
      case 'Armor':
      case 'BasicArmor':
      case 'ContainerCategory':
      case 'GearCategory':
      case 'Gear':
      case 'MountCategory':
      case 'Mount':
      case 'BasicMount':
      case 'Tool':
      case 'ToolCategory':
      case 'WeaponCategory':
      case 'Weapon':
      case 'BasicWeapon':
      case 'MagicalItem':
      case 'MagicalItemCategory':
      case 'Treasure':
      case 'TreasureCategory':
      case 'Pack':
      case 'PackCategory':
      case 'EmptySlotItem':
        this.initializeExistingItem();
        break;
      // case 'Character':
      //   this.initializeExistingCreature();
      //   break;
      case 'Monster':
        this.initializeExistingMonster();
        break;
    }
  }

  private initializeExistingAttribute(): void {
    //todo - check for perfect match?

    this.attributeService.getAttribute(this.selectedDuplicate.id).then((attribute: Attribute) => {
      switch (this.config.importItem.type) {
        case 'ArmorType':
          this.existingArmorType = attribute as ArmorType;
          break;
        case 'CasterType':
          this.existingCasterType = attribute as CasterType;
          break;
        case 'Condition':
          this.existingCondition = attribute as Condition;
          break;
        case 'Language':
          this.existingLanguage = attribute as Language;
          break;
        case 'Skill':
          this.existingSkill = attribute as Skill;
          break;
        case 'WeaponProperty':
          this.existingWeaponProperty = attribute as WeaponProperty;
          break;
      }
      this.loading = false;
    });
  }

  private initializeExistingCharacteristic(): void {
    this.characteristicService.getCharacteristic(this.selectedDuplicate.id).then((characteristic: Characteristic) => {
      switch (this.config.importItem.type) {
        case 'Background':
          this.existingBackground = characteristic as Background;
          break;
        case 'CharacterClass':
        case 'Subclass':
          this.existingCharacterClass = characteristic as CharacterClass;
          break;
        case 'Race':
          this.existingRace = characteristic as Race;
          break;
      }
      this.loading = false;
    });
  }

  private initializeExistingPower(): void {
    this.powerService.getPower(this.selectedDuplicate.id).then((power: Power) => {
      switch (this.config.importItem.type) {
        case 'Feature':
          this.existingFeature = power as Feature;
          break;
        case 'Spell':
          this.existingSpell = power as Spell;
          break;
      }
      this.loading = false;
    });
  }

  private initializeExistingItem(): void {
    this.itemService.getItem(this.selectedDuplicate.id).then((item: Item) => {
      const creatureItem = new CreatureItem();
      creatureItem.item = item;
      this.getExistingSubItem(item).then((subItem: Item) => {
        creatureItem.magicalItem = subItem;
        this.existingCreatureItem = creatureItem;
      });
      this.loading = false;
    });
  }

  private async getExistingSubItem(item: Item): Promise<Item> {
    if (item.itemType === ItemType.MAGICAL_ITEM && this.config.importItem.type === 'MagicalItem') {
      const magicalItem = item as MagicalItem;
      const importMagicalItem = this.config.importItem as ImportMagicalItem;
      let importSubItem: ImportEquipmentObject = null;
      let itemType: ItemType = ItemType.WEAPON;

      if (magicalItem.magicalItemType === MagicalItemType.WEAPON && importMagicalItem.chosenWeapon != null) {
        importSubItem = importMagicalItem.chosenWeapon;
        itemType = ItemType.WEAPON;
      } else if (magicalItem.magicalItemType === MagicalItemType.AMMO && importMagicalItem.chosenAmmo != null) {
        importSubItem = importMagicalItem.chosenAmmo;
        itemType = ItemType.AMMO;
      } else if (magicalItem.magicalItemType === MagicalItemType.ARMOR && importMagicalItem.chosenArmor != null) {
        importSubItem = importMagicalItem.chosenArmor;
        itemType = ItemType.ARMOR;
      }

      if (importSubItem != null) {
        await this.importCacheService.getItemsByType(itemType);
        const cachedItem: ListObject = this.importItemService.getCachedItemByName(itemType, importSubItem.name);
        if (cachedItem != null) {
          return this.itemService.getItem(cachedItem.id);
        } else {
          return Promise.resolve(null);
        }
      } else {
        return Promise.resolve(null);
      }
    }
    return Promise.resolve(null);
  }

  private initializeExistingMonster(): void {
    this.monsterService.getMonster(this.selectedDuplicate.id).then((monster: Monster) => {
      this.existingMonster = monster;
      this.existingMonsterActions = []; //todo
      this.existingMonsterFeatures = []; //todo
      this.loading = false;
    });
  }

}
