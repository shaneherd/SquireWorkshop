import {Component, Input, OnInit} from '@angular/core';
import {FilterOption} from '../filter-option';
import {TranslateService} from '@ngx-translate/core';
import {FilterValue} from '../filter-value';

@Component({
  selector: 'app-yes-no-filter',
  templateUrl: './yes-no-filter.component.html',
  styleUrls: ['./yes-no-filter.component.scss']
})
export class YesNoFilterComponent implements OnInit {
  @Input() filterValue: FilterValue;
  yesNoOptions: FilterOption[] = [];

  constructor(
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.initializeOptions();
  }

  initializeOptions(): void {
    this.yesNoOptions = [];
    this.yesNoOptions.push(new FilterOption('ALL', this.translate.instant('All')));
    this.yesNoOptions.push(new FilterOption('1', this.translate.instant('Yes')));
    this.yesNoOptions.push(new FilterOption('0', this.translate.instant('No')));
  }

}
