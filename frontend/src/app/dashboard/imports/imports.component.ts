import {Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ImportService} from '../../core/services/import/import.service';
import {
  ImportItem,
  ImportItemCategory,
  ImportItemConfiguration,
  ImportItemType
} from '../../shared/imports/import-item';
import {ANALYTICS_EVENT, ANALYTICS_LABEL, ANALYTICS_VALUE, LOCAL_STORAGE} from '../../constants';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ConfirmDialogData} from '../../core/components/confirm-dialog/confirmDialogData';
import {ConfirmDialogComponent} from '../../core/components/confirm-dialog/confirm-dialog.component';
import {TranslateService} from '@ngx-translate/core';
import {ResolutionService} from '../../core/services/resolution.service';
import {Observable, Subscription} from 'rxjs';
import {OkDialogData} from '../../core/components/ok-dialog/ok-dialog-data';
import {OkDialogComponent} from '../../core/components/ok-dialog/ok-dialog.component';
import {ImportResultsDialogData} from '../../core/components/import-results-dialog/import-results-dialog-data';
import {ImportResultsDialogComponent} from '../../core/components/import-results-dialog/import-results-dialog.component';
import {ImportSharedService} from '../../core/services/import/import-shared.service';
import * as _ from 'lodash';
import {ComponentCanDeactivate} from '../../core/guards/pending-changes.guard';
import {ImportCacheService} from '../../core/services/import/import-cache.service';

export class ImportItemGroup {
  category: ImportItemCategory;
  configs: ImportItemConfiguration[];
  parent: ImportItemConfiguration;
}

@Component({
  selector: 'app-imports',
  templateUrl: './imports.component.html',
  styleUrls: ['./imports.component.scss']
})
export class ImportsComponent implements OnInit, OnDestroy, ComponentCanDeactivate {
  @ViewChild('hiddenFileInput', {static: false})
  hiddenFileInput: ElementRef;

  @ViewChild('fileInput', {static: false})
  fileInput: ElementRef;

  fileToUpload: File = null;
  filename = '';
  loading = false;
  importing = false;
  isDesktop = true;

  categoryMap = new Map<ImportItemCategory, ImportItemType[]>();
  rootList: ImportItem[] = [];
  groups: ImportItemGroup[] = [];
  viewingConfig: ImportItemConfiguration = null;
  viewingLink: ImportItemConfiguration = null;

  allComplete = false;
  hasErrors = false;
  hasComplete = false;
  hasDuplicates = false;

  resSub: Subscription;

  constructor(
    private resolutionService: ResolutionService,
    private importService: ImportService,
    private importSharedService: ImportSharedService,
    private importCacheService: ImportCacheService,
    private translate: TranslateService,
    private dialog: MatDialog
  ) { }

  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    return !this.importing;
  }

  ngOnInit() {
    this.resSub = this.resolutionService.width.subscribe(width => {
      this.isDesktop = ResolutionService.isDesktop(width);
    });

    this.filename = localStorage.getItem(LOCAL_STORAGE.IMPORTS_FILE_NAME);
    this.initializeCategoryMap();
    this.updateImportItems();
  }

  ngOnDestroy() {
    this.resSub.unsubscribe();
  }

  private initializeCategoryMap(): void {
    this.categoryMap.set('Character', ['Character']);
    this.categoryMap.set('CharacterClass', ['CharacterClass']);
    this.categoryMap.set('Race', ['Race']);
    this.categoryMap.set('Background', ['Background']);

    this.categoryMap.set('Spell', ['Spell']);
    this.categoryMap.set('Feature', ['Feature']);

    this.categoryMap.set('Equipment', [
      'AmmoCategory',
      'Ammo',
      'BasicAmmo',
      'ArmorCategory',
      'Armor',
      'BasicArmor',
      'GearCategory',
      'Gear',
      'MountCategory',
      'Mount',
      'BasicMount',
      'Tool',
      'ToolCategory',
      'ToolCategoryType',
      'WeaponCategory',
      'Weapon',
      'BasicWeapon',
      'MagicalItem',
      'MagicalItemCategory',
      'Treasure',
      'TreasureCategory'
    ]);
    this.categoryMap.set('Pack', ['Pack', 'PackCategory']);

    this.categoryMap.set('ArmorType', ['ArmorType']);
    this.categoryMap.set('DamageType', ['DamageType']);
    this.categoryMap.set('AreaOfEffect', ['AreaOfEffect']);
    this.categoryMap.set('CasterType', ['CasterType']);
    this.categoryMap.set('Condition', ['Condition']);
    this.categoryMap.set('Language', ['Language']);
    this.categoryMap.set('Skill', ['Skill']);
    this.categoryMap.set('WeaponProperty', ['WeaponProperty']);

    this.categoryMap.set('Monster', ['Monster']);
  }

  private updateStates(): void {
    let allComplete = true;
    let hasErrors = false;
    let hasComplete = false;
    let hasDuplicates = false;

    const flatList = this.importSharedService.getFlatList(this.rootList);
    for (let i = 0; i < flatList.length; i++) {
      const importItem = flatList[i];
      if (importItem.duplicates != null && importItem.duplicates.length > 0) {
        hasDuplicates = true;
      }
      switch (importItem.status) {
        case 'READY':
          allComplete = false;
          break;
        case 'COMPLETE':
          hasComplete = true;
          break;
        case 'DEPENDENCIES_NOT_COMPLETE':
        case 'ERROR':
          allComplete = false;
          hasErrors = true;
          break;
        case 'NOT_SUPPORTED':
          allComplete = false;
          break;
      }
    }

    this.allComplete = allComplete;
    this.hasErrors = hasErrors;
    this.hasComplete = hasComplete;
    this.hasDuplicates = hasDuplicates;
  }

  handleFileInput(files: FileList) {
    this.loading = true;
    this.fileToUpload = files.item(0);
    this.filename = this.fileToUpload.name;

    const reader = new FileReader();
    reader.readAsText(this.fileToUpload);
    localStorage.setItem(LOCAL_STORAGE.IMPORTS_FILE_NAME, this.fileToUpload.name);
    this.importCacheService.resetExpandedCache();

    reader.onload = () => {
      const content: string = reader.result as string;
      this.importService.processFileContent(content).then(() => {
        this.updateImportItems();
        this.loading = false;
      }, (error: string) => {
        this.showUploadFileErrorDialog(error);
        this.clearFile();
        this.loading = false;
      });
    };
  }

  private showUploadFileErrorDialog(error: string): void {
    const data = new OkDialogData();
    data.title = this.translate.instant('Imports.UploadFileError.Title');
    data.message = error;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = data;
    this.dialog.open(OkDialogComponent, dialogConfig);
  }

  private updateImportItems(): void {
    this.rootList = this.importService.getImportItems();
    this.updateGroups();
    this.updateStates();
    if (this.rootList.length === 0) {
      this.clearFile();
    }
  }

  private updateGroups(): void {
    const isCharacter = this.rootList.length === 1 && this.rootList[0].type === 'Character';
    let list = this.rootList;
    let parent: ImportItemConfiguration = null;
    if (isCharacter) {
      const character = this.rootList[0];
      list = character.children;
      parent = this.importService.getImportItemConfiguration(character);
      if (character.children.length > 0) {
        parent.dependencies = this.importService.getImportItemConfigurations(character.children, parent);
      }
    }

    const groups: ImportItemGroup[] = [];
    if (isCharacter) {
      const group = new ImportItemGroup();
      group.category = 'Character';
      group.configs = [parent];
      group.parent = null;
      groups.push(group);
    }

    this.categoryMap.forEach((types: ImportItemType[], category: ImportItemCategory) => {
      const group = new ImportItemGroup();
      group.category = category;
      let importItems: ImportItem[] = [];
      types.forEach((type: ImportItemType) => {
        const typeItems = _.filter(list, (_importItem: ImportItem) => {
          return _importItem.type === type;
        });
        importItems = importItems.concat(typeItems);
      });
      this.importSharedService.sortImports(importItems);
      group.configs = this.importService.getImportItemConfigurations(importItems, parent);
      group.parent = parent;
      groups.push(group);
    });
    this.groups = groups;
    const allConfigs = this.importSharedService.getFlatConfigList(this.getAllConfigs());
    this.processLinks(allConfigs);
  }

  private processLinks(configs: ImportItemConfiguration[]): void {
    configs.forEach((config: ImportItemConfiguration) => {
      config.links = this.getLinks(config, configs);
    });
  }

  private getLinks(config: ImportItemConfiguration, allConfigs: ImportItemConfiguration[]): ImportItemConfiguration[] {
    const linkIds: string[] = config.importItem.links;
    return _.filter(allConfigs, (_config: ImportItemConfiguration) => {
      return linkIds.indexOf(_config.importItem.importId) > -1;
    });
  }

  private getAllConfigs(): ImportItemConfiguration[] {
    let list: ImportItemConfiguration[] = [];
    this.groups.forEach((group: ImportItemGroup) => {
      list = list.concat(group.configs);
    });
    return list;
  }

  cancel(): void {
    const self = this;
    const data = new ConfirmDialogData();
    data.message = this.translate.instant(this.hasComplete ? 'Imports.Cancel.Remaining' : 'Imports.Cancel.All');
    data.confirm = () => {
      self.continueCancel();
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = data;
    this.dialog.open(ConfirmDialogComponent, dialogConfig);
  }

  private continueCancel(): void {
    this.importService.clearImports();
    this.clearFile();
    this.updateImportItems();
  }

  newImport(): void {
    this.continueCancel();
    setTimeout(() => {
      if (this.fileInput != null) {
        this.fileInput.nativeElement.click();
      }
    });
  }

  private clearFile(): void {
    this.filename = '';
    this.fileToUpload = null;
    localStorage.removeItem(LOCAL_STORAGE.IMPORTS_FILE_NAME);
    if (this.hiddenFileInput != null) {
      this.hiddenFileInput.nativeElement.value = '';
    }
  }

  viewConfig(config: ImportItemConfiguration): void {
    if (this.viewingConfig == null) {
      this.viewingConfig = config;
    }
  }

  onLinkClick(config: ImportItemConfiguration): void {
    if (this.viewingLink == null) {
      this.viewingLink = config;
    }
  }

  selectedActionChange(): void {
    this.updateImportItemCache();
  }

  toggleExpand(config: ImportItemConfiguration): void {
    config.importItem.expanded = !config.importItem.expanded;
    this.updateImportItemCache();
  }

  closeConfig(): void {
    this.viewingConfig = null;
  }

  saveConfig(): void {
    this.viewingConfig = null;
    this.updateImportItemCache();
  }

  closeLink(): void {
    this.viewingLink = null;
  }

  saveLink(): void {
    this.viewingLink = null;
    this.updateImportItemCache();
  }

  private updateImportItemCache(): void {
    this.importService.updateImportItems(this.rootList);
  }

  continue(): void {
    const self = this;
    const data = new ImportResultsDialogData();
    data.title = this.translate.instant('Imports.ImportResults.Title');
    data.message = this.translate.instant('Imports.ImportResults.Message');
    const rootConfigs = this.importService.getImportItemConfigurations(this.rootList, null);
    const allConfigs = this.importSharedService.getFlatConfigList(rootConfigs);
    this.processLinks(allConfigs);
    data.configs = rootConfigs;
    data.done = () => {
      self.finishImport();
    }
    data.cancel = () => {
      self.importing = false;
    }
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = data;
    this.importing = true;
    this.dialog.open(ImportResultsDialogComponent, dialogConfig);
  }

  private finishImport(): void {
    this.importing = false;
    const rootItems = this.importService.getImportItems();
    this.importService.updateDuplicates(rootItems, true).then(() => {
      this.updateImportItems();
      this.loading = false;
    });
  }
}
