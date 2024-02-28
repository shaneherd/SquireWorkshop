import {Component, OnDestroy, OnInit} from '@angular/core';
import {CharacterClass} from '../../../../shared/models/characteristics/character-class';
import {Subscription} from 'rxjs';
import {SubclassService} from '../../../../core/services/characteristics/subclass.service';

@Component({
  selector: 'app-subclass-list',
  templateUrl: './subclass-list.component.html',
  styleUrls: ['./subclass-list.component.scss']
})
export class SubclassListComponent implements OnInit, OnDestroy {
  parentSub: Subscription;
  parent: CharacterClass = null;

  constructor(
    public subclassService: SubclassService
  ) { }

  ngOnInit() {
    this.parentSub = this.subclassService.parent.subscribe((parent: CharacterClass) => {
      this.parent = parent;
    });
  }

  ngOnDestroy() {
    this.parentSub.unsubscribe();
  }

}
