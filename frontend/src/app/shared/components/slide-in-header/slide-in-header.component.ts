import {Component, Input} from '@angular/core';
import {SlideInHeader} from '../../models/slideInHeader.model';
import {EventsService} from '../../../core/services/events.service';
import {ListObject} from '../../models/list-object';
import {PageMenuAction} from '../../../dashboard/character/character-playing/character-playing.component';

@Component({
  selector: 'app-slide-in-header',
  templateUrl: './slide-in-header.component.html',
  styleUrls: ['./slide-in-header.component.scss']
})
export class SlideInHeaderComponent {
  @Input() slideInHeader: SlideInHeader;
  @Input() listObject: ListObject;
  @Input() headerName: string;
  @Input() actions: PageMenuAction[] = [];

  constructor(
    private eventsService: EventsService
  ) { }

  leftButtonClick(): void {
    if (this.slideInHeader != null) {
      if (this.slideInHeader.configurable) {
        this.configure();
      } else if (this.slideInHeader.showBack) {
        this.back();
      } else if (this.slideInHeader.showShare) {
        this.share();
      }
    }
  }

  private back(): void {
    if (this.slideInHeader.showBack && this.slideInHeader.backClick != null) {
      this.slideInHeader.backClick();
    }
  }

  private share(): void {
    if (this.slideInHeader.showShare && this.slideInHeader.shareClick != null) {
      this.slideInHeader.shareClick();
    }
  }

  private configure(): void {
    if (this.slideInHeader.configurable && this.slideInHeader.configure != null && typeof this.slideInHeader.configure === 'function') {
      this.slideInHeader.configure();
    }
  }

  close(): void {
    if (this.slideInHeader.confirmClose != null && typeof this.slideInHeader.confirmClose === 'function') {
      this.slideInHeader.confirmClose();
    } else {
      if (this.slideInHeader.closeOnClick) {
        this.eventsService.dispatchEvent(this.slideInHeader.event);
        setTimeout(() => {
          if (this.slideInHeader.close != null && typeof this.slideInHeader.close === 'function') {
            this.slideInHeader.close();
          }
        }, 250);
      } else {
        if (this.slideInHeader.close != null && typeof this.slideInHeader.close === 'function') {
          this.slideInHeader.close();
        }
      }
    }
  }

  actionClick(action: PageMenuAction): void {
    this.eventsService.dispatchEvent(action.event);
  }
}
