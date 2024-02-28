import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {SubBackgroundService} from '../../../../core/services/characteristics/sub-background.service';
import {Background} from '../../../../shared/models/characteristics/background';

@Component({
  selector: 'app-sub-background-list',
  templateUrl: './sub-background-list.component.html',
  styleUrls: ['./sub-background-list.component.scss']
})
export class SubBackgroundListComponent implements OnInit, OnDestroy {
  parentSub: Subscription;
  parent: Background = null;

  constructor(
    public subBackgroundService: SubBackgroundService
  ) { }

  ngOnInit() {
    this.parentSub = this.subBackgroundService.parent.subscribe((parent: Background) => {
      this.parent = parent;
    });
  }

  ngOnDestroy() {
    this.parentSub.unsubscribe();
  }
}
