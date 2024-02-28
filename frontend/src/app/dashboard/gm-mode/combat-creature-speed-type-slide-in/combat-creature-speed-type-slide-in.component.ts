import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Encounter} from '../../../shared/models/campaigns/encounters/encounter';
import {NotificationService} from '../../../core/services/notification.service';
import {TranslateService} from '@ngx-translate/core';
import {EncounterService} from '../../../core/services/encounter.service';
import {CombatCreature} from '../../../shared/models/combat-row';
import {SpeedType} from '../../../shared/models/speed-type.enum';
import {EncounterCreatureType} from '../../../shared/models/campaigns/encounters/encounter-creature-type.enum';
import {MonsterService} from '../../../core/services/creatures/monster.service';
import {CharacterService} from '../../../core/services/creatures/character.service';
import {BattleMonster} from '../../../shared/models/creatures/battle-monsters/battle-monster';
import {PlayerCharacter} from '../../../shared/models/creatures/characters/player-character';
import {CreatureType} from '../../../shared/models/creatures/creature-type.enum';
import {EventsService} from '../../../core/services/events.service';
import {EVENTS} from '../../../constants';

export class SpeedDisplay {
  speedType: SpeedType = SpeedType.WALK;
  speed = 0;
}

@Component({
  selector: 'app-combat-creature-speed-type-slide-in',
  templateUrl: './combat-creature-speed-type-slide-in.component.html',
  styleUrls: ['./combat-creature-speed-type-slide-in.component.scss']
})
export class CombatCreatureSpeedTypeSlideInComponent implements OnInit {
  @Input() combatCreature: CombatCreature;
  @Input() encounter: Encounter;
  @Output() cancel = new EventEmitter();
  @Output() save = new EventEmitter();

  loading = false;
  speeds: SpeedDisplay[] = [];
  speedTypes: SpeedType[] = [];
  speedToDisplay: SpeedType = SpeedType.WALK;
  headerName = '';

  constructor(
    private notificationService: NotificationService,
    private translate: TranslateService,
    private monsterService: MonsterService,
    private characterService: CharacterService,
    private encounterService: EncounterService,
    private eventsService: EventsService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.speedToDisplay = this.combatCreature.speedType;
    this.initializeSpeedTypes();
    this.initializeSpeeds();
    this.headerName = this.combatCreature.battleCreature.creature.name;
    if (this.combatCreature.battleCreature.groupedInitiative) {
      this.headerName = this.combatCreature.combatRow.displayName;
    }
    this.loading = false;
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
    switch (this.combatCreature.battleCreature.encounterCreatureType) {
      case EncounterCreatureType.CHARACTER:
        this.initializeCharacter();
        break;
      case EncounterCreatureType.MONSTER:
        this.initializeMonsterSpeeds();
        break;
    }
  }

  private initializeMonsterSpeeds(): void {
    const battleMonster = this.combatCreature.battleCreature.creature as BattleMonster;
    this.speedTypes.forEach((speedType: SpeedType) => {
      const speedDisplay = new SpeedDisplay();
      speedDisplay.speedType = speedType;
      const speedConfig = this.monsterService.getSpeedConfiguration(battleMonster, this.combatCreature.collection, speedType, battleMonster.settings.speed);
      speedDisplay.speed = this.monsterService.getSpeed(speedConfig);
      this.speeds.push(speedDisplay);
    });
  }

  private initializeCharacter(): void {
    const playerCharacter = this.combatCreature.battleCreature.creature as PlayerCharacter;
    this.speedTypes.forEach((speedType: SpeedType) => {
      const speedDisplay = new SpeedDisplay();
      speedDisplay.speedType = speedType;
      const speedConfig = this.characterService.getSpeedConfiguration(playerCharacter, this.combatCreature.collection, speedType, playerCharacter.characterSettings.speed);
      speedDisplay.speed = this.characterService.getSpeed(speedConfig);
      this.speeds.push(speedDisplay);
    });
  }

  cancelClick(): void {
    this.cancel.emit();
  }

  saveClick(): void {
    this.loading = true;
    const combatRow = this.combatCreature.combatRow;
    if (combatRow == null || combatRow.combatCreatures.length === 0) {
      this.loading = false;
      return;
    }
    const firstCombatCreature = combatRow.combatCreatures[0];
    const groupId = firstCombatCreature.battleCreature.groupId;
    if (groupId == null || groupId === '0') {
      this.encounterService.updateBattleCreatureSpeedType(this.encounter.id, this.combatCreature.id, this.speedToDisplay).then(() => {
        this.finishSpeedUpdate();
      }, () => {
        this.loading = false;
        this.notificationService.error(this.translate.instant('Encounter.Save.Error'));
      });
    } else {
      this.encounterService.updateGroupSpeedType(this.encounter.id, groupId, this.speedToDisplay).then(() => {
        this.finishGroupSpeedUpdate();
      }, () => {
        this.loading = false;
        this.notificationService.error(this.translate.instant('Encounter.Save.Error'));
      });
    }
  }

  private finishGroupSpeedUpdate(): void {
    const speed = this.getSpeedValue();
    this.combatCreature.combatRow.speedType = this.speedToDisplay;
    this.combatCreature.combatRow.speed = speed;

    this.combatCreature.combatRow.combatCreatures.forEach((combatCreature: CombatCreature) => {
      combatCreature.speedType = this.speedToDisplay;
      combatCreature.battleCreature.speedToDisplay = this.speedToDisplay;
      combatCreature.speed = speed;

      if (combatCreature.battleCreature.creature.creatureType === CreatureType.CHARACTER) {
        const playerCharacter = combatCreature.battleCreature.creature as PlayerCharacter;
        playerCharacter.characterSettings.speed.speedToDisplay = this.speedToDisplay;
      } else if (combatCreature.battleCreature.creature.creatureType === CreatureType.MONSTER) {
        const battleMonster = combatCreature.battleCreature.creature as BattleMonster;
        battleMonster.settings.speed.speedToDisplay = this.speedToDisplay;
      }
    });

    this.eventsService.dispatchEvent(EVENTS.SpeedUpdated);
    this.loading = false;
    this.save.emit();
  }

  private finishSpeedUpdate(): void {
    this.loading = false;
    this.combatCreature.speedType = this.speedToDisplay;
    this.combatCreature.battleCreature.speedToDisplay = this.speedToDisplay;
    this.combatCreature.combatRow.speedType = this.speedToDisplay;
    const speed = this.getSpeedValue();
    this.combatCreature.speed = speed;
    this.combatCreature.combatRow.speed = speed;

    if (this.combatCreature.battleCreature.creature.creatureType === CreatureType.CHARACTER) {
      const playerCharacter = this.combatCreature.battleCreature.creature as PlayerCharacter;
      playerCharacter.characterSettings.speed.speedToDisplay = this.speedToDisplay;
      this.eventsService.dispatchEvent(EVENTS.SpeedUpdated);
    } else if (this.combatCreature.battleCreature.creature.creatureType === CreatureType.MONSTER) {
      const battleMonster = this.combatCreature.battleCreature.creature as BattleMonster;
      battleMonster.settings.speed.speedToDisplay = this.speedToDisplay;
      this.eventsService.dispatchEvent(EVENTS.SpeedUpdated);
    }
    this.save.emit();
  }

  private getSpeedValue(): number {
    switch (this.combatCreature.battleCreature.encounterCreatureType) {
      case EncounterCreatureType.CHARACTER:
        const playerCharacter = this.combatCreature.battleCreature.creature as PlayerCharacter;
        const characterSpeedConfig = this.characterService.getSpeedConfiguration(playerCharacter, this.combatCreature.collection, this.speedToDisplay, playerCharacter.characterSettings.speed);
        return this.characterService.getSpeed(characterSpeedConfig);
      case EncounterCreatureType.MONSTER:
        const battleMonster = this.combatCreature.battleCreature.creature as BattleMonster;
        const monsterSpeedConfig = this.monsterService.getSpeedConfiguration(battleMonster, this.combatCreature.collection, this.speedToDisplay, battleMonster.settings.speed);
        return this.monsterService.getSpeed(monsterSpeedConfig);
    }
    return 0;
  }
}
