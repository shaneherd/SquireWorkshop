import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {EventsService} from '../../../core/services/events.service';
import {EVENTS} from '../../../constants';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-death-save-results',
  templateUrl: './death-save-results.component.html',
  styleUrls: ['./death-save-results.component.scss']
})
export class DeathSaveResultsComponent implements OnInit, OnDestroy {
  @Input() success: boolean;
  @Input() disabled: boolean;
  @Input() numberChecked: number;
  @Output() onCheckChange = new EventEmitter();

  eventSub: Subscription;
  disable1 = false;
  disable2 = false;
  disable3 = false;

  checked1 = false;
  checked2 = false;
  checked3 = false;

  constructor(
    private eventsService: EventsService
  ) { }

  ngOnInit() {
    this.initialize();

    this.eventSub = this.eventsService.events.subscribe(event => {
      if (event === EVENTS.DeathSavesChanged) {
        this.initialize();
      }
    });
  }

  ngOnDestroy() {
    this.eventSub.unsubscribe();
  }

  private initialize(): void {
    this.checked1 = this.numberChecked >= 1;
    this.checked2 = this.numberChecked >= 2;
    this.checked3 = this.numberChecked >= 3;
    this.updateDisabledStates();
  }

  private dispatchClick(): void {
    setTimeout(() => {
      this.onCheckChange.emit(this.getNumChecked());
    });
  }

  private getNumChecked(): number {
    let numChecked = 0;
    numChecked += this.checked1 ? 1 : 0;
    numChecked += this.checked2 ? 1 : 0;
    numChecked += this.checked3 ? 1 : 0;
    return numChecked;
  }

  checkChange1(): void {
    if (this.disable1) {
      return;
    }
    this.checked1 = !this.checked1;
    this.updateDisabledStates();
    this.dispatchClick();
  }

  checkChange2(): void {
    if (this.disable2) {
      return;
    }
    this.checked2 = !this.checked2;
    this.updateDisabledStates();
    this.dispatchClick();
  }

  checkChange3(): void {
    if (this.disable3) {
      return;
    }
    this.checked3 = !this.checked3;
    this.updateDisabledStates();
    this.dispatchClick();
  }

  private updateDisabledStates(): void {
    if (!this.checked1) {
      this.disable1 = false;
      this.disable2 = true;
      this.disable3 = true;
    } else if (this.checked3) {
      this.disable1 = true;
      this.disable2 = true;
      this.disable3 = false;
    } else if (this.checked2) {
      this.disable1 = true;
      this.disable2 = false;
      this.disable3 = false;
    } else if (this.checked1) {
      this.disable1 = false;
      this.disable2 = false;
      this.disable3 = true;
    }
  }
}
