import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ImportAction, ImportActionEvent, ImportItemConfiguration} from '../../../shared/imports/import-item';
import {ImportService} from '../../../core/services/import/import.service';
import {Router} from '@angular/router';
import {MatMenu} from '@angular/material/menu';
import {ImportSharedService} from '../../../core/services/import/import-shared.service';

export declare type ImportNestedMenuAction = 'SELF' | 'CHILDREN' | 'ALL';

@Component({
  selector: 'app-import-item',
  templateUrl: './import-item.component.html',
  styleUrls: ['./import-item.component.scss']
})
export class ImportItemComponent implements OnInit {
  @ViewChild('useExistingChildMenu', {static: false})
  useExistingChildMenu: MatMenu;

  @ViewChild('replaceExistingChildMenu', {static: false})
  replaceExistingChildMenu: MatMenu;

  @ViewChild('insertAtNewChildMenu', {static: false})
  insertAtNewChildMenu: MatMenu;

  @ViewChild('skipEntryChildMenu', {static: false})
  skipEntryChildMenu: MatMenu;

  @Input() config: ImportItemConfiguration;
  @Input() showStatus = true;
  @Output() view = new EventEmitter<ImportItemConfiguration>();
  @Output() linkClick = new EventEmitter<ImportItemConfiguration>();
  @Output() selectedActionChange = new EventEmitter<ImportItemConfiguration>();
  @Output() toggleExpanded = new EventEmitter<ImportItemConfiguration>();

  isParentItem = false;

  constructor(
    private router: Router,
    private importService: ImportService,
    private importSharedService: ImportSharedService
  ) { }

  ngOnInit() {
    if (this.config.children.length > 0) {
      this.isParentItem = this.config.importItem.type === 'CharacterClass'
        || this.config.importItem.type === 'Race'
        || this.config.importItem.type === 'Background';
      setTimeout(() => {
        this.initializeChildrenMenus();
      });
    }
  }

  private initializeChildrenMenus(): void {
    this.config.menuActions.forEach((menuAction: ImportAction) => {
      switch (menuAction.event) {
        case 'USE_EXISTING':
          menuAction.childMenu = this.useExistingChildMenu;
          break;
        case 'REPLACE_EXISTING':
          menuAction.childMenu = this.replaceExistingChildMenu;
          break;
        case 'INSERT_AS_NEW':
          menuAction.childMenu = this.insertAtNewChildMenu;
          break;
        case 'SKIP_ENTRY':
          menuAction.childMenu = this.skipEntryChildMenu;
          break;
      }
    });
  }

  viewClick(): void {
    this.view.emit(this.config);
  }

  onLinkClick(): void {
    this.linkClick.emit(this.config);
  }

  onChildLinkClick(config: ImportItemConfiguration): void {
    this.linkClick.emit(config);
  }

  viewConfig(config: ImportItemConfiguration): void {
    this.view.emit(config);
  }

  menuActionClick(menuAction: ImportAction): void {
    if (this.config.children.length === 0) {
      this.importService.updateSelectedAction(this.config, menuAction.event);
      this.selectedActionChange.emit(this.config);
    }
  }

  useExistingNestedMenuActionClick(nestedAction: ImportNestedMenuAction): void {
    this.nestedMenuActionClick('USE_EXISTING', nestedAction);
  }

  replaceExistingNestedMenuActionClick(nestedAction: ImportNestedMenuAction): void {
    this.nestedMenuActionClick('REPLACE_EXISTING', nestedAction);
  }

  insertAsNewNestedMenuActionClick(nestedAction: ImportNestedMenuAction): void {
    this.nestedMenuActionClick('INSERT_AS_NEW', nestedAction);
  }

  skipEntryNestedMenuActionClick(nestedAction: ImportNestedMenuAction): void {
    this.nestedMenuActionClick('SKIP_ENTRY', nestedAction);
  }

  private nestedMenuActionClick(event: ImportActionEvent, nestedAction: ImportNestedMenuAction): void {
    switch (nestedAction) {
      case 'SELF':
        this.importService.updateSelectedAction(this.config, event);
        break;
      case 'CHILDREN':
        this.applyEventToChildren(event);
        break;
      case 'ALL':
        this.importService.updateSelectedAction(this.config, event);
        this.applyEventToChildren(event);
        break;
    }
    this.selectedActionChange.emit(this.config);
  }

  private applyEventToChildren(event: ImportActionEvent): void {
    const flatList = this.importSharedService.getFlatConfigList(this.config.children);
    flatList.forEach((child: ImportItemConfiguration) => {
      this.importService.updateSelectedAction(child, event);
    });
  }

  importItemClick(): void {
    if (this.config.importItem.status === 'NOT_SUPPORTED') {
      return;
    }

    this.viewClick();
  }

  onSelectedActionChange(config: ImportItemConfiguration): void {
    this.selectedActionChange.emit(config);
  }

  onExpandToggle(): void {
    this.toggleExpanded.emit(this.config);
  }

  onChildExpandToggle(config: ImportItemConfiguration): void {
    this.toggleExpanded.emit(config);
  }
}
