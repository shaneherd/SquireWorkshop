import {Component, EventEmitter, HostListener, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MagicalItemApplicability} from '../../../../../shared/models/items/magical-item-applicability';
import {MagicalItemApplicabilityType} from '../../../../../shared/models/items/magical-item-applicability-type.enum';
import * as _ from 'lodash';
import {SpellMenuItem} from '../../../../selection-list/spell-selection-list/spell-selection-list.component';
import {SelectionItem} from '../../../../../shared/models/items/selection-item';
import {SpellListObject} from '../../../../../shared/models/powers/spell-list-object';
import {SpellService} from '../../../../../core/services/powers/spell.service';
import {Filters} from '../../../../../core/components/filters/filters';
import {CdkVirtualScrollViewport} from '@angular/cdk/scrolling';
import {ListSource} from '../../../../../shared/models/list-source.enum';

@Component({
  selector: 'app-magical-item-spell-selection',
  templateUrl: './magical-item-spell-selection.component.html',
  styleUrls: ['./magical-item-spell-selection.component.scss']
})
export class MagicalItemSpellSelectionComponent implements OnInit {
  @Input() selectedMagicalItem: SelectionItem;
  @Output() cancel = new EventEmitter();
  @Output() continue = new EventEmitter<SpellMenuItem>();

  @ViewChild(CdkVirtualScrollViewport, {static: false})
  viewport: CdkVirtualScrollViewport;

  loading = false;
  spellMenuItems: SpellMenuItem[] = [];
  viewingSpell: SpellMenuItem = null;
  selectedItem: SpellMenuItem = null;

  constructor(
    private spellService: SpellService
  ) { }

  ngOnInit() {
    this.initializeSpells();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.viewport.checkViewportSize();
  }

  private initializeSpells(): void {
    let items: SpellListObject[] = [];
    const promises: Promise<any>[] = [];
    this.selectedMagicalItem.item.applicableSpells.forEach((magicalItemApplicability: MagicalItemApplicability) => {
      if (magicalItemApplicability.magicalItemApplicabilityType === MagicalItemApplicabilityType.SPELL && magicalItemApplicability.spell != null) {
        items.push(magicalItemApplicability.spell);
      } else if (magicalItemApplicability.magicalItemApplicabilityType === MagicalItemApplicabilityType.FILTER) {
        if (magicalItemApplicability.filters == null) {
          magicalItemApplicability.filters = new Filters();
        }
        promises.push(this.spellService.getSpellsWithFilters(ListSource.MY_STUFF, magicalItemApplicability.filters).then((response: SpellListObject[]) => {
          items = items.concat(response);
        }));
      }
    });
    Promise.all(promises).then(() => {
      const spellMenuItems: SpellMenuItem[] = [];
      const uniqueItems: SpellListObject[] = _.uniqBy(items, (item: SpellListObject) => { return item.id; })
      const sorted = _.sortBy(uniqueItems, item => item.name.toLowerCase())

      sorted.forEach((spell: SpellListObject) => {
        const spellMenuItem = new SpellMenuItem(spell);
        spellMenuItem.selected = this.selectedMagicalItem != null
          && this.selectedMagicalItem.selectedSpell != null
          && this.selectedMagicalItem.selectedSpell.id === spell.id;
        spellMenuItems.push(spellMenuItem);
        if (spellMenuItem.selected) {
          this.selectedItem = spellMenuItem;
        }
      });
      this.spellMenuItems = spellMenuItems;

      if (this.spellMenuItems.length === 1) {
        this.toggleSelected(this.spellMenuItems[0]);
        this.onContinue();
      }
    });
  }

  onContinue(): void {
    this.continue.emit(this.selectedItem);
  }

  onCancel(): void {
    this.cancel.emit();
  }

  onItemClick(spellMenuItem: SpellMenuItem): void {
    this.viewingSpell = spellMenuItem;
  }

  closeItem(): void {
    this.viewingSpell = null;
  }

  toggleSelected(spellMenuItem: SpellMenuItem): void {
    const newSelectedState = !spellMenuItem.selected;
    if (newSelectedState) {
      if (this.selectedItem != null) {
        this.selectedItem.selected = false;
      }
      spellMenuItem.selected = true;
      this.selectedItem = spellMenuItem;
    } else {
      spellMenuItem.selected = false;
      this.selectedItem = null;
    }
    this.viewingSpell = null;
  }
}
