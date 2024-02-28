import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ChosenClass} from '../../../shared/models/creatures/characters/chosen-class';
import {ListObject} from '../../../shared/models/list-object';
import {HealthCalculationType} from '../../../shared/models/creatures/characters/health-calculation-type.enum';
import {PlayerCharacter} from '../../../shared/models/creatures/characters/player-character';
import {CharacterService} from '../../../core/services/creatures/character.service';
import {CharacterLevelService} from '../../../core/services/character-level.service';
import {EVENTS, SID} from '../../../constants';
import {CreatureListProficiency} from '../../../shared/models/creatures/creature-list-proficiency';
import {EventsService} from '../../../core/services/events.service';
import {Subscription} from 'rxjs';
import {CreatureService} from '../../../core/services/creatures/creature.service';
import {CreatureConfigurationCollection} from '../../../shared/models/creatures/configs/creature-configuration-collection';

@Component({
  selector: 'app-character-edit-health',
  templateUrl: './character-edit-health.component.html',
  styleUrls: ['./character-edit-health.component.scss']
})
export class CharacterEditHealthComponent implements OnInit, OnDestroy {
  @Input() playerCharacter: PlayerCharacter;
  @Input() collection: CreatureConfigurationCollection;
  @Input() classes: ChosenClass[] = [];
  @Input() abilitiesToIncreaseByOne: CreatureListProficiency[] = [];

  levels: ListObject[] = [];
  calculationTypes: HealthCalculationType[] = [];
  calculationType: HealthCalculationType = HealthCalculationType.ROLL;
  eventSub: Subscription;
  conModifier = 0;

  constructor(
    private eventsService: EventsService,
    private characterService: CharacterService,
    private creatureService: CreatureService,
    private characterLevelService: CharacterLevelService
  ) { }

  ngOnInit() {
    this.initializeLevels();
    this.initializeCalculationTypes();
    this.updateConModifier();

    this.eventSub = this.eventsService.events.subscribe(event => {
      if (event === EVENTS.ClassChange || event === EVENTS.LevelChange) {
        this.updateHealthGainResults();
      } else if (event === EVENTS.AbilityScoreChange) {
        this.updateConModifier();
      }
    });
  }

  ngOnDestroy() {
    this.eventSub.unsubscribe();
  }

  private initializeLevels(): void {
    this.levels = [];
    this.characterLevelService.getLevels().then((levels: ListObject[]) => {
      this.levels = levels;
    });
  }

  private initializeCalculationTypes(): void {
    this.calculationTypes = [];
    this.calculationTypes.push(HealthCalculationType.ROLL);
    this.calculationTypes.push(HealthCalculationType.MAX);
    this.calculationTypes.push(HealthCalculationType.AVERAGE);
    this.initializeSelectedCalculationType();
  }

  private initializeSelectedCalculationType(): void {
    this.calculationType = this.playerCharacter.healthCalculationType;
  }

  calculationTypeChange(calculationType: HealthCalculationType): void {
    this.playerCharacter.healthCalculationType = calculationType;
    this.calculationType = calculationType;
    this.updateHealthGainResults();
  }

  private updateHealthGainResults(): void {
    this.playerCharacter.classes.forEach((chosenClass: ChosenClass) => {
      this.characterService.updateHealthGainResults(chosenClass, this.calculationType);
    });
  }

  private updateConModifier(): void {
    const con = this.creatureService.getAbilityBySid(SID.ABILITIES.CONSTITUTION, this.collection);
    this.conModifier = this.creatureService.getAbilityModifier(con, this.collection);
  }

  getMaxHp(): number {
    return this.characterService.getMaxHp(this.playerCharacter, this.collection);
  }

  hpGainModifierChange(input): void {
    this.playerCharacter.hpGainModifier = parseInt(input.value, 10);
  }

  maxHpModifierChange(input): void {
    this.playerCharacter.creatureHealth.maxHpMod = parseInt(input.value, 10);
  }

}
