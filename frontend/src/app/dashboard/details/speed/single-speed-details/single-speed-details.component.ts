import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {CreatureConfigurationCollection} from '../../../../shared/models/creatures/configs/creature-configuration-collection';
import {CreatureSpeedModifierCollectionItem} from '../../../../shared/models/creatures/configs/creature-speed-modifier-collection-item';
import {CharacterService} from '../../../../core/services/creatures/character.service';
import {EVENTS} from '../../../../constants';
import {EventsService} from '../../../../core/services/events.service';
import {SpeedType} from '../../../../shared/models/speed-type.enum';
import {
  CharacterSpeedSetting,
  CharacterSpeedSettings
} from '../../../../shared/models/creatures/characters/character-settings';
import {Subscription} from 'rxjs';
import {Creature} from '../../../../shared/models/creatures/creature';
import {CreatureType} from '../../../../shared/models/creatures/creature-type.enum';
import {PlayerCharacter} from '../../../../shared/models/creatures/characters/player-character';
import {BattleMonster} from '../../../../shared/models/creatures/battle-monsters/battle-monster';
import {MonsterService} from '../../../../core/services/creatures/monster.service';

@Component({
  selector: 'app-single-speed-details',
  templateUrl: './single-speed-details.component.html',
  styleUrls: ['./single-speed-details.component.scss']
})
export class SingleSpeedDetailsComponent implements OnInit, OnDestroy {
  @Input() creature: Creature;
  @Input() collection: CreatureConfigurationCollection;
  @Input() settings: CharacterSpeedSettings;
  @Input() speed: CreatureSpeedModifierCollectionItem;
  @Input() configuring = false;

  eventSub: Subscription;
  characterSpeedSetting: CharacterSpeedSetting = null;
  base = 0;
  baseTooltip = '';
  total = 0;

  constructor(
    private characterService: CharacterService,
    private monsterService: MonsterService,
    private eventsService: EventsService
  ) { }

  ngOnInit() {
    this.initializeSpeed();

    if (this.speed.useHalfApplicable) {
      this.eventSub = this.eventsService.events.subscribe(event => {
        if (event === EVENTS.BaseSpeedChange) {
          this.initializeSpeed();
        }
      });
    }
  }

  ngOnDestroy() {
    if (this.eventSub != null) {
      this.eventSub.unsubscribe();
    }
  }

  private initializeSpeed(): void {
    this.updateBase();
    this.updateTotal();
    this.initializeCharacterSpeedSetting();
  }

  private initializeCharacterSpeedSetting(): void {
    if (this.settings != null) {
      switch (this.speed.speedType) {
        case SpeedType.CLIMB:
          this.characterSpeedSetting = this.settings.climbing;
          break;
        case SpeedType.CRAWL:
          this.characterSpeedSetting = this.settings.crawling;
          break;
        case SpeedType.SWIM:
          this.characterSpeedSetting = this.settings.swimming;
          break;
      }
    }
  }

  private updateBase(): void {
    if (this.creature.creatureType === CreatureType.CHARACTER) {
      const playerCharacter = this.creature as PlayerCharacter;
      this.base = this.characterService.getBaseSpeed(this.speed);
      this.baseTooltip = this.characterService.getBaseSpeedTooltip(this.speed, playerCharacter, this.collection, this.settings);
    } else if (this.creature.creatureType === CreatureType.MONSTER) {
      const battleMonster = this.creature as BattleMonster;
      this.base = this.monsterService.getBaseSpeed(this.speed);
      this.baseTooltip = this.monsterService.getBaseSpeedTooltip(this.speed, battleMonster, this.collection, this.settings);
    }
  }

  private updateTotal(): void {
    this.total = this.characterService.getSpeed(this.speed);
  }

  miscChange(input): void {
    this.speed.misc = parseInt(input.value, 10);
    this.updateTotal();

    if (this.speed.speedType === SpeedType.WALK) {
      this.eventsService.dispatchEvent(EVENTS.WalkSpeedChange);
    }
  }

  useHalfChange(): void {
    this.speed.useHalf = this.characterSpeedSetting.useHalf;
    this.updateBase();
    this.updateTotal();
  }

  roundUpChange(): void {
    this.speed.roundUp = this.characterSpeedSetting.roundUp;
    this.updateBase();
    this.updateTotal();
  }

}
