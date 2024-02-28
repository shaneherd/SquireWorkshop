import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {EventsService} from '../../../../core/services/events.service';
import {TranslateService} from '@ngx-translate/core';
import {PlayerCharacter} from '../../../../shared/models/creatures/characters/player-character';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {CharacterPage} from '../../../../shared/models/creatures/characters/character-page';
import * as _ from 'lodash';
import {CharacterService} from '../../../../core/services/creatures/character.service';
import {EVENTS} from '../../../../constants';
import {MatCheckboxChange} from '@angular/material/checkbox';

@Component({
  selector: 'app-character-page-order',
  templateUrl: './character-page-order.component.html',
  styleUrls: ['./character-page-order.component.scss']
})
export class CharacterPageOrderComponent implements OnInit {
  loading = false;
  @Input() playerCharacter: PlayerCharacter;
  @Output() close = new EventEmitter();
  @Output() continue = new EventEmitter();

  pages: CharacterPage[] = [];

  constructor(
    private eventsService: EventsService,
    private translate: TranslateService,
    private characterService: CharacterService
  ) { }

  ngOnInit() {
    this.initializePages();
  }

  private initializePages(): void {
    this.pages = [];
    this.playerCharacter.characterSettings.pages.forEach((characterPage: CharacterPage) => {
      const page = this.createCopyOfPage(characterPage);
      this.pages.push(page);
    });
  }

  createCopyOfPage(page: CharacterPage): CharacterPage {
    return _.cloneDeep(page);
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.pages, event.previousIndex, event.currentIndex);
  }

  pageChange(event: MatCheckboxChange, page: CharacterPage): void {
    page.visible = event.checked;
  }

  continueClick(): void {
    for (let i = 0; i < this.pages.length; i++) {
      this.pages[i].order = i;
    }
    const self = this;
    this.characterService.updatePageOrder(this.playerCharacter, this.pages).then(() => {
      this.playerCharacter.characterSettings.pages = this.pages;
      this.eventsService.dispatchEvent(EVENTS.PageOrderUpdated);
      self.continue.emit();
    });
  }

  cancelClick(): void {
    this.close.emit();
  }
}
