import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {ChosenClass} from '../../../shared/models/creatures/characters/chosen-class';
import {CharacterClass} from '../../../shared/models/characteristics/character-class';
import {CreatureConfigurationCollection} from '../../../shared/models/creatures/configs/creature-configuration-collection';
import {CreatureService} from '../../../core/services/creatures/creature.service';
import {CharacterClassService} from '../../../core/services/characteristics/character-class.service';
import {ListObject} from '../../../shared/models/list-object';
import {CharacterLevelService} from '../../../core/services/character-level.service';
import {CharacterLevel} from '../../../shared/models/character-level';
import {EventsService} from '../../../core/services/events.service';
import {TranslateService} from '@ngx-translate/core';
import {EVENTS} from '../../../constants';
import {ClassLevelAdjustment, ClassOption} from '../../details/level/level-details/level-details.component';
import {Subscription} from 'rxjs';
import {PlayerCharacter} from '../../../shared/models/creatures/characters/player-character';

@Component({
  selector: 'app-character-edit-chosen-class',
  templateUrl: './character-edit-chosen-class.component.html',
  styleUrls: ['./character-edit-chosen-class.component.scss']
})
export class CharacterEditChosenClassComponent implements OnInit, OnDestroy {
  @Input() playerCharacter: PlayerCharacter;
  @Input() chosenClass: ChosenClass = new ChosenClass();
  @Input() collection: CreatureConfigurationCollection = new CreatureConfigurationCollection();
  @Output() delete = new EventEmitter();

  classes: ClassOption[] = [];
  subclasses: ListObject[] = [];
  levels: ListObject[] = [];
  eventSub: Subscription;
  changingClass = false;

  constructor(
    private eventsService: EventsService,
    private characterClassService: CharacterClassService,
    private characterLevelService: CharacterLevelService,
    private creatureService: CreatureService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.initializeClasses();
    this.initializeLevels();

    this.eventSub = this.eventsService.events.subscribe(event => {
      if (event === EVENTS.ClassChange) {
        this.updateDisabledClassOptions();
      }
    });
  }

  ngOnDestroy() {
    this.eventSub.unsubscribe();
  }

  private initializeClasses(): void {
    this.characterClassService.getClasses().then((classes: ListObject[]) => {
      const options: ClassOption[] = [];
      classes.forEach((currentClass: ListObject) => {
        const option = new ClassOption();
        option.option = currentClass;
        option.disabled = this.isOptionDisabled(option);
        options.push(option);
      });
      this.classes = options;
      this.initializeSelectedClass();
    });
  }

  private initializeSelectedClass(): void {
    if (this.chosenClass.characterClass != null) {
      for (let i = 0; i < this.classes.length; i++) {
        const classOption: ClassOption = this.classes[i];
        if (classOption.option.id === this.chosenClass.characterClass.id) {
          this.classChange(classOption.option.id, false);
          return;
        }
      }
    }

    if (this.classes.length > 0) {
      for (let i = 0; i < this.classes.length; i++) {
        const option = this.classes[i];
        if (!option.disabled) {
          this.classChange(option.option.id, false);
          break;
        }
      }
    }
  }

  private initializeSubclasses(): void {
    this.subclasses = [];
    this.subclasses.push(new ListObject('0', this.translate.instant('None')));
    if (this.chosenClass.characterClass != null) {
      this.chosenClass.characterClass.subclasses.forEach((subclass: CharacterClass) => {
        this.subclasses.push(new ListObject(subclass.id, subclass.name));
      });

      this.initializeSelectedSubclass();
    }
  }

  private initializeSelectedSubclass(): void {
    if (this.chosenClass.subclass != null) {
      for (let i = 0; i < this.subclasses.length; i++) {
        const subclass = this.subclasses[i];
        if (subclass.id === this.chosenClass.subclass.id) {
          this.subclassChange(subclass.id);
          return;
        }
      }
    }

    if (this.subclasses.length > 0) {
      this.subclassChange(this.subclasses[0].id);
    }
  }

  classChange(classId: string, resetId = true): void {
    this.changingClass = true;
    if (this.chosenClass.characterClass != null) {
      this.creatureService.removeCharacteristicFromCollection(this.collection, this.chosenClass.characterClass, this.chosenClass.primary);
      if (resetId) {
        this.chosenClass.id = '0';
      }
    }
    this.characterClassService.getClass(classId).then((characterClass: CharacterClass) => {
      this.chosenClass.characterClass = characterClass;
      this.creatureService.addCharacteristicToCollection(this.collection, characterClass, this.chosenClass.primary);
      this.eventsService.dispatchEvent(EVENTS.ClassChange);
      this.initializeSubclasses();
      this.changingClass = false;
    }, () => {
      this.changingClass = false;
    });
  }

  private updateDisabledClassOptions(): void {
    this.classes.forEach((classOption: ClassOption) => {
      classOption.disabled = this.isOptionDisabled(classOption);
    });
  }

  private isOptionDisabled(classOption: ClassOption): boolean {
    for (let i = 0; i < this.playerCharacter.classes.length; i++) {
      const chosenClass = this.playerCharacter.classes[i];
      if (chosenClass.characterClass != null) {
        if (classOption.option.id === chosenClass.characterClass.id &&
          (this.chosenClass.characterClass == null
            || classOption.option.id !== this.chosenClass.characterClass.id)) {
          return true;
        }
      }
    }
    return false;
  }

  subclassChange(subclassId: string): void {
    this.changingClass = true;
    if (this.chosenClass.subclass != null) {
      this.creatureService.removeCharacteristicFromCollection(this.collection, this.chosenClass.subclass, this.chosenClass.primary);
    }
    this.chosenClass.subclass = new CharacterClass();
    if (subclassId !== '0') {
      this.characterClassService.getClass(subclassId).then((subclass: CharacterClass) => {
        this.chosenClass.subclass = subclass;
        this.creatureService.addCharacteristicToCollection(this.collection, subclass, this.chosenClass.primary);
        this.changingClass = false;
      }, () => {
        this.changingClass = false;
      });
    } else {
      this.changingClass = false;
    }
  }

  deleteClass(): void {
    this.delete.emit(this.chosenClass);
  }

  private initializeLevels(): void {
    this.characterLevelService.getLevels().then((levels: ListObject[]) => {
      this.levels = levels;
      this.initializeSelectedLevel();
    });
  }

  private initializeSelectedLevel(): void {
    if (this.chosenClass.characterLevel != null) {
      for (let i = 0; i < this.levels.length; i++) {
        const level = this.levels[i];
        if (level.id === this.chosenClass.characterLevel.id) {
          this.levelChange(level.id);
          return;
        }
      }
    }

    if (this.levels.length > 0) {
      this.levelChange(this.levels[0].id);
    }
  }

  levelChange(levelId: string): void {
    this.characterLevelService.getCharacterLevel(levelId).then((level: CharacterLevel) => {
      this.chosenClass.characterLevel = level;
      this.eventsService.dispatchEvent(EVENTS.LevelChange);
    });
  }

}
