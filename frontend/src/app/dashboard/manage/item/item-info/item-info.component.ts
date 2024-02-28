import {ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {EventsService} from '../../../../core/services/events.service';
import {NotificationService} from '../../../../core/services/notification.service';
import {TranslateService} from '@ngx-translate/core';
import {Observable, Subscription} from 'rxjs';
import {ComponentCanDeactivate} from '../../../../core/guards/pending-changes.guard';
import {Item} from '../../../../shared/models/items/item';
import {ItemService} from '../../../../core/services/items/item.service';
import * as _ from 'lodash';
import {EVENTS, NAVIGATION_DELAY, SKIP_LOCATION_CHANGE} from '../../../../constants';
import {ItemType} from '../../../../shared/models/items/item-type.enum';
import {Gear} from '../../../../shared/models/items/gear';
import {Tool} from '../../../../shared/models/items/tool';
import {Armor} from '../../../../shared/models/items/armor';
import {Weapon} from '../../../../shared/models/items/weapon';
import {Ammo} from '../../../../shared/models/items/ammo';
import {Mount} from '../../../../shared/models/items/mount';
import {Treasure} from '../../../../shared/models/items/treasure';
import {Pack} from '../../../../shared/models/items/pack';
import {MagicalItem} from '../../../../shared/models/items/magical-item';
import {WeaponPropertyConfigurationCollection} from '../../../../shared/models/items/weapon-property-configuration-collection';
import {WeaponService} from '../../../../core/services/items/weapon.service';
import {DamageConfigurationCollection} from '../../../../shared/models/damage-configuration-collection';
import {AmmoService} from '../../../../core/services/items/ammo.service';
import {Vehicle} from '../../../../shared/models/items/vehicle';
import {ImportItem} from '../../../../shared/imports/import-item';
import {ImportService} from '../../../../core/services/import/import.service';
import {MagicalItemType} from '../../../../shared/models/items/magical-item-type.enum';
import {MagicalItemAttunementType} from '../../../../shared/models/items/magical-item-attunement-type.enum';
import {PublishRequest} from '../../../../shared/models/publish-request';
import {SharingItemService} from '../../../../core/services/sharing/sharing-item.service';
import {VersionInfo} from '../../../../shared/models/version-info';
import {PublishDetails} from '../../../../shared/models/publish-details';
import {ListSource} from '../../../../shared/models/list-source.enum';
import {ExportItemService} from '../../../../core/services/export/export-item.service';
import {ManageListItem} from '../../../../shared/components/manage-list/manage-list.component';
import {ListObject} from '../../../../shared/models/list-object';
import {ExportDialogService} from '../../../../core/services/export/export-dialog.service';
import {MenuItem} from '../../../../shared/models/menuItem.model';

@Component({
  selector: 'app-item-info',
  templateUrl: './item-info.component.html',
  styleUrls: ['./item-info.component.scss']
})
export class ItemInfoComponent implements OnInit, OnDestroy, ComponentCanDeactivate {
  public itemForm: FormGroup;
  id: string;
  item: Item;
  originalItem: Item;
  editing = false;
  itemName = '';
  cancelable = true;
  loading = false;

  itemTypes: ItemType[] = [];
  selectedCategory: ItemType = ItemType.WEAPON;
  isWeapon = false;
  isArmor = false;
  isMagicalItem = false;
  isGear = false;
  isTool = false;
  isAmmo = false;
  isMount = false;
  isVehicle = false;
  isTreasure = false;
  isPack = false;

  weapon: Weapon = new Weapon();
  weaponPropertyCollection: WeaponPropertyConfigurationCollection = new WeaponPropertyConfigurationCollection();
  originalWeaponPropertyCollection: WeaponPropertyConfigurationCollection = new WeaponPropertyConfigurationCollection();
  weaponDamageCollection: DamageConfigurationCollection = new DamageConfigurationCollection();
  originalWeaponDamageCollection: DamageConfigurationCollection = new DamageConfigurationCollection();

  armor: Armor = new Armor();
  gear: Gear = new Gear();
  tool: Tool = new Tool();

  ammo: Ammo = new Ammo();
  ammoDamageCollection: DamageConfigurationCollection = new DamageConfigurationCollection();
  originalAmmoDamageCollection: DamageConfigurationCollection = new DamageConfigurationCollection();

  mount: Mount = new Mount();
  treasure: Treasure = new Treasure();
  pack: Pack = new Pack();
  magicalItem: MagicalItem = new MagicalItem();
  vehicle: Vehicle = new Vehicle();
  routeSub: Subscription;
  queryParamsSub: Subscription;

  importing = false;
  importItem: ImportItem = null;
  viewShare = false;
  publishDetails: PublishDetails;
  versionInfo: VersionInfo;
  isPublic = false;
  isShared = false;
  listSource: ListSource = ListSource.MY_STUFF;
  exportable = true;

  constructor(
    public itemService: ItemService,
    private sharingItemService: SharingItemService,
    private route: ActivatedRoute,
    private weaponService: WeaponService,
    private ammoService: AmmoService,
    private eventsService: EventsService,
    private router: Router,
    private cd: ChangeDetectorRef,
    private fb: FormBuilder,
    private notificationService: NotificationService,
    private translate: TranslateService,
    private importService: ImportService,
    private exportDialogService: ExportDialogService,
    private exportDetailsService: ExportItemService
  ) {
  }

  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    return !this.editing;
  }

  ngOnInit() {
    this.initializeItemTypes();
    this.item = new Item();
    this.originalItem = this.createCopyOfItem(this.item);
    this.itemForm = this.createForm();

    this.routeSub = this.route.params.subscribe((params: { id: string }) => {
      this.loading = true;
      this.id = params.id;
      this.editing = this.id === '0';
      this.cancelable = this.id !== '0';
      this.initializeData();
    });

    this.queryParamsSub = this.route.queryParams
      .subscribe((params: {public: string, shared: string}) => {
        this.isPublic = params.public != null && params.public === 'true';
        this.isShared = params.shared != null && params.shared === 'true';
        if (this.isPublic) {
          this.listSource = ListSource.PUBLIC_CONTENT;
        } else if (this.isShared) {
          this.listSource = ListSource.PRIVATE_CONTENT;
        } else {
          this.listSource = ListSource.MY_STUFF;
        }
      });
  }

  private initializeData(): void {
    if (this.id === '0') {
      this.itemName = this.translate.instant('Navigation.Manage.Items.New');
      this.resetDefaultItems();
      this.updateItem(new Item());
      this.updateItemTypeFlags();
      this.initializeWeapon();
      this.initializeAmmo();
    } else {
      this.itemService.getVersionInfo(this.id).then((versionInfo: VersionInfo) => {
        this.versionInfo = versionInfo;
      });
      this.itemService.getItem(this.id).then((item: Item) => {
        if (item == null) {
          const translatedMessage = this.translate.instant('Error.Load');
          this.notificationService.error(translatedMessage);
          this.loading = false;
        } else {
          this.itemName = item.name;
          this.updateItem(item);
        }
      });
    }
  }

  initializeItemTypes(): void {
    this.itemTypes = [];
    this.itemTypes.push(ItemType.WEAPON);
    this.itemTypes.push(ItemType.ARMOR);
    this.itemTypes.push(ItemType.GEAR);
    this.itemTypes.push(ItemType.TOOL);
    this.itemTypes.push(ItemType.AMMO);
    this.itemTypes.push(ItemType.MOUNT);
    this.itemTypes.push(ItemType.MAGICAL_ITEM);
    this.itemTypes.push(ItemType.VEHICLE);
    this.itemTypes.push(ItemType.TREASURE);
    this.itemTypes.push(ItemType.PACK);
  }

  categoryChange(category: ItemType): void {
    this.selectedCategory = category;
    this.updateItemTypeFlags();
  }

  private updateItemTypeFlags(): void {
    this.isWeapon = this.selectedCategory === ItemType.WEAPON;
    this.isArmor = this.selectedCategory === ItemType.ARMOR;
    this.isMagicalItem = this.selectedCategory === ItemType.MAGICAL_ITEM;
    this.isGear = this.selectedCategory === ItemType.GEAR;
    this.isTool = this.selectedCategory === ItemType.TOOL;
    this.isAmmo = this.selectedCategory === ItemType.AMMO;
    this.isMount = this.selectedCategory === ItemType.MOUNT;
    this.isVehicle = this.selectedCategory === ItemType.VEHICLE;
    this.isTreasure = this.selectedCategory === ItemType.TREASURE;
    this.isPack = this.selectedCategory === ItemType.PACK;
  }

  /************************************ End Helpers *******************************/

  createForm(): FormGroup {
    return this.fb.group(
      {
        name: [null, Validators.compose([Validators.required])]
      }
    );
  }

  updateItem(item: Item): void {
    this.loading = true;
    this.item = item;
    this.originalItem = this.createCopyOfItem(this.item);
    this.updateItemType(this.item);
    this.itemForm.controls['name'].setValue(item.name);
    this.exportable = this.item.itemType !== ItemType.VEHICLE;
    this.cd.detectChanges();
    this.loading = false;
  }

  initializeWeapon(): void {
    this.weaponService.initializePropertyConfigurations(this.weapon).then((collection: WeaponPropertyConfigurationCollection) => {
      this.weaponPropertyCollection = collection;
      this.originalWeaponPropertyCollection = this.weaponService.createCopyOfPropertyConfigurationCollection(collection);
    });
    this.weaponDamageCollection = this.weaponService.initializeDamageConfigurations(this.weapon);
    this.originalWeaponDamageCollection = this.weaponService.createCopyOfDamageConfigurationCollection(this.weaponDamageCollection);
  }

  initializeAmmo(): void {
    this.ammoDamageCollection = this.ammoService.initializeDamageConfigurations(this.ammo);
    this.originalAmmoDamageCollection = this.ammoService.createCopyOfDamageConfigurationCollection(this.ammoDamageCollection);
  }

  updateItemType(item: Item): void {
    if (item.itemType == null) {
      return;
    }
    this.categoryChange(item.itemType)
    switch (item.itemType) {
      case ItemType.WEAPON:
        this.weapon = item as Weapon;
        this.initializeWeapon();
        break;
      case ItemType.ARMOR:
        this.armor = item as Armor;
        break;
      case ItemType.GEAR:
        this.gear = item as Gear;
        break;
      case ItemType.TOOL:
        this.tool = item as Tool;
        break;
      case ItemType.AMMO:
        this.ammo = item as Ammo;
        this.initializeAmmo();
        break;
      case ItemType.MOUNT:
        this.mount = item as Mount;
        break;
      case ItemType.TREASURE:
        this.treasure = item as Treasure;
        break;
      case ItemType.PACK:
        this.pack = item as Pack;
        break;
      case ItemType.MAGICAL_ITEM:
        this.magicalItem = item as MagicalItem;
        break;
      case ItemType.VEHICLE:
        this.vehicle = item as Vehicle;
        break;
    }
  }

  createCopyOfItem(item: Item): Item {
    return _.cloneDeep(item);
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
    this.queryParamsSub.unsubscribe();
  }

  close(): void {
    setTimeout(() => {
      this.router.navigate(['/home/dashboard', {outlets: {'middle-nav': ['default']}}], {skipLocationChange: SKIP_LOCATION_CHANGE});
    }, NAVIGATION_DELAY);
  }

  getItem(): Item {
    switch (this.selectedCategory) {
      case ItemType.WEAPON:
        return this.weapon;
      case ItemType.ARMOR:
        return this.armor;
      case ItemType.GEAR:
        return this.gear;
      case ItemType.TOOL:
        return this.tool;
      case ItemType.AMMO:
        return this.ammo;
      case ItemType.MOUNT:
        return this.mount;
      case ItemType.TREASURE:
        return this.treasure;
      case ItemType.PACK:
        return this.pack;
      case ItemType.MAGICAL_ITEM:
        return this.magicalItem;
      case ItemType.VEHICLE:
        return this.vehicle;
    }
    return null;
  }

  private isValid(): boolean {
    switch (this.item.itemType) {
      case ItemType.MAGICAL_ITEM:
        const magicalItem = this.item as MagicalItem;
        switch (magicalItem.magicalItemType) {
          case MagicalItemType.ARMOR:
            if (magicalItem.applicableArmors.length === 0) {
              this.notificationService.error(this.translate.instant('Error.MagicalItemValidation.ApplicableArmors'));
              return false;
            }
            break;
          case MagicalItemType.SCROLL:
            if (magicalItem.applicableSpells.length === 0) {
              this.notificationService.error(this.translate.instant('Error.MagicalItemValidation.ApplicableSpells'));
              return false;
            }
            break;
          case MagicalItemType.WEAPON:
            if (magicalItem.applicableWeapons.length === 0) {
              this.notificationService.error(this.translate.instant('Error.MagicalItemValidation.ApplicableWeapons'));
              return false;
            }
            break;
          case MagicalItemType.AMMO:
            if (magicalItem.applicableAmmos.length === 0) {
              this.notificationService.error(this.translate.instant('Error.MagicalItemValidation.ApplicableAmmos'));
              return false;
            }
            break;
        }

        if (magicalItem.attunementType === MagicalItemAttunementType.CLASS && magicalItem.attunementClasses.length === 0) {
          this.notificationService.error(this.translate.instant('Error.MagicalItemValidation.AttunementClasses'));
          return false;
        } else if (magicalItem.attunementType === MagicalItemAttunementType.ALIGNMENT && magicalItem.attunementAlignments.length === 0) {
          this.notificationService.error(this.translate.instant('Error.MagicalItemValidation.AttunementAlignments'));
          return false;
        }
    }
    return true;
  }

  save(): void {
    this.item = this.getItem();
    if (this.itemForm.valid) {
      if (this.isValid()) {
        this.loading = true;
        const values = this.itemForm.value;
        this.item.name = values.name;

        switch (this.item.itemType) {
          case ItemType.WEAPON:
            this.weaponService.setPropertyConfigurations(this.item as Weapon, this.weaponPropertyCollection);
            this.weaponService.setDamageConfigurations(this.item as Weapon, this.weaponDamageCollection);
            break;
          case ItemType.AMMO:
            this.ammoService.setDamageConfigurations(this.item as Ammo, this.ammoDamageCollection);
            break;
        }

        if (this.item.id == null || this.item.id === '0' || this.importing) {
          this.itemService.createItem(this.item).then((id: string) => {
            this.id = id;
            this.item.id = id;
            this.cancelable = true;
            this.finishSaving();
          }, () => {
            this.errorSaving();
          });
        } else {
          this.itemService.updateItem(this.item).then(() => {
            this.finishSaving();
          }, () => {
            this.errorSaving();
          });
        }
      }
    } else {
      const translatedMessage = this.translate.instant('Error.AllFieldsRequired');
      this.notificationService.error(translatedMessage);
    }
  }

  private finishSaving(): void {
    this.itemName = this.item.name;
    this.editing = false;
    this.originalItem = this.createCopyOfItem(this.item);
    this.originalWeaponPropertyCollection = this.weaponService.createCopyOfPropertyConfigurationCollection(this.weaponPropertyCollection);
    this.originalWeaponDamageCollection = this.weaponService.createCopyOfDamageConfigurationCollection(this.weaponDamageCollection);
    this.originalAmmoDamageCollection = this.ammoService.createCopyOfDamageConfigurationCollection(this.ammoDamageCollection);

    this.updateList(this.id);
    if (!this.importing) {
      this.navigateToItem(this.id);
    } else {
      this.importService.completeItem(this.importItem, this.id);
      this.navigateToImporting();
    }
    this.loading = false;
  }

  private navigateToItem(id: string): void {
    this.router.navigate(['/home/dashboard', {outlets: {'middle-nav': ['items', id], 'side-nav': ['items', id]}}], {skipLocationChange: SKIP_LOCATION_CHANGE});
  }

  private navigateToImporting(): void {
    this.router.navigate(['/home/dashboard',
        {outlets: {'middle-nav': ['import'], 'side-nav': ['default']}}],
      {skipLocationChange: SKIP_LOCATION_CHANGE});
  }

  private errorSaving(): void {
    const translatedMessage = this.translate.instant('Error.Save');
    this.notificationService.error(translatedMessage);
    this.loading = false;
  }

  delete(): void {
    this.loading = true;
    this.itemService.deleteItem(this.item).then(() => {
      this.loading = false;
      this.updateList(null);
      this.close();
    }, () => {
      this.loading = false;
      const translatedMessage = this.translate.instant('Error.Delete');
      this.notificationService.error(translatedMessage);
    });
  }

  private resetDefaultItems(): void {
    this.selectedCategory = ItemType.WEAPON;
    this.weapon = new Weapon();
    this.armor = new Armor();
    this.gear = new Gear();
    this.tool = new Tool();
    this.ammo = new Ammo();
    this.ammoDamageCollection = new DamageConfigurationCollection();
    this.originalAmmoDamageCollection = new DamageConfigurationCollection();
    this.mount = new Mount();
    this.treasure = new Treasure();
    this.pack = new Pack();
    this.magicalItem = new MagicalItem();
    this.vehicle = new Vehicle();
  }

  cancel(): void {
    if (this.id === '0') {
      this.close();
    } else if (this.importing) {
      this.navigateToImporting();
    } else {
      this.loading = true;
      this.item = this.createCopyOfItem(this.originalItem);
      this.updateItemType(this.item);
      this.weaponPropertyCollection = this.weaponService.createCopyOfPropertyConfigurationCollection(this.originalWeaponPropertyCollection);
      this.weaponDamageCollection = this.weaponService.createCopyOfDamageConfigurationCollection(this.originalWeaponDamageCollection);
      this.ammoDamageCollection = this.ammoService.createCopyOfDamageConfigurationCollection(this.originalAmmoDamageCollection);
      setTimeout(() => {
        this.loading = false;
      });
    }
  }

  duplicate(name: string): void {
    this.loading = true;
    this.itemService.duplicateItem(this.item, name).then((id: string) => {
      this.loading = false;
      this.updateList(id);
      this.navigateToItem(id);
    }, () => {
      this.loading = false;
      const translatedMessage = this.translate.instant('Error.Duplicate');
      this.notificationService.error(translatedMessage);
    });
  }

  private updateList(id: string): void {
    this.itemService.updateMenuItems(id);
  }

  shareClick(): void {
    this.loading = true;
    this.itemService.getPublishDetails(this.item).then((publishDetails: PublishDetails) => {
      this.publishDetails = publishDetails;
      this.viewShare = true;
      this.loading = false;
    });
  }

  exportClick(): void {
    const item = new ManageListItem();
    item.listObject = new ListObject(this.item.id, this.item.name, this.item.sid, this.item.author);
    item.menuItem = new MenuItem(this.item.id, this.item.name);
    const selectedItems = [item];
    const proExportOnly = [ItemType.MAGICAL_ITEM, ItemType.TREASURE, ItemType.PACK].includes(this.item.itemType);
    this.exportDialogService.showExportDialog(selectedItems, proExportOnly, this.exportDetailsService, 'Items', () => {}, this.item);
  }

  closeShare(): void {
    this.viewShare = false;
  }

  saveShare(request: PublishRequest): void {
    this.itemService.publishItem(this.item, request).then(() => {
      this.viewShare = false;
      this.notificationService.success(this.translate.instant('Success'));
    }, () => {
      this.viewShare = false;
      this.notificationService.error(this.translate.instant('Error.Unknown'));
    });
  }

  myStuffClick(): void {
    this.sharingItemService.addToMyStuff(this.item, this.versionInfo, () => {
      this.loading = true;
      this.eventsService.dispatchEvent(EVENTS.AddToMyStuff);

      this.sharingItemService.continueAddToMyStuff(this.item).then((success: boolean) => {
        this.eventsService.dispatchEvent(EVENTS.AddToMyStuffFinish);
        if (success) {
          this.versionInfo.version = this.versionInfo.authorVersion;
          this.eventsService.dispatchEvent(EVENTS.VersionUpdated);
          this.notificationService.success(this.translate.instant('Success'));
          this.loading = false;
          this.initializeData();
        } else {
          this.notificationService.error(this.translate.instant('Error.Unknown'));
          this.loading = false;
        }
      });
    });
  }

}
