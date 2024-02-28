import {ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {ComponentCanDeactivate} from '../../../../core/guards/pending-changes.guard';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material';
import {NotificationService} from '../../../../core/services/notification.service';
import {TranslateService} from '@ngx-translate/core';
import {Observable, Subscription} from 'rxjs';
import {NAVIGATION_DELAY, SKIP_LOCATION_CHANGE} from '../../../../constants';
import {CharacterLevel} from '../../../../shared/models/character-level';
import {CharacterLevelService} from '../../../../core/services/character-level.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-level-info',
  templateUrl: './level-info.component.html',
  styleUrls: ['./level-info.component.scss']
})
export class LevelInfoComponent implements OnInit, OnDestroy, ComponentCanDeactivate {
  public characterLevelForm: FormGroup;
  id: string;
  characterLevel: CharacterLevel;
  originalCharacterLevel: CharacterLevel;
  editing = false;
  cancelable = true;
  itemName = '';
  loading = false;
  routeSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private characterLevelService: CharacterLevelService,
    private router: Router,
    private cd: ChangeDetectorRef,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private translate: TranslateService
  ) { }

  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    return !this.editing;
  }

  ngOnInit() {
    this.characterLevel = new CharacterLevel();
    this.originalCharacterLevel = this.createCopyOfLevel(this.characterLevel);
    this.characterLevelForm = this.createForm();
    this.routeSub = this.route.params.subscribe((params: { id: string }) => {
      this.loading = true;
      this.updateCharacterLevel(new CharacterLevel());
      this.id = params.id;
      this.editing = this.id === '0';
      this.cancelable = this.id !== '0';
      if (this.id === '0') {
        this.itemName = this.translate.instant('Navigation.Manage.Levels.New');
        this.updateCharacterLevel(new CharacterLevel());
        this.loading = false;
      } else {
        this.characterLevelService.getCharacterLevel(this.id).then((characterLevel: CharacterLevel) => {
          if (characterLevel == null) {
            const translatedMessage = this.translate.instant('Error.Load');
            this.notificationService.error(translatedMessage);
          } else {
            this.itemName = characterLevel.name;
            this.updateCharacterLevel(characterLevel);
          }
          this.loading = false;
        });
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

  updateCharacterLevel(characterLevel: CharacterLevel): void {
    this.characterLevel = characterLevel;
    this.originalCharacterLevel = this.createCopyOfLevel(this.characterLevel);
    this.characterLevelForm.controls['name'].setValue(characterLevel.name);
    this.cd.detectChanges();
  }

  createForm(): FormGroup {
    return this.fb.group(
      {
        name: [null, Validators.compose([Validators.required])]
      }
    );
  }

  close(): void {
    setTimeout(() => {
      this.router.navigate(['/home/dashboard', {outlets: {'middle-nav': ['default']}}], {skipLocationChange: SKIP_LOCATION_CHANGE});
    }, NAVIGATION_DELAY);
  }

  save(): void {
    if (this.characterLevelForm.valid) {
      this.loading = true;
      const values = this.characterLevelForm.value;
      this.characterLevel.name = values.name;
      if (this.characterLevel.id == null || this.characterLevel.id === '0') {
        this.characterLevelService.createCharacterLevel(this.characterLevel).then((id: string) => {
          this.id = id;
          this.characterLevel.id = id;
          this.finishSaving();
        }, () => {
          const translatedMessage = this.translate.instant('Error.Save');
          this.notificationService.error(translatedMessage);
          this.loading = false;
        });
      } else {
        this.characterLevelService.updateCharacterLevel(this.characterLevel).then(() => {
          this.finishSaving();
        }, () => {
          const translatedMessage = this.translate.instant('Error.Save');
          this.notificationService.error(translatedMessage);
          this.loading = false;
        });
      }
    } else {
      const translatedMessage = this.translate.instant('Error.AllFieldsRequired');
      this.notificationService.error(translatedMessage);
    }
  }

  private finishSaving(): void {
    this.itemName = this.characterLevel.name;
    this.originalCharacterLevel = this.createCopyOfLevel(this.characterLevel);
    this.editing = false;
    this.cancelable = true;
    this.updateList(this.characterLevel.id);
    this.navigateToItem(this.id);
    this.loading = false;
  }

  private navigateToItem(id: string): void {
    this.router.navigate(['/home/dashboard', {outlets: {'middle-nav': ['levels', id]}}], {skipLocationChange: SKIP_LOCATION_CHANGE});
  }

  cancel(): void {
    this.characterLevel = this.createCopyOfLevel(this.originalCharacterLevel);
  }

  delete(): void {
    this.loading = true;
    this.characterLevelService.deleteCharacterLevel(this.characterLevel).then(() => {
      this.loading = false;
      this.updateList(null);
      this.close();
    }, () => {
      this.loading = false;
      const translatedMessage = this.translate.instant('Error.Delete');
      this.notificationService.error(translatedMessage);
    });
  }

  duplicate(name: string): void {
    this.loading = true;
    this.characterLevelService.duplicateCharacterLevel(this.characterLevel, name).then((id: string) => {
      this.loading = false;
      this.updateList(id);
      this.router.navigate(['/home/dashboard', {outlets: {'middle-nav': ['levels', id]}}], {skipLocationChange: SKIP_LOCATION_CHANGE});
    }, () => {
      this.loading = false;
      const translatedMessage = this.translate.instant('Error.Duplicate');
      this.notificationService.error(translatedMessage);
    });
  }

  private updateList(id: string): void {
    this.characterLevelService.updateMenuItems(id);
  }

  createCopyOfLevel(characterLevel: CharacterLevel): CharacterLevel {
    return _.cloneDeep(characterLevel);
  }
}
