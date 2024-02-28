import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FooterComponent} from './footer.component';
import {routing} from './footer.router';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    routing,
    TranslateModule
  ],
  declarations: [
    FooterComponent
  ],
  exports: [
    FooterComponent
  ],
  providers: []
})
export class FooterModule {
}
