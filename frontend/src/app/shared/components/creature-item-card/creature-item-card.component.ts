import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CreatureItem} from '../../models/creatures/creature-item';
import {UtilService} from '../../../core/services/util.service';
import {CreatureItemService} from '../../../core/services/creatures/creature-item.service';
import {Creature} from '../../models/creatures/creature';
import {MagicalItemSpellConfiguration} from '../../models/items/magical-item-spell-configuration';
import {ItemType} from '../../models/items/item-type.enum';
import {MagicalItem} from '../../models/items/magical-item';

@Component({
  selector: 'app-creature-item-card',
  templateUrl: './creature-item-card.component.html',
  styleUrls: ['./creature-item-card.component.scss']
})
export class CreatureItemCardComponent implements OnInit {
  @Input() creature: Creature;
  @Input() creatureItem: CreatureItem;
  @Input() clickDisabled = false;
  @Input() displaySlot = true;
  @Input() displayTags = false;
  @Input() showNestedItems = false;
  @Input() allowNestedClick = true;
  @Output() itemClick = new EventEmitter<CreatureItem>();
  @Output() spellClick = new EventEmitter<MagicalItemSpellConfiguration>();

  debouncedSaveExpanded: () => void;
  previouslySavedState = false;
  showAdditionalSpells = false;

  constructor(
    private utilService: UtilService,
    private creatureItemService: CreatureItemService
  ) { }

  ngOnInit() {
    this.debouncedSaveExpanded = this.utilService.debounce(() => {
      this.saveExpandedState();
    }, 1000);
    this.previouslySavedState = this.creatureItem.expanded;
    this.initializeSpells();
  }

  private initializeSpells(): void {
    if (this.creatureItem.itemType === ItemType.MAGICAL_ITEM) {
      const magicalItem = this.creatureItem.item as MagicalItem;
      this.showAdditionalSpells = magicalItem.additionalSpells;
    }
  }

  onItemClick(creatureItem: CreatureItem): void {
    if (!this.clickDisabled) {
      this.itemClick.emit(creatureItem);
    }
  }

  onSpellClick(config: MagicalItemSpellConfiguration): void {
    if (!this.clickDisabled) {
      this.spellClick.emit(config);
    }
  }

  toggleExpanded(event: MouseEvent): void {
    event.stopPropagation();
    this.creatureItem.expanded = !this.creatureItem.expanded;
    this.debouncedSaveExpanded();
  }

  private saveExpandedState(): void {
    if (this.creatureItem.expanded !== this.previouslySavedState) {
      this.creatureItemService.updateExpanded(this.creature, this.creatureItem, this.creatureItem.expanded);
    }
  }

}
