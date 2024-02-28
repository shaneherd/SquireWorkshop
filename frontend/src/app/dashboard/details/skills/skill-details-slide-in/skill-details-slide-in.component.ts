import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {CreatureSkillListProficiency} from '../../../../shared/models/creatures/creature-skill-list-proficiency';
import {Roll} from '../../../../shared/models/rolls/roll';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {RollResultDialogData} from '../../../../core/components/roll-results/roll-result-dialog/roll-result-dialog-data';
import {RollResultDialogComponent} from '../../../../core/components/roll-results/roll-result-dialog/roll-result-dialog.component';
import {CreatureService} from '../../../../core/services/creatures/creature.service';
import {RollRequest} from '../../../../shared/models/rolls/roll-request';
import {DiceService} from '../../../../core/services/dice.service';
import {Proficiency} from '../../../../shared/models/proficiency';
import {AbilityService} from '../../../../core/services/attributes/ability.service';
import {CharacterService} from '../../../../core/services/creatures/character.service';
import {CreatureConfigurationCollection} from '../../../../shared/models/creatures/configs/creature-configuration-collection';
import {EVENTS} from '../../../../constants';
import {EventsService} from '../../../../core/services/events.service';
import {Subscription} from 'rxjs';
import {Creature} from '../../../../shared/models/creatures/creature';
import {CreatureType} from '../../../../shared/models/creatures/creature-type.enum';
import {PlayerCharacter} from '../../../../shared/models/creatures/characters/player-character';

@Component({
  selector: 'app-skill-details-slide-in',
  templateUrl: './skill-details-slide-in.component.html',
  styleUrls: ['./skill-details-slide-in.component.scss']
})
export class SkillDetailsSlideInComponent implements OnInit, OnDestroy {
  @Input() skill: CreatureSkillListProficiency;
  @Input() creature: Creature;
  @Input() collection: CreatureConfigurationCollection;
  @Input() displayPassive = false;
  @Output() close = new EventEmitter();
  proficiency: Proficiency = new Proficiency();

  skillModifier = 0;
  total = '+ 0';
  tooltip = '';
  configuring = false;
  passive = 0
  passiveTooltip = '';
  eventSub: Subscription;

  constructor(
    private dialog: MatDialog,
    private characterService: CharacterService,
    private creatureService: CreatureService,
    private abilityService: AbilityService,
    private diceService: DiceService,
    private eventsService: EventsService
  ) { }

  ngOnInit() {
    this.initializeValues();

    this.eventSub = this.eventsService.events.subscribe(event => {
      if (event === EVENTS.AbilityScoreChange ||
        event === (EVENTS.SkillScoreChange + this.skill.skill.id) ||
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
    this.proficiency.advantage = this.skill.proficiency.advantage;
    this.proficiency.disadvantage = this.skill.proficiency.disadvantage;

    if (this.creature.creatureType === CreatureType.CHARACTER) {
      const playerCharacter = this.creature as PlayerCharacter;
      if (this.characterService.hasModifiedAbilityCheckDisadvantage(playerCharacter, this.collection, this.skill.abilityProficiency.ability.sid, this.skill.skill.sid)) {
        this.proficiency.disadvantage = true;
        this.proficiency.disadvantageDisabled = true;
        this.proficiency.disadvantageTooltip = this.characterService.getModifiedAbilityCheckDisadvantageTooltip(playerCharacter, this.collection, this.skill.abilityProficiency.ability.sid, this.skill.skill.sid);
      }
    } else {
      if (this.creatureService.hasModifiedAbilityCheckDisadvantage(this.creature, this.skill.abilityProficiency.ability.sid, this.skill.skill.sid, this.collection)) {
        this.proficiency.disadvantage = true;
        this.proficiency.disadvantageDisabled = true;
        this.proficiency.disadvantageTooltip = this.creatureService.getModifiedAbilityCheckDisadvantageTooltip(this.creature, this.skill.abilityProficiency.ability.sid, this.skill.skill.sid, this.collection);
      }
    }

    this.skillModifier = this.creatureService.getSkillAbilityModifier(this.skill, this.creature, this.collection);
    this.total = this.abilityService.convertScoreToString(this.skillModifier);
    this.tooltip = this.creatureService.getSkillTooltip(this.skill, this.creature, this.collection);
    this.initializePassive();
  }

  private initializePassive(): void {
    this.passive = this.creatureService.getSkillPassiveAbilityModifier(this.skill, this.creature, this.collection, this.proficiency.advantage, this.proficiency.disadvantage);
    this.passiveTooltip = this.creatureService.getSkillPassiveTooltip(this.skill, this.creature, this.collection, this.proficiency.advantage, this.proficiency.disadvantage);
  }

  configure(): void {
    this.configuring = true;
  }

  closeConfiguration(): void {
    this.configuring = false;
  }

  saveConfiguration(): void {
    this.configuring = false;
    this.initializeValues();
    this.eventsService.dispatchEvent(EVENTS.SkillScoreChange + this.skill.skill.id);
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

  private getRollRequest(): RollRequest {
    return this.diceService.getStandardRollRequest(
      this.skill.item.name,
      this.skillModifier,
      this.proficiency.advantage,
      this.proficiency.disadvantage
    );
  }

  closeDetails(): void {
    if (this.close != null) {
      this.close.emit();
    }
  }

  advantageChange(): void {
    this.initializePassive();
  }
}
