import {NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule} from '@angular/router';
import {AppComponent} from './app.component';
import {TimeoutDialogComponent} from './core/components/timeout-dialog/timeout-dialog.component';
import {UserIdleModule} from 'angular-user-idle';
import {CoreModule} from './core/core.module';
import {HeaderModule} from './core/header/header.module';
import {FooterModule} from './core/footer/footer.module';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {NgxLocalizedNumbers} from 'ngx-localized-numbers';
import {DangerZoneConfirmationComponent} from './core/components/danger-zone-confirmation/danger-zone-confirmation.component';
import {ShowHidePasswordModule} from 'ngx-show-hide-password';
import {ConfirmDialogComponent} from './core/components/confirm-dialog/confirm-dialog.component';
import {DuplicateItemComponent} from './core/components/duplicate-item/duplicate-item.component';
import {ItemFilterDialogComponent} from './core/components/filters/item-filter-dialog/item-filter-dialog.component';
import {SpellFilterDialogComponent} from './core/components/filters/spell-filter-dialog/spell-filter-dialog.component';
import {FeatureFilterDialogComponent} from './core/components/filters/feature-filter-dialog/feature-filter-dialog.component';
import {NgxMatSelectSearchModule} from 'ngx-mat-select-search';
import {RollResultDialogComponent} from './core/components/roll-results/roll-result-dialog/roll-result-dialog.component';
import {SpellSortDialogComponent} from './core/components/sorts/spell-sort-dialog/spell-sort-dialog.component';
import {FeatureSortDialogComponent} from './core/components/sorts/feature-sort-dialog/feature-sort-dialog.component';
import {NoteFilterDialogComponent} from './core/components/filters/note-filter-dialog/note-filter-dialog.component';
import {NoteSortDialogComponent} from './core/components/sorts/note-sort-dialog/note-sort-dialog.component';
import {ConditionSortDialogComponent} from './core/components/sorts/condition-sort-dialog/condition-sort-dialog.component';
import {SkillSortDialogComponent} from './core/components/sorts/skill-sort-dialog/skill-sort-dialog.component';
import {ConditionFilterDialogComponent} from './core/components/filters/condition-filter-dialog/condition-filter-dialog.component';
import {SkillFilterDialogComponent} from './core/components/filters/skill-filter-dialog/skill-filter-dialog.component';
import {YesNoDialogComponent} from './core/components/yes-no-dialog/yes-no-dialog.component';
import {ValidateCharacterIgnoreFeaturesDialogComponent} from './core/components/validate-character-ignore-features-dialog/validate-character-ignore-features-dialog.component';
import {InUseDialogComponent} from './core/components/in-use-dialog/in-use-dialog.component';
import {NotificationDialogComponent} from './core/components/notification-dialog/notification-dialog.component';
import {OkDialogComponent} from './core/components/ok-dialog/ok-dialog.component';
import {ImportResultsDialogComponent} from './core/components/import-results-dialog/import-results-dialog.component';
import {AddToMyStuffConfirmationDialogComponent} from './core/components/sharing/add-to-my-stuff-confirmation-dialog/add-to-my-stuff-confirmation-dialog.component';
import {MonsterFilterDialogComponent} from './core/components/filters/monster-filter-dialog/monster-filter-dialog.component';
import {ManageResultsDialogComponent} from './core/components/manage-results-dialog/manage-results-dialog.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserAnimationsModule,
    CoreModule,
    HeaderModule,
    FooterModule,
    RouterModule,
    UserIdleModule.forRoot({idle: 3300, timeout: 120, ping: 600}), //idle = 55 minutes, timeout = 2 minutes, ping = 10 minutes
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    NgxLocalizedNumbers.forRoot(),
    NgxMatSelectSearchModule,
    ShowHidePasswordModule,
    MatSlideToggleModule
  ],
  providers: [],
  entryComponents: [
    DangerZoneConfirmationComponent,
    TimeoutDialogComponent,
    ConfirmDialogComponent,
    YesNoDialogComponent,
    RollResultDialogComponent,
    DuplicateItemComponent,
    InUseDialogComponent,
    NotificationDialogComponent,
    OkDialogComponent,
    ImportResultsDialogComponent,
    AddToMyStuffConfirmationDialogComponent,
    ManageResultsDialogComponent,

    ItemFilterDialogComponent,
    SpellFilterDialogComponent,
    NoteFilterDialogComponent,
    FeatureFilterDialogComponent,
    ConditionFilterDialogComponent,
    SkillFilterDialogComponent,
    MonsterFilterDialogComponent,

    SpellSortDialogComponent,
    NoteSortDialogComponent,
    FeatureSortDialogComponent,
    ConditionSortDialogComponent,
    SkillSortDialogComponent,
    ValidateCharacterIgnoreFeaturesDialogComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
