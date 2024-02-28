import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ItemQuantity} from '../../../../shared/models/items/item-quantity';

@Component({
  selector: 'app-monster-item-configuration',
  templateUrl: './monster-item-configuration.component.html',
  styleUrls: ['./monster-item-configuration.component.scss']
})
export class MonsterItemConfigurationComponent implements OnInit {
  @Input() itemQuantity: ItemQuantity;
  @Input() editing: boolean;
  @Output() close = new EventEmitter();
  @Output() continue = new EventEmitter();
  @Output() remove = new EventEmitter();

  loading = false;
  originalQuantity = 0;

  constructor() { }

  ngOnInit() {
    this.originalQuantity = this.itemQuantity.quantity;
  }

  continueClick(): void {
    this.continue.emit(this.itemQuantity);
  }

  removeClick(): void {
    this.remove.emit(this.itemQuantity);
  }

  cancelClick(): void {
    this.itemQuantity.quantity = this.originalQuantity;
    this.close.emit(this.itemQuantity);
  }

  quantityChange(input): void {
    this.itemQuantity.quantity = parseInt(input.value, 10);
  }

}
