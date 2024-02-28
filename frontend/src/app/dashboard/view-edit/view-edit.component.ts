import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {ConfirmDialogData} from '../../core/components/confirm-dialog/confirmDialogData';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {ConfirmDialogComponent} from '../../core/components/confirm-dialog/confirm-dialog.component';
import {TranslateService} from '@ngx-translate/core';
import {DuplicateItemData} from '../../core/components/duplicate-item/duplicateItemData';
import {DuplicateItemComponent} from '../../core/components/duplicate-item/duplicate-item.component';
import {EventsService} from '../../core/services/events.service';
import {InUse} from '../../shared/models/inUse/in-use';
import {InUseDialogData} from '../../core/components/in-use-dialog/in-use-dialog-data';
import {InUseDialogComponent} from '../../core/components/in-use-dialog/in-use-dialog.component';
import {SlideInHeader} from '../../shared/models/slideInHeader.model';
import {Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {ButtonAction} from '../../shared/models/button/button-action';
import {VersionInfo} from '../../shared/models/version-info';
import {EVENTS} from '../../constants';
import {ListObject} from '../../shared/models/list-object';
import {PageMenuAction} from '../character/character-playing/character-playing.component';

export interface InUseService {
  inUse: (id: string) => Promise<InUse[]>;
}

@Component({
  selector: 'app-view-edit',
  templateUrl: './view-edit.component.html',
  styleUrls: ['./view-edit.component.scss']
})
export class ViewEditComponent implements OnInit, OnChanges, OnDestroy {
  @Input() id: string;
  @Input() itemName: string;
  @Input() cancelable: boolean; //todo - remove this attribute
  @Input() editing: boolean;
  @Input() deletable = false;
  @Input() editable = true;
  @Input() editDisabled = false;
  @Input() duplicateDisabled = false;
  @Input() deleteDisabled = false;
  @Input() loading: boolean;
  @Input() inUseService: InUseService;
  @Input() type: string;
  @Input() nested = false;
  @Input() showShare = false;
  @Input() shareDisabled = false;
  @Input() exportable = false;
  @Input() versionInfo: VersionInfo;
  @Input() actions: PageMenuAction[] = [];

  @Output() editingChange = new EventEmitter();
  @Output() save = new EventEmitter();
  @Output() delete = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() duplicate = new EventEmitter();
  @Output() close = new EventEmitter();
  @Output() share = new EventEmitter();
  @Output() myStuff = new EventEmitter();
  @Output() export = new EventEmitter();

  slideInHeader: SlideInHeader;
  queryParamsSub: Subscription;
  isPublic = false;
  isShared = false;
  editActions: ButtonAction[] = [];
  eventSub: Subscription;

  constructor(
    private eventsService: EventsService,
    private dialog: MatDialog,
    private translate: TranslateService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    const self = this;
    this.slideInHeader = new SlideInHeader(this.itemName, false, null);
    this.slideInHeader.showBack = this.nested;
    this.slideInHeader.showShare = this.showShare;
    this.slideInHeader.shareDisabled = this.shareDisabled;
    this.slideInHeader.backClick = () => {
      self.close.emit();
    }
    this.slideInHeader.shareClick = () => {
      self.share.emit();
    }
    this.queryParamsSub = this.route.queryParams
      .subscribe((params: {public: string, shared: string}) => {
        this.isPublic = params.public != null && params.public === 'true';
        this.isShared = params.shared != null && params.shared === 'true';
      });

    this.eventSub = this.eventsService.events.subscribe(event => {
      if (event === EVENTS.VersionUpdated) {
        this.updateEditActions();
      } else if (event === EVENTS.AddToMyStuff) {
        this.enableAddToMyStuff(false);
      } else if (event === EVENTS.AddToMyStuffFinish) {
        this.enableAddToMyStuff(true);
      }
    });

    this.updateEditActions();
  }

  private updateEditActions(): void {
    this.editActions = [];
    this.editActions.push(new ButtonAction('', this.translate.instant('Edit'), () => {
      this.edit();
    }, this.editDisabled));
    if (!this.nested && this.versionInfo != null && this.versionInfo.authorVersion > this.versionInfo.version) {
      this.editActions.push(new ButtonAction('myStuff', this.translate.instant('Sharing.MyStuff.Update.Button'), () => {
        this.myStuffClick();
      }));
    }
    if (this.exportable) {
      this.editActions.push(new ButtonAction('export', this.translate.instant('Export'), () => {
        this.exportClick();
      }));
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.slideInHeader == null) {
      return;
    }
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        if (propName === 'itemName') {
          this.slideInHeader.name = changes[propName].currentValue;
        } else if (propName === 'nested') {
          this.slideInHeader.showBack = changes[propName].currentValue as boolean;
        } else if (propName === 'showShare') {
          this.slideInHeader.showShare = changes[propName].currentValue as boolean;
        } else if (propName === 'shareDisabled') {
          this.slideInHeader.shareDisabled = changes[propName].currentValue as boolean;
        } else if (propName === 'versionInfo') {
          this.updateEditActions();
        }
      }
    }
  }

  ngOnDestroy() {
    this.queryParamsSub.unsubscribe();
    this.eventSub.unsubscribe();
  }

  edit(): void {
    this.editing = true;
    this.slideInHeader.showShare = false;
    this.editingChange.emit(this.editing);
  }

  cancelClick(): void {
    const self = this;
    const data = new ConfirmDialogData();
    data.title = this.translate.instant('Headers.CancelChanges');
    data.message = this.translate.instant('Navigation.Manage.CancelMessage');
    data.confirm = () => {
      self.editing = false;
      this.slideInHeader.showShare = false;
      self.slideInHeader.showShare = self.showShare;
      self.editingChange.emit(self.editing);
      self.cancel.emit();
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = data;
    this.dialog.open(ConfirmDialogComponent, dialogConfig);
  }

  deleteClick(): void {
    if (this.inUseService != null) {
      this.inUseService.inUse(this.id).then((inUse: InUse[]) => {
        if (inUse.length === 0) {
          this.confirmDelete();
        } else {
          this.showInUse(inUse);
        }
      });
    } else {
      this.confirmDelete();
    }
  }

  private confirmDelete(): void {
    const self = this;
    const data = new ConfirmDialogData();
    data.title = this.translate.instant('Headers.ConfirmDelete');
    data.message = this.translate.instant('Navigation.Manage.ConfirmDelete');
    data.confirm = () => {
      self.delete.emit();
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = data;
    this.dialog.open(ConfirmDialogComponent, dialogConfig);
  }

  private showInUse(inUse: InUse[]): void {
    const self = this;
    const data = new InUseDialogData();
    data.name = this.itemName;
    data.type = this.type;
    data.confirm = () => {
      self.delete.emit();
    };
    data.inUse = inUse;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = data;
    this.dialog.open(InUseDialogComponent, dialogConfig);
  }

  duplicateClick(): void {
    const self = this;
    const data = new DuplicateItemData();
    data.message = this.translate.instant('Navigation.Manage.DuplicateMessage');
    data.defaultName = this.itemName + ' (Copy)';
    data.confirm = (name: string) => {
      self.duplicate.emit(name);
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = data;
    this.dialog.open(DuplicateItemComponent, dialogConfig);
  }

  saveClick(): void {
    this.save.emit();
    this.slideInHeader.showShare = this.showShare;
  }

  myStuffClick(): void {
    this.myStuff.emit();
  }

  exportClick(): void {
    this.export.emit();
  }

  private enableAddToMyStuff(enabled: boolean): void {
    this.editActions.forEach((buttonAction: ButtonAction) => {
      if (buttonAction.event === 'myStuff') {
        buttonAction.disabled = !enabled;
      }
    });
  }
}
