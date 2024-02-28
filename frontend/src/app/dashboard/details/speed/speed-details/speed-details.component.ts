import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {CreatureConfigurationCollection} from '../../../../shared/models/creatures/configs/creature-configuration-collection';
import {SpeedType} from '../../../../shared/models/speed-type.enum';
import {CreatureSpeedModifierCollectionItem} from '../../../../shared/models/creatures/configs/creature-speed-modifier-collection-item';
import {CharacterService} from '../../../../core/services/creatures/character.service';
import * as _ from 'lodash';
import {EVENTS} from '../../../../constants';
import {EventsService} from '../../../../core/services/events.service';
import {Subscription} from 'rxjs';
import {Creature} from '../../../../shared/models/creatures/creature';
import {CreatureType} from '../../../../shared/models/creatures/creature-type.enum';
import {PlayerCharacter} from '../../../../shared/models/creatures/characters/player-character';
import {BattleMonster} from '../../../../shared/models/creatures/battle-monsters/battle-monster';
import {MonsterService} from '../../../../core/services/creatures/monster.service';

@Component({
  selector: 'app-speed-details',
  templateUrl: './speed-details.component.html',
  styleUrls: ['./speed-details.component.scss']
})
export class SpeedDetailsComponent implements OnInit, OnDestroy {
  @Input() creature: Creature;
  @Input() collection: CreatureConfigurationCollection;
  @Output() save = new EventEmitter();
  @Output() close = new EventEmitter();

  eventSub: Subscription;
  configuring = false;
  speeds: CreatureSpeedModifierCollectionItem[] = [];
  speedTypes: SpeedType[] = [];
  speedToDisplay: SpeedType = SpeedType.WALK;

  constructor(
    private characterService: CharacterService,
    private monsterService: MonsterService,
    private eventsService: EventsService
  ) { }

  ngOnInit() {
    if (this.creature.creatureType === CreatureType.CHARACTER) {
      const playerCharacter = this.creature as PlayerCharacter;
      this.speedToDisplay = playerCharacter.characterSettings.speed.speedToDisplay;
    } else if (this.creature.creatureType === CreatureType.MONSTER) {
      const battleMonster = this.creature as BattleMonster;
      this.speedToDisplay = battleMonster.settings.speed.speedToDisplay;
    }
    this.initializeValues();

    this.eventSub = this.eventsService.events.subscribe(event => {
      if (event === EVENTS.ModifiersUpdated
        || event === EVENTS.AbilityScoreChange
        || event === EVENTS.SpeedUpdated
        || event === EVENTS.CarryingUpdated
        || event === EVENTS.ItemsUpdated
        || event === EVENTS.SettingsUpdated
        || event === EVENTS.EquipmentSettingsUpdated
        || event === EVENTS.ConditionUpdated
        || event === EVENTS.ItemsUpdated
        || event === EVENTS.ExhaustionLevelChanged) {
        this.initializeValues();
      }
    });
  }

  ngOnDestroy() {
    this.eventSub.unsubscribe();
  }

  private initializeValues(): void {
    this.initializeSpeedTypes();
    this.initializeSpeeds();
  }

  configure(): void {
    this.configuring = true;
  }

  closeConfigurations(): void {
    this.configuring = false;
  }

  saveConfigurations(): void {
    this.configuring = false;
    this.initializeValues();
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

  private initializeSpeeds(): void {
    this.speeds = [];
    if (this.creature.creatureType === CreatureType.CHARACTER) {
      const playerCharacter = this.creature as PlayerCharacter;
      this.speedTypes.forEach((speedType: SpeedType) => {
        const speed = this.characterService.getSpeedConfiguration(playerCharacter, this.collection, speedType, playerCharacter.characterSettings.speed);
        this.speeds.push(speed);
      });
    } else if (this.creature.creatureType === CreatureType.MONSTER) {
      const battleMonster = this.creature as BattleMonster;
      this.speedTypes.forEach((speedType: SpeedType) => {
        const speed = this.monsterService.getSpeedConfiguration(battleMonster, this.collection, speedType, battleMonster.settings.speed);
        this.speeds.push(speed);
      });
    }
  }

  saveDetails(): void {
    if (this.creature.creatureType === CreatureType.CHARACTER) {
      const playerCharacter = this.creature as PlayerCharacter;
      const settings = _.cloneDeep(playerCharacter.characterSettings);
      settings.speed.speedToDisplay = this.speedToDisplay;
      this.characterService.updateCharacterSettings(playerCharacter, settings).then(() => {
        playerCharacter.characterSettings.speed = settings.speed;
        this.eventsService.dispatchEvent(EVENTS.SpeedUpdated);
        this.save.emit();
      });
    } else if (this.creature.creatureType === CreatureType.MONSTER) {
      const battleMonster = this.creature as BattleMonster;
      const settings = _.cloneDeep(battleMonster.settings);
      settings.speed.speedToDisplay = this.speedToDisplay;
      this.monsterService.updateBattleMonsterSettings(battleMonster.id, settings).then(() => {
        battleMonster.settings.speed = settings.speed;
        this.eventsService.dispatchEvent(EVENTS.SpeedUpdated);
        this.save.emit();
      });
    }
  }

  closeDetails(): void {
    this.close.emit();
  }
}
