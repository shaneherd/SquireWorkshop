import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ImportAction, ImportItem, ImportItemCategory, ImportItemConfiguration} from '../../../shared/imports/import-item';
import {ImportService} from '../../../core/services/import/import.service';
import {ImportSharedService} from '../../../core/services/import/import-shared.service';
import {ImportCacheService} from '../../../core/services/import/import-cache.service';

@Component({
  selector: 'app-import-category',
  templateUrl: './import-category.component.html',
  styleUrls: ['./import-category.component.scss']
})
export class ImportCategoryComponent implements OnInit {
  @Input() category: ImportItemCategory;
  @Input() configs: ImportItemConfiguration[] = [];
  @Input() parent: ImportItemConfiguration = null;
  @Output() actionClick = new EventEmitter();
  @Output() selectedActionChange = new EventEmitter<ImportItemConfiguration>();
  @Output() view = new EventEmitter<ImportItemConfiguration>();
  @Output() linkClick = new EventEmitter<ImportItemConfiguration>();
  @Output() toggleExpanded = new EventEmitter<ImportItemConfiguration>();

  expanded = true;
  globalActions: ImportAction[] = [];
  allComplete = false;
  hasErrors = false;
  hasComplete = false;
  hasDuplicates = false;

  constructor(
    private importService: ImportService,
    private importCacheService: ImportCacheService,
    private importSharedService: ImportSharedService
  ) { }

  ngOnInit() {
    this.expanded = this.importCacheService.isCategoryExpanded(this.category);
    this.updateImportItems();
  }

  private updateImportItems(): void {
    this.updateStates();
  }

  private updateStates(): void {
    let allComplete = true;
    let hasErrors = false;
    let hasComplete = false;
    let hasDuplicates = false;

    const flatList = this.importSharedService.getFlatConfigList(this.configs);
    for (let i = 0; i < flatList.length; i++) {
      const importItem = flatList[i].importItem;
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

    this.initializeGlobalActions();
  }

  private initializeGlobalActions(): void {
    const actions: ImportAction[] = [];
    if (this.hasDuplicates) {
      actions.push(new ImportAction('USE_EXISTING', 'far fa-dot-circle'));
      actions.push(new ImportAction('REPLACE_EXISTING', 'fas fa-sync-alt'));
    }
    actions.push(new ImportAction('INSERT_AS_NEW', 'fas fa-plus-circle'));
    actions.push(new ImportAction('SKIP_ENTRY', 'fas fa-minus-circle', this.category === 'Character'));
    this.globalActions = actions;
  }

  globalActionClick(action: ImportAction): void {
    const flatList = this.importSharedService.getFlatConfigList(this.configs);
    flatList.forEach((importItem: ImportItemConfiguration) => {
      this.importService.updateSelectedAction(importItem, action.event);
    });
    this.actionClick.emit();
  }

  viewConfig(config: ImportItemConfiguration): void {
    this.view.emit(config);
  }

  onLinkClick(config: ImportItemConfiguration): void {
    this.linkClick.emit(config);
  }

  onSelectedActionChange(config: ImportItemConfiguration): void {
    this.selectedActionChange.emit(config);
  }

  onExpandToggle(): void {
    this.expanded = !this.expanded;
    this.importCacheService.updateExpanded(this.expanded, this.category);
  }

  onConfigExpandToggle(config: ImportItemConfiguration): void {
    this.toggleExpanded.emit(config);
  }
}
