import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ItemService} from '../../../../core/services/items/item.service';
import {Item} from '../../../../shared/models/items/item';
import {Creature} from '../../../../shared/models/creatures/creature';
import {CreatureConfigurationCollection} from '../../../../shared/models/creatures/configs/creature-configuration-collection';
import {SelectionItem} from '../../../../shared/models/items/selection-item';

@Component({
  selector: 'app-add-remove-item',
  templateUrl: './add-remove-item.component.html',
  styleUrls: ['./add-remove-item.component.scss']
})
export class AddRemoveItemComponent implements OnInit {
  @Input() selectionItem: SelectionItem;
  @Input() creature: Creature;
  @Input() collection: CreatureConfigurationCollection;
  @Input() selectable = true;
  @Input() disabled = false;
  @Output() save = new EventEmitter<SelectionItem>();
  @Output() cancel = new EventEmitter();

  loading = true;
  viewingItem: Item = null;

  constructor(
    private itemService: ItemService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.itemService.getItem(this.selectionItem.item.id).then((item: Item) => {
      this.viewingItem = item;
      this.loading = false;
    });
  }

  close(): void {
    this.cancel.emit();
  }

  continue(): void {
    this.save.emit(this.selectionItem);
  }

}
