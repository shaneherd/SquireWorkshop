import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-encounter-header',
  templateUrl: './encounter-header.component.html',
  styleUrls: ['./encounter-header.component.scss']
})
export class EncounterHeaderComponent implements OnInit {
  @Input() name = '';
  @Input() desktop = true;
  @Input() notificationsActive = false;
  @Output() initiative = new EventEmitter();
  @Output() attack = new EventEmitter();
  @Output() roll = new EventEmitter();
  @Output() notifications = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  initiativeClick(): void {
    this.initiative.emit();
  }

  attackClick(): void {
    this.attack.emit();
  }

  notificationsClick(): void {
    this.notifications.emit();
  }

  rollClick(): void {
    this.roll.emit();
  }
}
