import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MenuItem} from '../../../../shared/models/menuItem.model';
import {ItemService} from '../../../../core/services/items/item.service';
import {Item} from '../../../../shared/models/items/item';

@Component({
  selector: 'app-add-remove-item-simple',
  templateUrl: './add-remove-item-simple.component.html',
  styleUrls: ['./add-remove-item-simple.component.scss']
})
export class AddRemoveItemSimpleComponent implements OnInit {
  @Input() item: MenuItem;
  @Output() save = new EventEmitter();
  @Output() cancel = new EventEmitter();

  loading = true;
  viewingItem: Item = null;

  constructor(
    private itemService: ItemService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.itemService.getItem(this.item.id).then((item: Item) => {
      this.viewingItem = item;
      this.loading = false;
    });
  }

  close(): void {
    this.cancel.emit();
  }

  continue(): void {
    this.save.emit(this.item);
  }
}
