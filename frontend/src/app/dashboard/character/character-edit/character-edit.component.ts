import {ChangeDetectorRef, Component, HostListener, Input, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PlayerCharacter} from '../../../shared/models/creatures/characters/player-character';
import {CreatureConfigurationCollection} from '../../../shared/models/creatures/configs/creature-configuration-collection';
import {LOCAL_STORAGE, NAVIGATION_DELAY, SKIP_LOCATION_CHANGE} from '../../../constants';
import {NotificationService} from '../../../core/services/notification.service';
import {CreatureService} from '../../../core/services/creatures/creature.service';
import {CharacterService} from '../../../core/services/creatures/character.service';
import {TranslateService} from '@ngx-translate/core';
import {Observable, Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {CharacterContextMenuService} from '../../../shared/components/character-context-menu/character-context-menu.service';
import {ComponentCanDeactivate} from '../../../core/guards/pending-changes.guard';
import {CharacterLevelService} from '../../../core/services/character-level.service';
import {ChosenClass} from '../../../shared/models/creatures/characters/chosen-class';
import {ManageListItem} from '../../../shared/components/manage-list/manage-list.component';
import {ListObject} from '../../../shared/models/list-object';
import {MenuItem} from '../../../shared/models/menuItem.model';
import {ExportDialogService} from '../../../core/services/export/export-dialog.service';
import {ExportCreatureService} from '../../../core/services/export/export-creature.service';

@Component({
  selector: 'app-character-edit',
  templateUrl: './character-edit.component.html',
  styleUrls: ['./character-edit.component.scss']
})
export class CharacterEditComponent implements OnInit, OnDestroy, ComponentCanDeactivate {
  public characterForm: FormGroup;
  id: string;
  isDesktop = true;
  itemName = '';
  cancelable = true;
  loading = false;
  saving = false;
  playerCharacter: PlayerCharacter;
  collection: CreatureConfigurationCollection = new CreatureConfigurationCollection();
  newCharacter = false;

  routeSub: Subscription;

  constructor(
    private cd: ChangeDetectorRef,
    private fb: FormBuilder,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private characterContextMenuService: CharacterContextMenuService,
    private router: Router,
    private notificationService: NotificationService,
    private characterLevelService: CharacterLevelService,
    private creatureService: CreatureService,
    private characterService: CharacterService,
    private exportDialogService: ExportDialogService,
    private exportDetailsService: ExportCreatureService
  ) { }

  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    return false;
  }

  ngOnInit() {
    this.characterForm = this.createForm();
    this.playerCharacter = new PlayerCharacter();

    this.characterContextMenuService.setDisplay(true);

    this.itemName = this.translate.instant('Navigation.Characters.EditCharacter');
    this.routeSub = this.route.params.subscribe((params: { id: string }) => {
      this.loading = true;
      this.id = params.id;
      this.cancelable = this.id !== '0';
      if (this.id === '0') {
        this.newCharacter = true;
        this.characterContextMenuService.setDisabled(true);
        this.itemName = this.translate.instant('Navigation.Manage.Characters.New');
        this.updateCharacter(new PlayerCharacter());
      } else {
        this.newCharacter = false;
        this.characterService.getCharacter(this.id).then((playerCharacter: PlayerCharacter) => {
          if (playerCharacter == null) {
            const translatedMessage = this.translate.instant('Error.Load');
            this.notificationService.error(translatedMessage);
            this.loading = false;
          } else {
            this.itemName = playerCharacter.name;
            this.updateCharacter(playerCharacter);
          }
        });
        this.characterContextMenuService.setId(this.id);
      }
    });
  }

  ngOnDestroy() {
    this.characterContextMenuService.setDisabled(false);
    this.routeSub.unsubscribe();
  }

  private updateCharacter(playerCharacter: PlayerCharacter): void {
    this.loading = true;
    if (playerCharacter.id === '0') {
      playerCharacter.characterSettings.pages = this.characterService.getDefaultPageOrders();
    }
    this.characterForm.controls['name'].setValue(playerCharacter.name);
    this.playerCharacter = playerCharacter;
    this.creatureService.initializeConfigurationCollection().then((collection: CreatureConfigurationCollection) => {
      this.characterService.addCharacterToCollection(this.playerCharacter, collection);
      this.collection = collection;
      this.loading = false;
    });
  }

  private createForm(): FormGroup {
    return this.fb.group(
      {
        name: [null, Validators.compose([Validators.required])]
      }
    );
  }

  save(): void {
    if (this.characterForm.valid) {
      if (this.valid()) {
        this.saving = true;
        const values = this.characterForm.value;
        this.playerCharacter.name = values.name;
        this.characterService.setFromCollections(this.playerCharacter, this.collection);
        if (this.playerCharacter.id == null || this.playerCharacter.id === '0') {
          this.playerCharacter.creatureHealth = this.characterService.resetCreatureHealth(this.playerCharacter, this.collection, true, false);
          this.characterService.createCharacter(this.playerCharacter).then((id: string) => {
            this.id = id;
            this.playerCharacter.id = id;
            this.cancelable = true;
            this.finishSaving();
          }, () => {
            this.errorSaving();
          });
        } else {
          this.characterService.updateIfOverMaxHp(this.playerCharacter, this.collection);
          this.characterService.updateCharacter(this.playerCharacter).then(() => {
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

  private valid(): boolean {
    const totalLevelByExp = parseInt(this.characterLevelService.getLevelByExpInstant(this.playerCharacter.exp).name, 10);
    let calculatedTotalLevel = 0;
    this.playerCharacter.classes.forEach((chosenClass: ChosenClass) => {
      calculatedTotalLevel += parseInt(chosenClass.characterLevel.name, 10);
    });
    if (calculatedTotalLevel !== totalLevelByExp) {
      this.notificationService.error(this.translate.instant('Error.EditCharacter.TotalLevel'));
      return false;
    }
    for (let i = 0; i < this.playerCharacter.classes.length; i++) {
      const chosenClass = this.playerCharacter.classes[i];
      if (this.missingHealthGainResults(chosenClass)) {
        this.notificationService.error(this.translate.instant('Error.HealthValuesNotAssigned'));
        return false;
      }
    }
    return true;
  }

  private missingHealthGainResults(chosenClass: ChosenClass): boolean {
    const level = parseInt(chosenClass.characterLevel.name, 10);
    for (let i = (chosenClass.primary ? 1 : 0); i < chosenClass.healthGainResults.length; i++) {
      const result = chosenClass.healthGainResults[i];
      if (parseInt(result.level.name, 10) <= level && result.value === 0) {
        return true;
      }
    }
    return false;
  }

  private finishSaving(): void {
    this.itemName = this.playerCharacter.name;
    this.updateList(this.id);
    this.cd.detectChanges();
    this.saving = false;
    this.characterContextMenuService.setDisabled(false);
    this.navigateToCharacter(this.id);
    localStorage.setItem(LOCAL_STORAGE.PROMPT_TO_VALIDATE, true.toString());
    if (this.newCharacter) {
      localStorage.setItem(LOCAL_STORAGE.PROMPT_TO_CHOOSE_STARTING_EQUIPMENT, true.toString());
    }
  }

  private navigateToCharacter(id: string): void {
    this.router.navigate(['/home/dashboard', {outlets: {'middle-nav': ['characters', id]}}], {skipLocationChange: SKIP_LOCATION_CHANGE});
  }

  private navigateToDefaultCharacter(): void {
    this.router.navigate(['/home/dashboard', {outlets: {'middle-nav': ['default'], 'side-nav': ['characters']}}], {skipLocationChange: SKIP_LOCATION_CHANGE});
  }

  private errorSaving(): void {
    const translatedMessage = this.translate.instant('Error.Save');
    this.notificationService.error(translatedMessage);
    this.saving = false;
  }

  cancel(): void {
    this.characterContextMenuService.setDisabled(false);
    if (this.id === '0') {
      this.navigateToDefaultCharacter();
    } else {
      this.navigateToCharacter(this.id);
    }
  }

  delete(): void {
    this.loading = true;
    this.characterService.deleteCharacter(this.playerCharacter).then(() => {
      this.loading = false;
      this.updateList(null);
      this.navigateToDefaultCharacter();
    }, () => {
      this.loading = false;
      const translatedMessage = this.translate.instant('Error.Delete');
      this.notificationService.error(translatedMessage);
    });
  }

  exportClick(): void {
    const item = new ManageListItem();
    item.listObject = new ListObject(this.playerCharacter.id, this.playerCharacter.name, 0, true);
    item.menuItem = new MenuItem(this.playerCharacter.id, this.playerCharacter.name);
    const selectedItems = [item];
    this.exportDialogService.showExportDialog(selectedItems, false, this.exportDetailsService, 'Characters', () => {}, this.playerCharacter);
  }

  duplicate(name: string): void {
    this.loading = true;
    this.characterService.duplicateCharacter(this.playerCharacter, name).then((id: string) => {
      this.loading = false;
      this.updateList(id);
      this.navigateToCharacter(id);
    }, () => {
      this.loading = false;
      const translatedMessage = this.translate.instant('Error.Duplicate');
      this.notificationService.error(translatedMessage);
    });
  }

  private updateList(id: string): void {
    this.characterService.updateMenuItems(id);
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
}
