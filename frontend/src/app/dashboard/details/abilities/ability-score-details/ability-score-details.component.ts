import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {CreatureAbilityProficiency} from '../../../../shared/models/creatures/configs/creature-ability-proficiency';
import {CreatureConfigurationCollection} from '../../../../shared/models/creatures/configs/creature-configuration-collection';
import {CharacterService} from '../../../../core/services/creatures/character.service';
import {CreatureService} from '../../../../core/services/creatures/creature.service';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {AbilityService} from '../../../../core/services/attributes/ability.service';
import {Roll} from '../../../../shared/models/rolls/roll';
import {RollResultDialogData} from '../../../../core/components/roll-results/roll-result-dialog/roll-result-dialog-data';
import {RollResultDialogComponent} from '../../../../core/components/roll-results/roll-result-dialog/roll-result-dialog.component';
import {RollRequest} from '../../../../shared/models/rolls/roll-request';
import {DiceService} from '../../../../core/services/dice.service';
import {EVENTS} from '../../../../constants';
import {EventsService} from '../../../../core/services/events.service';
import {Proficiency} from '../../../../shared/models/proficiency';
import {Subscription} from 'rxjs';
import {Creature} from '../../../../shared/models/creatures/creature';
import {CreatureType} from '../../../../shared/models/creatures/creature-type.enum';
import {PlayerCharacter} from '../../../../shared/models/creatures/characters/player-character';

@Component({
  selector: 'app-ability-score-details',
  templateUrl: './ability-score-details.component.html',
  styleUrls: ['./ability-score-details.component.scss']
})
export class AbilityScoreDetailsComponent implements OnInit, OnDestroy {
  @Input() creatureAbilityProficiency: CreatureAbilityProficiency;
  @Input() creature: Creature;
  @Input() collection: CreatureConfigurationCollection;
  @Output() close = new EventEmitter();

  abilityScore = 0;
  modifier = 0;
  checkModifier = '+0';
  abilityModifier = '+ 0';
  scoreTooltip = '';
  modifierTooltip = '';
  checkModifierTooltip = '';
  configuring = false;
  check: Proficiency = new Proficiency();
  eventSub: Subscription;

  constructor(
    private dialog: MatDialog,
    private characterService: CharacterService,
    private creatureService: CreatureService,
    private abilityService: AbilityService,
    private diceService: DiceService,
    private eventsService: EventsService
  ) {
  }

  ngOnInit() {
    this.initializeValues();

    this.eventSub = this.eventsService.events.subscribe(event => {
      if (event === (EVENTS.AbilityScoreChange + this.creatureAbilityProficiency.ability.id) ||
        event === EVENTS.ModifiersUpdated ||
        event === EVENTS.ConditionUpdated ||
        event === EVENTS.CarryingUpdated ||
        event === EVENTS.ProficiencyUpdated ||
        event === EVENTS.ItemsUpdated ||
        event === EVENTS.ExhaustionLevelChanged) {
        this.initializeValues();
      }
    });
  }

  ngOnDestroy() {
    this.eventSub.unsubscribe();
  }

  private initializeValues(): void {
    this.abilityScore = this.creatureService.getAbilityScore(this.creatureAbilityProficiency, this.collection);
    this.modifier = this.abilityService.getAbilityModifier(this.abilityScore);
    const checkModifier = this.modifier - this.creature.creatureHealth.resurrectionPenalty;
    this.check = new Proficiency();
    this.check.miscModifier = checkModifier;

    if (this.creature.creatureType === CreatureType.CHARACTER) {
      const playerCharacter = this.creature as PlayerCharacter;
      if (this.characterService.hasModifiedAbilityCheckDisadvantage(playerCharacter, this.collection, this.creatureAbilityProficiency.ability.sid)) {
        this.check.disadvantage = true;
        this.check.disadvantageDisabled = true;
        this.check.disadvantageTooltip = this.characterService.getModifiedAbilityCheckDisadvantageTooltip(playerCharacter, this.collection, this.creatureAbilityProficiency.ability.sid);
      }
    } else if (this.creatureService.hasModifiedAbilityCheckDisadvantage(this.creature, this.creatureAbilityProficiency.ability.sid, null, this.collection)) {
      this.check.disadvantage = true;
      this.check.disadvantageDisabled = true;
      this.check.disadvantageTooltip = this.creatureService.getModifiedAbilityCheckDisadvantageTooltip(this.creature, this.creatureAbilityProficiency.ability.sid, null, this.collection);
    }

    this.abilityModifier = this.abilityService.convertScoreToString(this.modifier);
    this.checkModifier = this.abilityService.convertScoreToString(checkModifier);
    this.scoreTooltip = this.creatureService.getAbilityScoreTooltip(this.creatureAbilityProficiency, this.collection);
    this.modifierTooltip = this.creatureService.getModifierTooltip(this.abilityScore, this.creature);
    this.checkModifierTooltip = this.creatureService.getModifierTooltip(this.abilityScore, this.creature, true);
  }

  configure(): void {
    this.configuring = true;
  }

  closeConfiguration(): void {
    this.configuring = false;
  }

  saveConfiguration(): void {
    this.configuring = false;
    this.eventsService.dispatchEvent(EVENTS.AbilityScoreChange);
    this.eventsService.dispatchEvent(EVENTS.AbilityScoreChange + this.creatureAbilityProficiency.ability.id);
  }

  roll(): void {
    this.creatureService.rollStandard(this.creature, this.getRollRequest()).then((roll: Roll) => {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.data = new RollResultDialogData(this.creature, roll);
      this.dialog.open(RollResultDialogComponent, dialogConfig);
      this.closeDetails();
    });
  }

  closeDetails(): void {
    if (this.close != null) {
      this.close.emit();
    }
  }

  private getRollRequest(): RollRequest {
    return this.diceService.getStandardRollRequest(
      this.creatureAbilityProficiency.ability.name,
      this.check.miscModifier,
      this.check.advantage,
      this.check.disadvantage
    );
  }
}
