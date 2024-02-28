import {Component} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {NgxLocalizedNumbersService} from 'ngx-localized-numbers';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Squire';

  constructor(translate: TranslateService,
              private localizedNumbersService: NgxLocalizedNumbersService) {
    translate.setDefaultLang('en');
    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use('en');

//    this.localizedNumbersService.addLocale('en_US', {
//      thousandSeparator: ',',
//      decimalSeparator: '.',
//      whitespaceBeforeCurrency: true,
//      currency: '$'
//    });

    this.localizedNumbersService.setLocale('en_US');
//    this.localizedNumbersService.setLocale('de_DE');
  }
}
