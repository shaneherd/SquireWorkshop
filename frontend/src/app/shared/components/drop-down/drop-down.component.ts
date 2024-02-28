import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ListObject} from '../../models/list-object';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-drop-down',
  templateUrl: './drop-down.component.html',
  styleUrls: ['./drop-down.component.scss']
})
export class DropDownComponent implements OnInit {
  @Input() options: ListObject[] = [];
  @Output() optionChange = new EventEmitter();

  selectedOption = new ListObject('0', '');
  none = '';

  constructor(private translate: TranslateService) { }

  ngOnInit() {
    this.none = this.translate.instant('None');
  }

  optionChanged(option: ListObject): void {
    this.selectedOption = option;
    this.optionChange.emit(option);
  }

}
