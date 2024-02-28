import {NgModule} from '@angular/core';
import {TimeoutDialogComponent} from './core/components/timeout-dialog/timeout-dialog.component';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClient} from '@angular/common/http';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {DangerZoneConfirmationComponent} from './core/components/danger-zone-confirmation/danger-zone-confirmation.component';
import {HttpLoaderFactory} from './app.module';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {MatDialogModule} from '@angular/material';

@NgModule({
  declarations: [],
  imports: [
    HttpClientTestingModule,
    RouterTestingModule,
    MatDialogModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [],
  entryComponents: [
    TimeoutDialogComponent
  ]
})
export class SquireTestModule {
}
