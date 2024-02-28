import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {SubRaceService} from '../../../../core/services/characteristics/sub-race.service';
import {Race} from '../../../../shared/models/characteristics/race';

@Component({
  selector: 'app-sub-race-list',
  templateUrl: './sub-race-list.component.html',
  styleUrls: ['./sub-race-list.component.scss']
})
export class SubRaceListComponent implements OnInit, OnDestroy {
  parentSub: Subscription;
  parent: Race = null;

  constructor(
    public subRaceService: SubRaceService
  ) { }

  ngOnInit() {
    this.parentSub = this.subRaceService.parent.subscribe((parent: Race) => {
      this.parent = parent;
    });
  }

  ngOnDestroy() {
    this.parentSub.unsubscribe();
  }
}
