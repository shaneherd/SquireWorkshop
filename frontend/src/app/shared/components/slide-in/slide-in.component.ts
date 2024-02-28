import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {EventsService} from '../../../core/services/events.service';
import {SlideInHeader} from '../../models/slideInHeader.model';
import {ResolutionService} from '../../../core/services/resolution.service';
import {ListObject} from '../../models/list-object';
import {MatDrawer, MatSidenav} from '@angular/material/sidenav';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-slide-in',
  templateUrl: './slide-in.component.html',
  styleUrls: ['./slide-in.component.scss'],
})
export class SlideInComponent implements OnInit, OnDestroy {
  @ViewChild(MatSidenav, {static: false})
  drawer: MatDrawer;

  isDesktop = true;
  @Input() slideInHeader: SlideInHeader;
  @Input() listObject: ListObject;
  @Input() loading: boolean;
  @Input() large = true;
  @Input() extraLarge = false;
  @Input() layered = false;
  @Input() slideLeft = true;
  @Input() fixed = false;

  resSub: Subscription;
  eventSub: Subscription;

  constructor(private resolutionService: ResolutionService,
              private eventsService: EventsService) { }

  ngOnInit() {
    this.resSub = this.resolutionService.width.subscribe(width => {
      this.isDesktop = ResolutionService.isDesktop(width);
    });
    setTimeout(() => {
      this.drawer.toggle(true);
    }, 100);

    this.eventSub = this.eventsService.events.subscribe(event => {
      if (event === this.slideInHeader.event) {
        this.drawer.toggle(false);
      }
    });
  }

  ngOnDestroy() {
    this.eventSub.unsubscribe();
    this.resSub.unsubscribe();
  }
}
