import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {CreatureAbilityProficiency} from '../../../../shared/models/creatures/configs/creature-ability-proficiency';
import {CreatureConfigurationCollection} from '../../../../shared/models/creatures/configs/creature-configuration-collection';
import {CharacterService} from '../../../../core/services/creatures/character.service';
import {CreatureService} from '../../../../core/services/creatures/creature.service';
import {Proficiency} from '../../../../shared/models/proficiency';
import {AbilityService} from '../../../../core/services/attributes/ability.service';
import {RollRequest} from '../../../../shared/models/rolls/roll-request';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {Roll} from '../../../../shared/models/rolls/roll';
import {RollResultDialogComponent} from '../../../../core/components/roll-results/roll-result-dialog/roll-result-dialog.component';
import {RollResultDialogData} from '../../../../core/components/roll-results/roll-result-dialog/roll-result-dialog-data';
import {DiceService} from '../../../../core/services/dice.service';
import {EVENTS} from '../../../../constants';
import {EventsService} from '../../../../core/services/events.service';
import {TranslateService} from '@ngx-translate/core';
import {Subscription} from 'rxjs';
import {Creature} from '../../../../shared/models/creatures/creature';
import {CreatureType} from '../../../../shared/models/creatures/creature-type.enum';
import {PlayerCharacter} from '../../../../shared/models/creatures/characters/player-character';

@Component({
  selector: 'app-ability-save-details',
  templateUrl: './ability-save-details.component.html',
  styleUrls: ['./ability-save-details.component.scss']
})
export class AbilitySaveDetailsComponent implements OnInit, OnDestroy {
  @Input() creatureAbilityProficiency: CreatureAbilityProficiency;
  @Input() creature: Creature;
  @Input() collection: CreatureConfigurationCollection;
  @Output() close = new EventEmitter();
  proficiency: Proficiency = new Proficiency();
  total = '+ 0';
  totalValue = 0;
  tooltip = '';
  configuring = false;
  autoFail = false;
  autoFailTooltip = '';
  eventSub: Subscription;

  constructor(
    private dialog: MatDialog,
    private characterService: CharacterService,
    private creatureService: CreatureService,
    private abilityService: AbilityService,
    private diceService: DiceService,
    private eventsService: EventsService,
    private translate: TranslateService
  ) {
  }

  ngOnInit() {
    this.initializeValues();

    this.eventSub = this.eventsService.events.subscribe(event => {
      if (event === (EVENTS.AbilityScoreChange + this.creatureAbilityProficiency.ability.id) ||
        event === (EVENTS.AbilitySaveChange + this.creatureAbilityProficiency.ability.id) ||
        event === EVENTS.ModifiersUpdated ||
        event === EVENTS.ConditionUpdated ||
        event === EVENTS.ProficiencyUpdated ||
        event === EVENTS.CarryingUpdated ||
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
    this.proficiency.advantage = this.creatureAbilityProficiency.saveProficiency.proficiency.advantage;
    this.proficiency.disadvantage = this.creatureAbilityProficiency.saveProficiency.proficiency.disadvantage;

    if (this.creature.creatureType === CreatureType.CHARACTER) {
      const playerCharacter = this.creature as PlayerCharacter;
      if (this.characterService.hasModifiedSaveDisadvantage(playerCharacter, this.collection, this.creatureAbilityProficiency.ability.sid)) {
        this.proficiency.disadvantage = true;
        this.proficiency.disadvantageDisabled = true;
        this.proficiency.disadvantageTooltip = this.characterService.getModifiedSaveDisadvantageTooltip(playerCharacter, this.collection, this.creatureAbilityProficiency.ability.sid);
      }

      this.autoFail = this.characterService.hasModifiedSaveAutoFail(playerCharacter, this.creatureAbilityProficiency.ability.sid);
      if (this.autoFail) {
        this.autoFailTooltip = this.characterService.getModifiedSaveAutoFailTooltip(playerCharacter, this.creatureAbilityProficiency.ability.sid);
      }
    } else {
      if (this.creatureService.hasModifiedSaveDisadvantage(this.creature, this.creatureAbilityProficiency.ability.sid, this.collection)) {
        this.proficiency.disadvantage = true;
        this.proficiency.disadvantageDisabled = true;
        this.proficiency.disadvantageTooltip = this.creatureService.getModifiedSaveDisadvantageTooltip(this.creature, this.creatureAbilityProficiency.ability.sid, this.collection);
      }

      this.autoFail = this.creatureService.hasModifiedSaveAutoFail(this.creature, this.creatureAbilityProficiency.ability.sid);
      if (this.autoFail) {
        this.autoFailTooltip = this.creatureService.getModifiedSaveAutoFailTooltip(this.creature, this.creatureAbilityProficiency.ability.sid);
      }
    }

    this.totalValue = this.creatureService.getAbilitySaveModifier(this.creatureAbilityProficiency, this.creature, this.collection);
    this.total = this.abilityService.convertScoreToString(this.totalValue);
    this.tooltip = this.creatureService.getAbilitySaveTooltip(this.creatureAbilityProficiency, this.creature, this.collection);
  }

  configure(): void {
    this.configuring = true;
  }

  closeConfiguration(): void {
    this.configuring = false;
  }

  saveConfiguration(): void {
    this.configuring = false;
    this.eventsService.dispatchEvent(EVENTS.AbilitySaveChange);
    this.eventsService.dispatchEvent(EVENTS.AbilitySaveChange + this.creatureAbilityProficiency.ability.id);
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
      this.translate.instant('AbilitySave', {ability: this.creatureAbilityProficiency.ability.name}),
      this.totalValue,
      this.proficiency.advantage,
      this.proficiency.disadvantage
    );
  }
}
