import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {PlayerCharacter} from '../../../../shared/models/creatures/characters/player-character';
import {CreatureConfigurationCollection} from '../../../../shared/models/creatures/configs/creature-configuration-collection';
import {CompanionListObject} from '../../../../shared/models/creatures/companions/companion-list-object';
import {CompanionType} from '../../../../shared/models/creatures/companions/companion-type.enum';
import {Companion} from '../../../../shared/models/creatures/companions/companion';
import {EventsService} from '../../../../core/services/events.service';
import {Subscription} from 'rxjs';
import {EVENTS} from '../../../../constants';
import * as _ from 'lodash';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-character-companions',
  templateUrl: './character-companions.component.html',
  styleUrls: ['./character-companions.component.scss']
})
export class CharacterCompanionsComponent implements OnInit, OnDestroy {
  @Input() playerCharacter: PlayerCharacter;
  @Input() collection: CreatureConfigurationCollection;
  @Input() columnIndex: number;

  beast = CompanionType.BEAST;
  wildShape = CompanionType.WILD_SHAPE;
  summon = CompanionType.SUMMON;
  beasts: CompanionListObject[] = [];
  wildShapes: CompanionListObject[] = [];
  summons: CompanionListObject[] = [];
  showHeaders = false;
  clickDisabled = false;

  viewingCompanion: CompanionListObject = null;
  newCompanion: Companion = null;
  eventSub: Subscription;
  queryParamsSub: Subscription;
  isPublic = false;
  isShared = false;

  constructor(
    private route: ActivatedRoute,
    private eventsService: EventsService
  ) { }

  ngOnInit(): void {
    this.initializeTypes();

    this.eventSub = this.eventsService.events.subscribe(event => {
      if (event === EVENTS.CompanionUpdated) {
        this.initializeTypes();
      } else if (event === (EVENTS.MenuAction.AddCompanion + this.columnIndex)) {
        this.addCompanion();
      }
    });

    this.queryParamsSub = this.route.queryParams
      .subscribe((params: {public: string, shared: string}) => {
        this.isPublic = params.public != null && params.public === 'true';
        this.isShared = params.shared != null && params.shared === 'true';
      });
  }

  ngOnDestroy() {
    this.eventSub.unsubscribe();
    this.queryParamsSub.unsubscribe();
  }

  private initializeTypes(): void {
    this.beasts = [];
    this.wildShapes = [];
    this.summons = [];

    this.playerCharacter.companions.forEach((companion: CompanionListObject) => {
      switch (companion.companionType) {
        case CompanionType.BEAST:
          this.beasts.push(companion);
          break;
        case CompanionType.WILD_SHAPE:
          this.wildShapes.push(companion);
          break;
        case CompanionType.SUMMON:
          this.summons.push(companion);
          break;
      }
    });
    const types: CompanionType[] = this.playerCharacter.companions.map(companion => companion.companionType);
    const unique = types.filter((item, i, ar) => ar.indexOf(item) === i);
    this.showHeaders = unique.length > 1;
  }

  addCompanion(): void {
    if (!this.isPublic && !this.isShared) {
      this.newCompanion = new Companion();
      this.updateDisabled();
    }
  }

  saveCompanion(companion: Companion): void {
    this.playerCharacter.companions.push(new CompanionListObject(companion.id, companion.name, companion.companionType, companion.creatureHealth, companion.maxHp));
    this.playerCharacter.companions = _.sortBy(this.playerCharacter.companions, item => item.name.toLowerCase())
    this.newCompanion = null;
    this.updateDisabled();
    this.initializeTypes();
  }

  editCompanion(companion: Companion): void {
    this.playerCharacter.companions = _.sortBy(this.playerCharacter.companions, item => item.name.toLowerCase())
    this.viewingCompanion = null;
    this.updateDisabled();
    this.initializeTypes();
  }

  cancelCompanion(): void {
    this.newCompanion = null;
    this.updateDisabled();
  }

  closeCompanion(): void {
    this.viewingCompanion = null;
    this.updateDisabled();
  }

  deleteCompanion(companion: Companion): void {
    const index = _.findIndex(this.playerCharacter.companions, (_companion: CompanionListObject) => {
      return _companion.id === companion.id;
    });
    if (index > -1) {
      this.playerCharacter.companions.splice(index, 1);
    }
    this.viewingCompanion = null;
    this.updateDisabled();
    this.initializeTypes();
  }

  companionClick(companion: CompanionListObject): void {
    this.viewingCompanion = companion;
  }

  private updateDisabled(): void {
    this.clickDisabled = this.newCompanion != null || this.viewingCompanion != null;
  }
}
