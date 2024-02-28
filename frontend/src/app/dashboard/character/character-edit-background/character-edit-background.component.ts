import {Component, Input, OnInit} from '@angular/core';
import {ListObject} from '../../../shared/models/list-object';
import {Background} from '../../../shared/models/characteristics/background';
import {CreatureConfigurationCollection} from '../../../shared/models/creatures/configs/creature-configuration-collection';
import {BackgroundService} from '../../../core/services/characteristics/background.service';
import {TranslateService} from '@ngx-translate/core';
import {CreatureService} from '../../../core/services/creatures/creature.service';
import {CharacterBackground} from '../../../shared/models/creatures/characters/character-background';
import {CharacterService} from '../../../core/services/creatures/character.service';
import {CharacterBackgroundTraitCollection} from '../../../shared/models/creatures/characters/configs/character-background-trait-collection';
import {Characteristic} from '../../../shared/models/characteristics/characteristic';

@Component({
  selector: 'app-character-edit-background',
  templateUrl: './character-edit-background.component.html',
  styleUrls: ['./character-edit-background.component.scss']
})
export class CharacterEditBackgroundComponent implements OnInit {
  @Input() characterBackground: CharacterBackground;
  @Input() collection: CreatureConfigurationCollection = new CreatureConfigurationCollection();

  backgrounds: ListObject[] = [];
  subBackgrounds: ListObject[] = [];

  background: Background;
  parentBackground: Background;
  subBackground: Background;

  backgroundCollection: CharacterBackgroundTraitCollection = new CharacterBackgroundTraitCollection();
  changingBackground = false;

  constructor(
    private translate: TranslateService,
    private backgroundService: BackgroundService,
    private creatureService: CreatureService,
    private characterService: CharacterService
  ) { }

  ngOnInit() {
    this.initializeBackgrounds();
  }

  private initializeBackgrounds(): void {
    this.backgroundService.getBackgrounds(false).then((backgrounds: ListObject[]) => {
      const other = this.translate.instant('Other');
      const list: ListObject[] = [];
      list.push(new ListObject('0', other));
      backgrounds.forEach((background: ListObject) => {
        list.push(background);
      });
      this.backgrounds = list;
      this.initializeSelectedBackground();
    });
  }

  private initializeSelectedBackground(): void {
    if (this.characterBackground != null &&
      this.characterBackground.background != null) {

      let parent: Characteristic = this.characterBackground.background.parent;
      let child: Characteristic = null;
      if (parent == null) {
        parent = this.characterBackground.background;
      } else {
        child = this.characterBackground.background;
      }

      for (let i = 0; i < this.backgrounds.length; i++) {
        const background = this.backgrounds[i];
        if (background.id === parent.id) {
          const childId = child == null ? '0' : child.id;
          this.backgroundChange(background.id, childId);
          return;
        }
      }
    }

    if (this.backgrounds.length > 0) {
      this.backgroundChange(this.backgrounds[0].id);
    }
  }

  backgroundChange(backgroundId: string, childId: string = '0'): void {
    this.changingBackground = true;
    this.creatureService.removeCharacteristicFromCollection(this.collection, this.parentBackground);
    this.creatureService.removeCharacteristicFromCollection(this.collection, this.subBackground);
    this.subBackgrounds = [];

    if (backgroundId !== '0') {
      this.backgroundService.getBackground(backgroundId).then((background: Background) => {
        this.background = background;
        this.parentBackground = background;
        this.characterBackground.background = background;
        this.collection.backgroundConfigurationCollection = this.backgroundCollection;

        if (background.subBackgrounds.length > 0) {
          this.subBackgrounds.push(new ListObject('0', this.translate.instant('none')));
          background.subBackgrounds.forEach((subBackground: Background) => {
            this.subBackgrounds.push(new ListObject(subBackground.id, subBackground.name));
          });
          this.subBackgroundChange(childId);
        } else {
          this.backgroundCollection =
            this.characterService.initializeBackgroundConfigurationCollection(this.characterBackground, this.background);
          this.collection.backgroundConfigurationCollection = this.backgroundCollection;
          this.creatureService.addCharacteristicToCollection(this.collection, background);
          this.changingBackground = false;
        }

        //todo - fetch parent to add the parent profs and traits
      }, () => {
        this.changingBackground = false;
      });
    } else {
      this.background = new Background();
      this.characterBackground.background = this.background;
      this.changingBackground = false;
    }
  }

  subBackgroundChange(subBackgroundId: string): void {
    this.changingBackground = true;
    this.creatureService.removeCharacteristicFromCollection(this.collection, this.subBackground);
    if (subBackgroundId !== '0') {
      this.creatureService.removeCharacteristicFromCollection(this.collection, this.parentBackground);
      this.backgroundService.getBackground(subBackgroundId).then((subBackground: Background) => {
        this.background = subBackground;
        this.subBackground = subBackground;
        this.characterBackground.background = subBackground;
        this.creatureService.addCharacteristicToCollection(this.collection, subBackground);
        this.backgroundCollection =
          this.characterService.initializeBackgroundConfigurationCollection(this.characterBackground, this.background);
        this.collection.backgroundConfigurationCollection = this.backgroundCollection;
        //todo - fetch parent to add the parent profs and traits
        this.changingBackground = false;
      }, () => {
        this.changingBackground = false;
      });
    } else {
      const subBackground = new Background();
      this.subBackground = subBackground;
      if (this.parentBackground != null) {
        this.background = this.parentBackground;
        this.creatureService.addCharacteristicToCollection(this.collection, this.parentBackground);
      } else {
        this.background = subBackground;
      }
      this.backgroundCollection =
        this.characterService.initializeBackgroundConfigurationCollection(this.characterBackground, this.background);
      this.collection.backgroundConfigurationCollection = this.backgroundCollection;
      this.characterBackground.background = this.background;
      this.changingBackground = false;
    }
  }
}
