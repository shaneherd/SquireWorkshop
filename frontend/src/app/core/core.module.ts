import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {routes, routing} from './core.routing';
import {AuthGuard} from './guards/auth.guard';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {TokenInterceptorService} from './interceptors/token-interceptor.service';
import {FooterModule} from './footer/footer.module';
import {PageNotFoundComponent} from './components/page-not-found/page-not-found.component';
import {TimeoutDialogComponent} from './components/timeout-dialog/timeout-dialog.component';
import {
  MatDialogModule, MatFormFieldModule, MatIconModule, MatSelectModule, MatTooltipModule
} from '@angular/material';
import {TranslateModule} from '@ngx-translate/core';
import {NgxLocalizedNumbers} from 'ngx-localized-numbers';
import { DangerZoneConfirmationComponent } from './components/danger-zone-confirmation/danger-zone-confirmation.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ShowHidePasswordModule} from 'ngx-show-hide-password';
import {Router} from '@angular/router';
import {ResolutionService} from './services/resolution.service';
import {PendingChangesGuard} from './guards/pending-changes.guard';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { DuplicateItemComponent } from './components/duplicate-item/duplicate-item.component';
import { ItemFilterDialogComponent } from './components/filters/item-filter-dialog/item-filter-dialog.component';
import { FilterComponent } from './components/filters/filter/filter.component';
import { SpellFilterDialogComponent } from './components/filters/spell-filter-dialog/spell-filter-dialog.component';
import { FeatureFilterDialogComponent } from './components/filters/feature-filter-dialog/feature-filter-dialog.component';
import { YesNoFilterComponent } from './components/filters/yes-no-filter/yes-no-filter.component';
import { AttackRollResultComponent } from './components/roll-results/attack-roll-result/attack-roll-result.component';
import {RollResultDialogComponent} from './components/roll-results/roll-result-dialog/roll-result-dialog.component';
import {StandardRollResultComponent} from './components/roll-results/standard-roll-result/standard-roll-result.component';
import {SharedModule} from '../shared/shared.module';
import { DamageRollResultComponent } from './components/roll-results/damage-roll-result/damage-roll-result.component';
import { RollResultDetailsComponent } from './components/roll-results/roll-result-details/roll-result-details.component';
import {SortComponent} from './components/sorts/sort/sort.component';
import {SpellSortDialogComponent} from './components/sorts/spell-sort-dialog/spell-sort-dialog.component';
import {MatRadioModule} from '@angular/material/radio';
import {FeatureSortDialogComponent} from './components/sorts/feature-sort-dialog/feature-sort-dialog.component';
import { NoteSortDialogComponent } from './components/sorts/note-sort-dialog/note-sort-dialog.component';
import { NoteFilterDialogComponent } from './components/filters/note-filter-dialog/note-filter-dialog.component';
import { SortDialogComponent } from './components/sorts/sort-dialog/sort-dialog.component';
import { SkillSortDialogComponent } from './components/sorts/skill-sort-dialog/skill-sort-dialog.component';
import { ConditionSortDialogComponent } from './components/sorts/condition-sort-dialog/condition-sort-dialog.component';
import { ConditionFilterDialogComponent } from './components/filters/condition-filter-dialog/condition-filter-dialog.component';
import { SkillFilterDialogComponent } from './components/filters/skill-filter-dialog/skill-filter-dialog.component';
import { DialogComponent } from './components/dialog/dialog.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { YesNoDialogComponent } from './components/yes-no-dialog/yes-no-dialog.component';
import { ValidateCharacterIgnoreFeaturesDialogComponent } from './components/validate-character-ignore-features-dialog/validate-character-ignore-features-dialog.component';
import {MatCardModule} from '@angular/material/card';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import { InUseDialogComponent } from './components/in-use-dialog/in-use-dialog.component';
import { NotificationDialogComponent } from './components/notification-dialog/notification-dialog.component';
import { OkDialogComponent } from './components/ok-dialog/ok-dialog.component';
import { ImportResultsDialogComponent } from './components/import-results-dialog/import-results-dialog.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { AddToMyStuffConfirmationDialogComponent } from './components/sharing/add-to-my-stuff-confirmation-dialog/add-to-my-stuff-confirmation-dialog.component';
import { MonsterFilterDialogComponent } from './components/filters/monster-filter-dialog/monster-filter-dialog.component';
import { ManageResultsDialogComponent } from './components/manage-results-dialog/manage-results-dialog.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

@NgModule({
    imports: [
        CommonModule,
        routing,
        FormsModule,
        FooterModule,
        MatFormFieldModule,
        MatDialogModule,
        MatCheckboxModule,
        MatCardModule,
        MatExpansionModule,
        MatDividerModule,
        MatIconModule,
        MatButtonModule,
        TranslateModule,
        ReactiveFormsModule,
        NgxLocalizedNumbers,
        MatSelectModule,
        MatRadioModule,
        ShowHidePasswordModule,
        MatTooltipModule,
        SharedModule,
        MatIconModule,
        MatProgressBarModule,
        MatSlideToggleModule
    ],
  declarations: [
    PageNotFoundComponent,
    TimeoutDialogComponent,
    DangerZoneConfirmationComponent,
    ConfirmDialogComponent,
    DuplicateItemComponent,
    ItemFilterDialogComponent,
    FilterComponent,
    SortComponent,
    SpellSortDialogComponent,
    SpellFilterDialogComponent,
    FeatureSortDialogComponent,
    FeatureFilterDialogComponent,
    YesNoFilterComponent,
    RollResultDialogComponent,
    StandardRollResultComponent,
    AttackRollResultComponent,
    DamageRollResultComponent,
    RollResultDetailsComponent,
    NoteSortDialogComponent,
    NoteFilterDialogComponent,
    SortDialogComponent,
    SkillSortDialogComponent,
    ConditionSortDialogComponent,
    ConditionFilterDialogComponent,
    SkillFilterDialogComponent,
    DialogComponent,
    YesNoDialogComponent,
    ValidateCharacterIgnoreFeaturesDialogComponent,
    InUseDialogComponent,
    NotificationDialogComponent,
    OkDialogComponent,
    ImportResultsDialogComponent,
    AddToMyStuffConfirmationDialogComponent,
    MonsterFilterDialogComponent,
    ManageResultsDialogComponent
  ],
  exports: [
  ],
  providers: [
    AuthGuard,
    PendingChangesGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    }
  ]
})
export class CoreModule {
  isDesktop = true;
  constructor(router: Router, resolutionService: ResolutionService) {
    resolutionService.width.subscribe(width => {
      const newIsDesktop = ResolutionService.isDesktop(width);
      if (newIsDesktop !== this.isDesktop) {
        this.isDesktop = newIsDesktop;
        router.resetConfig(routes);
      }
    });
  }
}
