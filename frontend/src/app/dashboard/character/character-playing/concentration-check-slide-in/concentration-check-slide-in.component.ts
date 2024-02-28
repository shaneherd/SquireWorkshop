import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {CreatureConfigurationCollection} from '../../../../shared/models/creatures/configs/creature-configuration-collection';
import {CreatureListProficiency} from '../../../../shared/models/creatures/creature-list-proficiency';
import {CharacterService} from '../../../../core/services/creatures/character.service';
import {ModifierService} from '../../../../core/services/modifier.service';
import {EVENTS, SID} from '../../../../constants';
import {CreatureService} from '../../../../core/services/creatures/creature.service';
import {AbilityService} from '../../../../core/services/attributes/ability.service';
import {CreatureSpell} from '../../../../shared/models/creatures/creature-spell';
import {Roll} from '../../../../shared/models/rolls/roll';
import {RollRequest} from '../../../../shared/models/rolls/roll-request';
import {RollType} from '../../../../shared/models/rolls/roll-type.enum';
import {DiceSize} from '../../../../shared/models/dice-size.enum';
import {DiceService} from '../../../../core/services/dice.service';
import {TranslateService} from '@ngx-translate/core';
import {NotificationService} from '../../../../core/services/notification.service';
import {Proficiency} from '../../../../shared/models/proficiency';
import {Subscription} from 'rxjs';
import {EventsService} from '../../../../core/services/events.service';
import {LabelValue} from '../../../../shared/models/label-value';
import {Creature} from '../../../../shared/models/creatures/creature';
import {CreatureType} from '../../../../shared/models/creatures/creature-type.enum';
import {PlayerCharacter} from '../../../../shared/models/creatures/characters/player-character';

@Component({
  selector: 'app-concentration-check-slide-in',
  templateUrl: './concentration-check-slide-in.component.html',
  styleUrls: ['./concentration-check-slide-in.component.scss']
})
export class ConcentrationCheckSlideInComponent implements OnInit, OnDestroy {
  @Input() creature: Creature;
  @Input() collection: CreatureConfigurationCollection;
  @Output() roll = new EventEmitter();
  @Output() close = new EventEmitter();

  eventSub: Subscription;
  configuring = false;
  concentrationProficiency: CreatureListProficiency = null;
  proficiency: Proficiency = new Proficiency();
  modifierDisplays: LabelValue[] = [];
  conSave = '0';
  concentrationMisc = '0';
  total = 0;
  concentratingSpell: CreatureSpell = null;

  constructor(
    private creatureService: CreatureService,
    private characterService: CharacterService,
    private abilityService: AbilityService,
    private modifierService: ModifierService,
    private diceService: DiceService,
    private translate: TranslateService,
    private notificationService: NotificationService,
    private eventsService: EventsService
  ) { }

  ngOnInit() {
    this.initializeValues();

    this.eventSub = this.eventsService.events.subscribe(event => {
      if (event === EVENTS.AbilityScoreChange
        || event === EVENTS.AbilitySaveChange
        || event === EVENTS.ConcentrationUpdated
        || event === EVENTS.ModifiersUpdated
        || event === EVENTS.ConditionUpdated
        || event === EVENTS.ProficiencyUpdated
        || event === EVENTS.CarryingUpdated
        || event === EVENTS.ItemsUpdated
        || event === EVENTS.ExhaustionLevelChanged) {
        this.initializeValues();
      }
    });
  }

  ngOnDestroy() {
    this.eventSub.unsubscribe();
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

  closeDetails(): void {
    this.close.emit();
  }

  rollConcentration(): void {
    //todo - prompt for dc
    this.rollConcentrationCheck(10).then(() => {
      this.roll.emit();
    });
  }

  private rollConcentrationCheck(dc: number): Promise<any> {
    if (this.concentratingSpell != null) {
      return this.creatureService.rollStandard(this.creature, this.getConcentrationRollRequest()).then((roll: Roll) => {
        const naturalRoll = this.diceService.getNaturalRoll(roll);
        const displayData = {
          value: roll.totalResult,
          spellName: this.concentratingSpell.spell.name
        };

        let display;
        let failedConcentration = false;
        if (naturalRoll === 20) {
          display = this.translate.instant('ConcentrationChecks.SuccessCritical', displayData);
          this.notificationService.success(display);
        } else if (naturalRoll === 1) {
          display = this.translate.instant('ConcentrationChecks.FailCritical', displayData);
          this.notificationService.error(display);
          failedConcentration = true;
        } else {
          if (roll.totalResult >= dc) {
            display = this.translate.instant('ConcentrationChecks.Success', displayData);
            this.notificationService.success(display);
          } else {
            display = this.translate.instant('ConcentrationChecks.Fail', displayData);
            this.notificationService.error(display);
            failedConcentration = true;
          }
        }

        if (failedConcentration) {
          this.creatureService.loseConcentration(this.creature, this.concentratingSpell).then(() => {
            this.concentratingSpell = null;
          });
        } else {
          return Promise.resolve();
        }
      });
    } else {
      return Promise.resolve();
    }
  }

  private getConcentrationRollRequest(): RollRequest {
    return this.diceService.getRollRequest(
      RollType.STANDARD,
      this.translate.instant('ConcentrationCheck', {spellName: this.concentratingSpell.spell.name}),
      DiceSize.TWENTY,
      this.total,
      false,
      this.proficiency.advantage,
      this.proficiency.disadvantage
    );
  }

  private initializeValues(): void {
    this.concentratingSpell = this.creatureService.getConcentratingSpell(this.creature);

    const con = this.creatureService.getAbilityBySid(SID.ABILITIES.CONSTITUTION, this.collection);
    const conSaveModifier = this.creatureService.getAbilitySaveModifier(con, this.creature, this.collection);
    this.conSave = this.abilityService.convertScoreToString(conSaveModifier);

    this.concentrationProficiency = this.creatureService.getConcentrationProficiency(this.collection);
    this.initializeProficiency();

    const concentrationMisc = this.creatureService.getModifierValueFromProficiency(this.concentrationProficiency.proficiency);
    this.concentrationMisc = this.abilityService.convertScoreToString(concentrationMisc);
    const concentrationModifier = this.creatureService.getMiscModifier(SID.MISC_ATTRIBUTES.CONCENTRATION, this.collection);
    const modifiers = this.creatureService.getModifiers(concentrationModifier.modifiers, this.collection);
    this.modifierDisplays = this.creatureService.getModifierLabels(concentrationModifier.modifiers, this.collection);

    this.total = conSaveModifier + concentrationMisc + modifiers;
  }

  private initializeProficiency(): void {
    this.proficiency = new Proficiency();
    this.proficiency.proficient = this.concentrationProficiency.proficient || this.concentrationProficiency.inheritedFrom.length > 0;
    this.proficiency.doubleProf = this.concentrationProficiency.proficiency.doubleProf;
    this.proficiency.halfProf = this.concentrationProficiency.proficiency.halfProf;
    this.proficiency.roundUp = this.concentrationProficiency.proficiency.roundUp;
    this.proficiency.advantage = this.concentrationProficiency.proficiency.advantage;
    this.proficiency.disadvantage = this.concentrationProficiency.proficiency.disadvantage;

    if (this.creature.creatureType === CreatureType.CHARACTER) {
      const playerCharacter = this.creature as PlayerCharacter;
      if (this.characterService.hasModifiedSaveDisadvantage(playerCharacter, this.collection, SID.ABILITIES.CONSTITUTION)) {
        this.proficiency.disadvantage = true;
        this.proficiency.disadvantageDisabled = true;
        this.proficiency.disadvantageTooltip = this.characterService.getModifiedSaveDisadvantageTooltip(playerCharacter, this.collection, SID.ABILITIES.CONSTITUTION);
      }
    } else {
      if (this.creatureService.hasModifiedSaveDisadvantage(this.creature, SID.ABILITIES.CONSTITUTION, this.collection)) {
        this.proficiency.disadvantage = true;
        this.proficiency.disadvantageDisabled = true;
        this.proficiency.disadvantageTooltip = this.creatureService.getModifiedSaveDisadvantageTooltip(this.creature, SID.ABILITIES.CONSTITUTION, this.collection);
      }
    }
  }
}
