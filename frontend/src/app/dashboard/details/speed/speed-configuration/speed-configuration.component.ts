import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {CreatureConfigurationCollection} from '../../../../shared/models/creatures/configs/creature-configuration-collection';
import {CreatureSpeedModifierCollectionItem} from '../../../../shared/models/creatures/configs/creature-speed-modifier-collection-item';
import {SpeedType} from '../../../../shared/models/speed-type.enum';
import {EventsService} from '../../../../core/services/events.service';
import {CharacterSpeedSettings} from '../../../../shared/models/creatures/characters/character-settings';
import * as _ from 'lodash';
import {EVENTS} from '../../../../constants';
import {Subscription} from 'rxjs';
import {Creature} from '../../../../shared/models/creatures/creature';
import {CreatureService} from '../../../../core/services/creatures/creature.service';
import {CreatureType} from '../../../../shared/models/creatures/creature-type.enum';
import {PlayerCharacter} from '../../../../shared/models/creatures/characters/player-character';
import {CharacterService} from '../../../../core/services/creatures/character.service';
import {BattleMonster} from '../../../../shared/models/creatures/battle-monsters/battle-monster';
import {MonsterService} from '../../../../core/services/creatures/monster.service';

@Component({
  selector: 'app-speed-configuration',
  templateUrl: './speed-configuration.component.html',
  styleUrls: ['./speed-configuration.component.scss']
})
export class SpeedConfigurationComponent implements OnInit, OnDestroy {
  @Input() creature: Creature;
  @Input() collection: CreatureConfigurationCollection;
  @Output() save = new EventEmitter();
  @Output() close = new EventEmitter();

  eventSub: Subscription;
  speeds: CreatureSpeedModifierCollectionItem[] = [];
  speedTypes: SpeedType[] = [];
  settings: CharacterSpeedSettings = new CharacterSpeedSettings();

  constructor(
    private creatureService: CreatureService,
    private characterService: CharacterService,
    private monsterService: MonsterService,
    private eventsService: EventsService
  ) { }

  ngOnInit() {
    if (this.creature.creatureType === CreatureType.CHARACTER) {
      const playerCharacter = this.creature as PlayerCharacter;
      this.settings = _.cloneDeep(playerCharacter.characterSettings.speed);
    } else if (this.creature.creatureType === CreatureType.MONSTER) {
      const battleMonster = this.creature as BattleMonster;
      this.settings = _.cloneDeep(battleMonster.settings.speed);
    }
    this.initializeSpeedTypes();
    this.initializeSpeeds(true);

    this.eventSub = this.eventsService.events.subscribe(event => {
      if (event === EVENTS.WalkSpeedChange) {
        this.updateBaseSpeeds();
      } else if (event === EVENTS.ModifiersUpdated
        || event === EVENTS.AbilityScoreChange
        || event === EVENTS.SpeedUpdated
        || event === EVENTS.CarryingUpdated
        || event === EVENTS.ItemsUpdated
        || event === EVENTS.SettingsUpdated
        || event === EVENTS.EquipmentSettingsUpdated
        || event === EVENTS.ConditionUpdated
        || event === EVENTS.ItemsUpdated
        || event === EVENTS.ExhaustionLevelChanged) {
        this.initializeSpeeds(false);
        this.updateBaseSpeeds();
      }
    });
  }

  ngOnDestroy() {
    if (this.eventSub != null) {
      this.eventSub.unsubscribe();
    }
  }

  private initializeSpeedTypes(): void {
    this.speedTypes = [];
    this.speedTypes.push(SpeedType.WALK);
    this.speedTypes.push(SpeedType.CRAWL);
    this.speedTypes.push(SpeedType.CLIMB);
    this.speedTypes.push(SpeedType.SWIM);
    this.speedTypes.push(SpeedType.FLY);
    this.speedTypes.push(SpeedType.BURROW);
  }

  private initializeSpeeds(updateMisc: boolean): void {
    const speeds = [];
    this.speedTypes.forEach((speedType: SpeedType) => {
      let speed: CreatureSpeedModifierCollectionItem = null;
      if (this.creature.creatureType === CreatureType.CHARACTER) {
        const playerCharacter = this.creature as PlayerCharacter;
        speed = this.characterService.getSpeedConfiguration(playerCharacter, this.collection, speedType, this.settings);
      } else if (this.creature.creatureType === CreatureType.MONSTER) {
        const battleMonster = this.creature as BattleMonster;
        speed = this.monsterService.getSpeedConfiguration(battleMonster, this.collection, speedType, this.settings);
      }
      if (speed != null) {
        if (!updateMisc) {
          const originalSpeed = this.getSpeed(speedType);
          if (originalSpeed != null) {
            speed.misc = originalSpeed.misc;
          }
        }
        speeds.push(speed);
      }
    });

    this.speeds = speeds;
  }

  private getSpeed(speedType: SpeedType): CreatureSpeedModifierCollectionItem {
    for (let i = 0; i < this.speeds.length; i++) {
      const speed = this.speeds[i];
      if (speed.speedType === speedType) {
        return speed;
      }
    }
    return null;
  }

  private updateBaseSpeeds(): void {
    const walking = this.getWalkingSpeed();
    let totalWalking = walking.base + walking.modifiers + walking.misc - walking.penalties;
    if (walking.immobilized) {
      totalWalking = 0;
    }
    this.speeds.forEach((speedConfiguration: CreatureSpeedModifierCollectionItem) => {
      if (speedConfiguration.speedType !== SpeedType.WALK && speedConfiguration.useHalfApplicable) {
        speedConfiguration.base = totalWalking;
      }
    });
    this.eventsService.dispatchEvent(EVENTS.BaseSpeedChange);
  }

  private getWalkingSpeed(): CreatureSpeedModifierCollectionItem {
    for (let i = 0; i < this.speeds.length; i++) {
      const speed = this.speeds[i];
      if (speed.speedType === SpeedType.WALK) {
        return speed;
      }
    }
    return null;
  }

  closeDetails(): void {
    this.close.emit();
  }

  saveDetails(): void {
    const promises = [];
    if (this.creature.creatureType === CreatureType.CHARACTER) {
      const playerCharacter = this.creature as PlayerCharacter;
      const settings = _.cloneDeep(playerCharacter.characterSettings);
      settings.speed = this.settings;
      promises.push(this.characterService.updateCharacterSettings(playerCharacter, settings));
      promises.push(this.creatureService.updateSpeeds(this.creature, this.speeds));

      const self = this;
      Promise.all(promises).then(function() {
        playerCharacter.characterSettings.speed = settings.speed;
        self.eventsService.dispatchEvent(EVENTS.SpeedUpdated);
        self.save.emit();
      });
    } else if (this.creature.creatureType === CreatureType.MONSTER) {
      const battleMonster = this.creature as BattleMonster;
      const settings = _.cloneDeep(battleMonster.settings);
      settings.speed = this.settings;
      promises.push(this.monsterService.updateBattleMonsterSettings(battleMonster.id, settings));
      promises.push(this.creatureService.updateSpeeds(this.creature, this.speeds));

      const self = this;
      Promise.all(promises).then(function() {
        battleMonster.settings.speed = settings.speed;
        self.eventsService.dispatchEvent(EVENTS.SpeedUpdated);
        self.save.emit();
      });
    }
  }
}
