import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Monster} from '../../../../shared/models/creatures/monsters/monster';

@Component({
  selector: 'app-monster-details-slide-in',
  templateUrl: './monster-details-slide-in.component.html',
  styleUrls: ['./monster-details-slide-in.component.scss']
})
export class MonsterDetailsSlideInComponent implements OnInit {
  @Input() monster: Monster;
  @Output() close = new EventEmitter();

  loading = false;

  constructor() { }

  ngOnInit() {
  }

  closeClick(): void {
    this.close.emit();
  }

}
