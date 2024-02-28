import {Component, Input} from '@angular/core';
import {ListModifier} from '../../models/list-modifier';

@Component({
  selector: 'app-modifier-list',
  templateUrl: './modifier-list.component.html',
  styleUrls: ['./modifier-list.component.scss']
})
export class ModifierListComponent {
  @Input() modifiers: ListModifier[];
  @Input() editing: boolean;
  constructor() { }

  hasModifiers(): boolean {
    for (let i = 0; i < this.modifiers.length; i++) {
      if (this.modifiers[i].value > 0) {
        return true;
      }
    }
    return false;
  }

}
