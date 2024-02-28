import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {PlayerCharacter} from '../../../shared/models/creatures/characters/player-character';
import {CreatureConfigurationCollection} from '../../../shared/models/creatures/configs/creature-configuration-collection';
import {EventsService} from '../../../core/services/events.service';
import {Subscription} from 'rxjs';
import {
  ANALYTICS_EVENT,
  ANALYTICS_LABEL,
  EVENTS,
  LOCAL_STORAGE,
  NAVIGATION_DELAY,
  SKIP_LOCATION_CHANGE
} from '../../../constants';
import {ActivatedRoute, Router} from '@angular/router';
import {CharacterContextMenuService} from '../../../shared/components/character-context-menu/character-context-menu.service';
import {NotificationService} from '../../../core/services/notification.service';
import {CharacterService} from '../../../core/services/creatures/character.service';
import {TranslateService} from '@ngx-translate/core';
import {CreatureService} from '../../../core/services/creatures/creature.service';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {YesNoDialogData} from '../../../core/components/yes-no-dialog/yes-no-dialog-data';
import {YesNoDialogComponent} from '../../../core/components/yes-no-dialog/yes-no-dialog.component';
import {ResolutionService} from '../../../core/services/resolution.service';
import {CreatureItemService} from '../../../core/services/creatures/creature-item.service';
import {CreatureItem} from '../../../shared/models/creatures/creature-item';
import {ConfirmDialogData} from '../../../core/components/confirm-dialog/confirmDialogData';
import {ConfirmDialogComponent} from '../../../core/components/confirm-dialog/confirm-dialog.component';
import {UtilService} from '../../../core/services/util.service';
import {CharacterPageType} from '../../../shared/models/creatures/characters/character-page-type.enum';
import {CharacterPage} from '../../../shared/models/creatures/characters/character-page';
import {MatSliderChange} from '@angular/material/slider';
import {ExportDialogService} from '../../../core/services/export/export-dialog.service';
import {ExportCreatureService} from '../../../core/services/export/export-creature.service';
import {ManageListItem} from '../../../shared/components/manage-list/manage-list.component';
import {ListObject} from '../../../shared/models/list-object';
import {MenuItem} from '../../../shared/models/menuItem.model';

export class PageMenuAction {
  label: string;
  icon: string;
  event: string;
  disabled = false

  constructor(label: string, event: string, icon: string, disabled: boolean = false) {
    this.label = label;
    this.icon = icon;
    this.event = event;
    this.disabled = disabled;
  }
}

@Component({
  selector: 'app-character-playing',
  templateUrl: './character-playing.component.html',
  styleUrls: ['./character-playing.component.scss']
})
export class CharacterPlayingComponent implements OnInit, OnDestroy {
  id: string;
  playerCharacter: PlayerCharacter;
  collection: CreatureConfigurationCollection = new CreatureConfigurationCollection();
  loading = false;
  resSub: Subscription;
  eventSub: Subscription;
  routeSub: Subscription;
  queryParamsSub: Subscription;
  isPublic = false;
  isShared = false;

  editPageOrder = false;
  editCharacterSettings = false;
  validateCharacter = false;
  chooseStartingEquipment = false;
  displayRollLog = false;
  showJoinCampaign = false;

  MIN_COLUMN_WIDTH = 400;
  width: number;
  calculatedColumns = 1;
  isDesktop = true;
  printing = false;
  quickReferences = false;

  mobileIndex = 0;
  debounceSwipeLeft: () => void;
  debounceSwipeRight: () => void;
  debounceInterval = 100;
  pages: CharacterPageType[] = [];

  constructor(
    private cd: ChangeDetectorRef,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private router: Router,
    private eventsService: EventsService,
    private characterContextMenuService: CharacterContextMenuService,
    private notificationService: NotificationService,
    private creatureService: CreatureService,
    private creatureItemService: CreatureItemService,
    private characterService: CharacterService,
    private dialog: MatDialog,
    private resolutionService: ResolutionService,
    private utilService: UtilService,
    private exportDialogService: ExportDialogService,
    private exportDetailsService: ExportCreatureService
  ) { }

  ngOnInit() {
    this.playerCharacter = new PlayerCharacter();

    this.resSub = this.resolutionService.width.subscribe(width => {
      this.isDesktop = ResolutionService.isDesktop(width);
      this.width = width;
      this.updateCalculatedColumns();
    });

    this.debounceSwipeLeft = this.utilService.debounce(() => {
      this.swipeLeft();
    }, this.debounceInterval);

    this.debounceSwipeRight = this.utilService.debounce(() => {
      this.swipeRight();
    }, this.debounceInterval);

    this.characterContextMenuService.setDisplay(true);
    this.eventSub = this.eventsService.events.subscribe(event => {
      if (event === EVENTS.EditPageOrder) {
        this.editPageOrder = true;
      } else if (event === EVENTS.CharacterRollLog) {
        this.displayRollLog = true;
      } else if (event === EVENTS.CharacterSettings) {
        this.editCharacterSettings = true;
      } else if (event === EVENTS.EditCharacter) {
        this.characterContextMenuService.setDisabled(true);
        this.router.navigate(['/home/dashboard', {outlets: {'middle-nav': ['editCharacters', this.playerCharacter.id]}}], {skipLocationChange: SKIP_LOCATION_CHANGE});
      } else if (event === EVENTS.RefreshCharacter) {
        this.refreshCharacter();
      } else if (event === EVENTS.ValidateCharacter) {
        this.validateCharacter = true;
      } else if (event === EVENTS.PromptToValidate) {
        this.promptToValidate();
      } else if (event === EVENTS.SettingsUpdated) {
        this.updateCalculatedColumns();
      } else if (event === EVENTS.JoinCampaign) {
        this.joinCampaign();
      } else if (event === EVENTS.LeaveCampaign) {
        this.leaveCampaign();
      } else if (event === EVENTS.PrintCharacter) {
        this.printCharacter();
      } else if (event === EVENTS.QuickReferences) {
        this.displayQuickReferences();
      } else if (event === EVENTS.PageOrderUpdated) {
        this.initializePages();
      } else if (event === EVENTS.ExportCharacter) {
        this.exportCharacter();
      }
    });

    this.routeSub = this.route.params.subscribe((params: { id: string }) => {
      this.loading = true;
      this.id = params.id;
      if (this.id === '0') {
        this.router.navigate(['/home/dashboard', {outlets: {'middle-nav': ['editCharacters', '0']}}], {skipLocationChange: SKIP_LOCATION_CHANGE});
      } else {
        this.refreshCharacter();
        this.characterContextMenuService.setId(this.id);
      }
    });

    this.queryParamsSub = this.route.queryParams
      .subscribe((params: {public: string, shared: string}) => {
        this.isPublic = params.public != null && params.public === 'true';
        this.isShared = params.shared != null && params.shared === 'true';
        this.characterContextMenuService.setIsAuthor(!this.isPublic && !this.isShared);
      });
  }

  private refreshCharacter(): void {
    this.characterService.getCharacter(this.id).then((playerCharacter: PlayerCharacter) => {
      if (playerCharacter == null) {
        const translatedMessage = this.translate.instant('Error.LoadingCharacter');
        this.notificationService.error(translatedMessage);
        this.loading = false;
      } else {
        this.updateCharacter(playerCharacter);
      }
    }, () => {
      this.notificationService.error(this.translate.instant('Error.LoadingCharacter'));
      this.loading = false;
    });
  }

  ngOnDestroy() {
    this.characterContextMenuService.setDisplay(false);
    this.eventSub.unsubscribe();
    this.resSub.unsubscribe();
    this.routeSub.unsubscribe();
    this.queryParamsSub.unsubscribe();
  }

  private updateCharacter(playerCharacter: PlayerCharacter): void {
    this.loading = true;
    if (playerCharacter.id === '0') {
      playerCharacter.characterSettings.pages = this.characterService.getDefaultPageOrders();
    }
    this.playerCharacter = playerCharacter;
    this.characterContextMenuService.setInCampaign(this.playerCharacter.campaignToken != null && this.playerCharacter.campaignToken !== '');
    this.validateAttunedItems();
    this.creatureService.initializeConfigurationCollection().then((collection: CreatureConfigurationCollection) => {
      this.characterService.addCharacterToCollection(this.playerCharacter, collection);
      this.collection = collection;
      this.characterService.initializeCharacteristics(this.playerCharacter, this.collection).then(() => {
        const promptToChooseStartingEquipment = localStorage.getItem(LOCAL_STORAGE.PROMPT_TO_CHOOSE_STARTING_EQUIPMENT);
        if (promptToChooseStartingEquipment === 'true') {
          this.promptToChooseStartingEquipment();
        }
        const promptToValidate = localStorage.getItem(LOCAL_STORAGE.PROMPT_TO_VALIDATE);
        if (promptToChooseStartingEquipment !== 'true' && promptToValidate === 'true') {
          this.promptToValidate();
        }
        this.updateCalculatedColumns();
        this.initializePages();
        this.loading = false;
      });
    });
    this.cd.detectChanges();
  }

  private validateAttunedItems(): void {
    const flatList = this.creatureItemService.getFlatItemList(this.playerCharacter.items);
    flatList.forEach((creatureItem: CreatureItem) => {
      if (creatureItem.attuned) {
        if (!this.characterService.canAttune(this.playerCharacter, creatureItem)) {
          creatureItem.attuned = false;
        }
      }
    });
  }

  editPageOrderClose(): void {
    this.editPageOrder = false;
  }

  editPageOrderContinue(): void {
    this.editPageOrder = false;
  }

  editCharacterSettingsClose(): void {
    this.editCharacterSettings = false;
  }

  editCharacterSettingsContinue(): void {
    this.editCharacterSettings = false;
  }

  validateCharacterClose(): void {
    this.validateCharacter = false;
  }

  validateCharacterContinue(): void {
    this.validateCharacter = false;
    this.refreshCharacter();
  }

  startingEquipmentClose(): void {
    this.chooseStartingEquipment = false;
    const promptToValidate = localStorage.getItem(LOCAL_STORAGE.PROMPT_TO_VALIDATE);
    if (promptToValidate === 'true') {
      this.promptToValidate();
    }
  }

  startingEquipmentContinue(): void {
    this.chooseStartingEquipment = false;
    this.refreshCharacter();
  }

  rollLogClose(): void {
    this.displayRollLog = false;
  }

  rollLogContinue(): void {
    this.displayRollLog = false;
  }

  close(): void {
    setTimeout(() => {
      this.router.navigate(['/home/dashboard', {outlets: {'middle-nav': ['default']}}], {skipLocationChange: SKIP_LOCATION_CHANGE});
    }, NAVIGATION_DELAY);
    if (this.id === '0') {
      this.router.navigate(['/home/dashboard',
        {outlets: {'middle-nav': ['default'], 'left-nav': ['default']}}], {skipLocationChange: SKIP_LOCATION_CHANGE});
    }
  }

  private promptToChooseStartingEquipment() {
    localStorage.setItem(LOCAL_STORAGE.PROMPT_TO_CHOOSE_STARTING_EQUIPMENT, false.toString());
    const data = new YesNoDialogData();
    data.title = this.translate.instant('StartingEquipment.Prompt.Title');
    data.message = this.translate.instant('StartingEquipment.Prompt.Message');
    data.yes = () => {
      this.chooseStartingEquipment = true;
    };
    data.no = () => {
      //do nothing
      const promptToValidate = localStorage.getItem(LOCAL_STORAGE.PROMPT_TO_VALIDATE);
      if (promptToValidate === 'true') {
        this.promptToValidate();
      }
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = data;
    this.dialog.open(YesNoDialogComponent, dialogConfig);
  }

  private promptToValidate(): void {
    localStorage.setItem(LOCAL_STORAGE.PROMPT_TO_VALIDATE, false.toString());
    const data = new YesNoDialogData();
    data.title = this.translate.instant('CharacterValidation.Prompt.Title');
    data.message = this.translate.instant('CharacterValidation.Prompt.Message');
    data.yes = () => {
      this.validateCharacter = true;
    };
    data.no = () => {
      //do nothing
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = data;
    this.dialog.open(YesNoDialogComponent, dialogConfig);
  }

  private updateCalculatedColumns(): void {
    if (this.isDesktop) {
      let numColumns = Math.floor(this.width / this.MIN_COLUMN_WIDTH);
      const maxColumns = this.playerCharacter.characterSettings.misc.maxColumns;
      if (numColumns > maxColumns) {
        numColumns = maxColumns;
      }
      if (numColumns < 1) {
        numColumns = 1;
      }
      this.calculatedColumns = numColumns;
    } else {
      this.calculatedColumns = 1;
    }
  }

  private joinCampaign(): void {
    this.showJoinCampaign = true;
  }

  closeJoinCampaign(): void {
    this.showJoinCampaign = false;
  }

  continueJoinCampaign(): void {
    this.characterContextMenuService.setInCampaign(true);
    this.showJoinCampaign = false;
  }

  private leaveCampaign(): void {
    const data = new ConfirmDialogData();
    data.title = this.translate.instant('Campaign.LeaveConfirmation.Title');
    data.message = this.translate.instant('Campaign.LeaveConfirmation.Message');
    data.confirm = () => {
      this.characterService.leaveCampaign(this.playerCharacter.id).then(() => {
        this.notificationService.success(this.translate.instant('Campaign.LeaveConfirmation.Success'));
        this.characterContextMenuService.setInCampaign(false);
      }, () => {
        this.notificationService.error(this.translate.instant('Campaign.LeaveConfirmation.Error'));
      });
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = data;
    this.dialog.open(ConfirmDialogComponent, dialogConfig);
  }

  private printCharacter(): void {
    this.printing = true;
  }

  cancelPrint(): void {
    this.printing = false;
  }

  private displayQuickReferences(): void {
    this.quickReferences = true;
  }

  closeQuickReferences(): void {
    this.quickReferences = false;
  }

  onSwipeLeft(event): void {
    if (this.verifySwipe(event)) {
      this.debounceSwipeLeft();
    }
  }

  private swipeLeft(): void {
    let index = this.mobileIndex + 1;
    if (index === this.pages.length) {
      index = 0;
    }
    this.mobileIndex = index;
  }

  private verifySwipe(event): boolean {
    const angle = Math.abs(event.angle);
    return !((angle >= 90 && angle < 150) || (angle > 30 && angle < 90));
  }

  onSwipeRight(event): void {
    if (this.verifySwipe(event)) {
      this.debounceSwipeRight();
    }
  }

  private swipeRight(): void {
    if (this.mobileIndex > 0) {
      this.mobileIndex--;
    } else {
      this.mobileIndex = this.pages.length - 1;
    }
  }

  private initializePages(): void {
    const pages: CharacterPageType[] = [];
    this.playerCharacter.characterSettings.pages.forEach((page: CharacterPage) => {
      if (page.visible) {
        pages.push(page.characterPageType);
      }
    });
    this.pages = pages;
    if (this.mobileIndex >= this.pages.length) {
      this.mobileIndex = this.pages.length - 1;
    }
  }

  onPageChange(characterPageType: CharacterPageType): void {
    let index = this.pages.indexOf(characterPageType);
    if (index === -1) {
      index = 0;
    }
    this.mobileIndex = index;
  }

  indexChange(event: MatSliderChange): void {
    this.mobileIndex = event.value;
  }

  private exportCharacter(): void {
    const item = new ManageListItem();
    item.listObject = new ListObject(this.playerCharacter.id, this.playerCharacter.name, this.playerCharacter.sid, true);
    item.menuItem = new MenuItem(this.playerCharacter.id, this.playerCharacter.name);
    const selectedItems = [item];
    this.exportDialogService.showExportDialog(selectedItems, false, this.exportDetailsService, 'PlayerCharacter', () => {}, this.playerCharacter);
  }
}
