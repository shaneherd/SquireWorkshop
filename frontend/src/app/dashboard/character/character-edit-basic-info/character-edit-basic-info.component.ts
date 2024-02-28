import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ListObject} from '../../../shared/models/list-object';
import {ChosenClass} from '../../../shared/models/creatures/characters/chosen-class';
import {Race} from '../../../shared/models/characteristics/race';
import {TranslateService} from '@ngx-translate/core';
import {RaceService} from '../../../core/services/characteristics/race.service';
import {CreatureService} from '../../../core/services/creatures/creature.service';
import {PlayerCharacter} from '../../../shared/models/creatures/characters/player-character';
import {CreatureConfigurationCollection} from '../../../shared/models/creatures/configs/creature-configuration-collection';
import {CharacterLevelService} from '../../../core/services/character-level.service';
import {CharacterService} from '../../../core/services/creatures/character.service';
import {EventsService} from '../../../core/services/events.service';
import {Subscription} from 'rxjs';
import {EVENTS} from '../../../constants';
import {CharacterLevel} from '../../../shared/models/character-level';

@Component({
  selector: 'app-character-edit-basic-info',
  templateUrl: './character-edit-basic-info.component.html',
  styleUrls: ['./character-edit-basic-info.component.scss']
})
export class CharacterEditBasicInfoComponent implements OnInit, OnDestroy {
  @Input() playerCharacter: PlayerCharacter;
  @Input() collection: CreatureConfigurationCollection = new CreatureConfigurationCollection();

  races: ListObject[] = [];
  subRaces: ListObject[] = [];

  parentRace: Race;
  subRace: Race;

  levels: ListObject[];
  eventSub: Subscription;
  changingRace = false;

  constructor(
    private eventsService: EventsService,
    private characterService: CharacterService,
    private characterLevelService: CharacterLevelService,
    private translate: TranslateService,
    private raceService: RaceService,
    private creatureService: CreatureService
  ) { }

  ngOnInit() {
    this.initializeRaces();
    this.initializeLevels();

    this.eventSub = this.eventsService.events.subscribe(event => {
      if (event === EVENTS.LevelChange) {
        this.updateTotalExp();
      }
    });
  }

  ngOnDestroy() {
    this.eventSub.unsubscribe();
  }

  private initializeLevels(): void {
    this.characterLevelService.getLevels().then((levels: ListObject[]) => {
      this.levels = levels;
    });
  }

  private updateTotalExp(): void {
    let level = 0;
    this.playerCharacter.classes.forEach((chosenClass: ChosenClass) => {
      level += parseInt(chosenClass.characterLevel.name, 10);
    });
    const totalLevel: CharacterLevel = this.characterLevelService.getLevelByName(level.toString(10));
    if (this.playerCharacter.exp < totalLevel.minExp) {
      this.playerCharacter.exp = totalLevel.minExp;
      this.collection.totalLevel = totalLevel;
    }
  }

  expChange(input): void {
    this.playerCharacter.exp = parseInt(input.value, 10);
    this.collection.totalLevel = this.characterLevelService.getLevelByExpInstant(this.playerCharacter.exp);
  }

  private initializeRaces(): void {
    this.raceService.getRaces().then((races: ListObject[]) => {
      this.races = races;
      this.initializeSelectedRace();
    });
  }

  private initializeSelectedRace(): void {
    if (this.playerCharacter.characterRace.race != null) {
      let raceId = this.playerCharacter.characterRace.race.id;
      let childId = '0';
      if (this.playerCharacter.characterRace.race.parent != null) {
        raceId = this.playerCharacter.characterRace.race.parent.id;
        childId = this.playerCharacter.characterRace.race.id;
      }

      for (let i = 0; i < this.races.length; i++) {
        const race = this.races[i];
        if (race.id === raceId) {
          this.raceChange(raceId, childId);
          return;
        }
      }
    }

    if (this.races.length > 0) {
      this.raceChange(this.races[0].id);
    }
  }

  raceChange(raceId: string, childId: string = '0'): void {
    this.changingRace = true;
    this.creatureService.removeCharacteristicFromCollection(this.collection, this.parentRace);
    this.creatureService.removeCharacteristicFromCollection(this.collection, this.subRace);
    this.subRaces = [];

    this.raceService.getRace(raceId).then((race: Race) => {
      this.parentRace = race;
      this.playerCharacter.characterRace.race = race;
      if (race.subRaces.length > 0) {
        this.subRaces.push(new ListObject('0', this.translate.instant('none')));
        race.subRaces.forEach((subRace: Race) => {
          this.subRaces.push(new ListObject(subRace.id, subRace.name));
        });
        this.subRaceChange(childId);
      } else {
        this.creatureService.addCharacteristicToCollection(this.collection, race);
        this.changingRace = false;
      }
    }, () => {
      this.changingRace = false;
    });
  }

  subRaceChange(subRaceId: string): void {
    this.changingRace = true;
    this.creatureService.removeCharacteristicFromCollection(this.collection, this.subRace);

    if (subRaceId !== '0') {
      this.creatureService.removeCharacteristicFromCollection(this.collection, this.parentRace);
      this.raceService.getRace(subRaceId).then((race: Race) => {
        this.subRace = race;
        this.playerCharacter.characterRace.race = race;
        this.creatureService.addCharacteristicToCollection(this.collection, race);
        this.changingRace = false;
      }, () => {
        this.changingRace = false;
      });
    } else {
      this.subRace = new Race();
      if (this.parentRace != null) {
        this.creatureService.addCharacteristicToCollection(this.collection, this.parentRace);
        this.playerCharacter.characterRace.race = this.parentRace;
      }
      this.changingRace = false;
    }
  }

  addClass(): void {
    const newClass = new ChosenClass();
    newClass.id = this.getNewClassId();
    newClass.primary = false;
    this.characterService.initializeHealthGainResults(newClass, this.levels);
    this.playerCharacter.classes.push(newClass);
  }

  private getNewClassId(): string {
    return (this.playerCharacter.classes.length * -1).toString(10);
  }

  removeClass(chosenClass: ChosenClass): void {
    if (chosenClass.primary) {
      return;
    }
    for (let i = 0; i < this.playerCharacter.classes.length; i++) {
      const current = this.playerCharacter.classes[i];
      if (current.id === chosenClass.id && !current.primary) {
        this.creatureService.removeCharacteristicFromCollection(this.collection, current.characterClass, current.primary);
        this.playerCharacter.classes.splice(i, 1);
        break;
      }
    }

    this.updateClassIds();
  }

  private updateClassIds(): void {
    let counter = -1;
    this.playerCharacter.classes.forEach((chosenClass: ChosenClass) => {
      if (chosenClass.id.indexOf('-') === 0) {
        chosenClass.id = counter.toString(10);
      }
      counter--;
    });
  }

}
