import {Component, EventEmitter, HostListener, Input, Output, ViewChild} from '@angular/core';
import {SpellMenuItem} from '../spell-selection-list/spell-selection-list.component';
import {CdkVirtualScrollViewport} from '@angular/cdk/scrolling';

@Component({
  selector: 'app-spell-selection-items',
  templateUrl: './spell-selection-items.component.html',
  styleUrls: ['./spell-selection-items.component.scss']
})
export class SpellSelectionItemsComponent {
  @Input() spells: SpellMenuItem[] = [];
  @Input() loading = false;
  @Input() allowMultiSelect = true;
  @Output() spellClick = new EventEmitter();
  @Output() checkChange = new EventEmitter();

  @ViewChild(CdkVirtualScrollViewport, {static: false})
  viewport: CdkVirtualScrollViewport;

  constructor() { }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.viewport.checkViewportSize();
  }

  toggleSelected(spell: SpellMenuItem): void {
    if (!spell.selected && !this.allowMultiSelect) {
      this.spells.forEach((menuItem: SpellMenuItem) => {
        menuItem.selected = false;
      });
    }
    spell.selected = !spell.selected;
    this.checkChange.emit(spell);
  }

  onSpellClick(spell: SpellMenuItem): void {
    this.spellClick.emit(spell);
  }
}
