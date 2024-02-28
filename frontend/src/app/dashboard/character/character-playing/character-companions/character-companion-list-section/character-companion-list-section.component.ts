import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CompanionType} from '../../../../../shared/models/creatures/companions/companion-type.enum';
import {CompanionListObject} from '../../../../../shared/models/creatures/companions/companion-list-object';

@Component({
  selector: 'app-character-companion-list-section',
  templateUrl: './character-companion-list-section.component.html',
  styleUrls: ['./character-companion-list-section.component.scss']
})
export class CharacterCompanionListSectionComponent {
  @Input() companionType: CompanionType;
  @Input() companions: CompanionListObject[] = [];
  @Input() clickDisabled = false;
  @Input() showHeader = true;
  @Output() companionClick = new EventEmitter<CompanionListObject>();

  constructor() { }

  onCompanionClick(companion: CompanionListObject): void {
    this.companionClick.emit(companion);
  }
}
