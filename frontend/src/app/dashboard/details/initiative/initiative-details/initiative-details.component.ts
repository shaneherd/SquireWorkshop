import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {PlayerCharacter} from '../../../../shared/models/creatures/characters/player-character';
import {CreatureConfigurationCollection} from '../../../../shared/models/creatures/configs/creature-configuration-collection';
import {CharacterService} from '../../../../core/services/creatures/character.service';
import {ModifierService} from '../../../../core/services/modifier.service';
import {EventsService} from '../../../../core/services/events.service';
import {EVENTS, SID} from '../../../../constants';
import {Roll} from '../../../../shared/models/rolls/roll';
import {RollResultDialogData} from '../../../../core/components/roll-results/roll-result-dialog/roll-result-dialog-data';
import {RollResultDialogComponent} from '../../../../core/components/roll-results/roll-result-dialog/roll-result-dialog.component';
import {CreatureService} from '../../../../core/services/creatures/creature.service';
import {RollRequest} from '../../../../shared/models/rolls/roll-request';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {DiceService} from '../../../../core/services/dice.service';
import {TranslateService} from '@ngx-translate/core';
import {Proficiency} from '../../../../shared/models/proficiency';
import {CreatureListProficiency} from '../../../../shared/models/creatures/creature-list-proficiency';
import {Subscription} from 'rxjs';
import {LabelValue} from '../../../../shared/models/label-value';

@Component({
  selector: 'app-initiative-details',
  templateUrl: './initiative-details.component.html',
  styleUrls: ['./initiative-details.component.scss']
})
export class InitiativeDetailsComponent implements OnInit, OnDestroy {
  @Input() playerCharacter: PlayerCharacter;
  @Input() collection: CreatureConfigurationCollection;
  @Output() close = new EventEmitter();

  eventSub: Subscription;
  configuring = false;
  base = 0;
  modifiers = 0;
  modifiersDisplay: LabelValue[] = [];
  misc = 0;
  total = 0;

  initiative: CreatureListProficiency;
  proficiency: Proficiency = new Proficiency();
  profModifier = 0;

  constructor(
    private dialog: MatDialog,
    private characterService: CharacterService,
    private creatureService: CreatureService,
    private modifierService: ModifierService,
    private eventsService: EventsService,
    private diceService: DiceService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.initializeValues();

    this.eventSub = this.eventsService.events.subscribe(event => {
      if (event === EVENTS.ModifiersUpdated
        || event === EVENTS.AbilityScoreChange
        || event === EVENTS.InitiativeUpdated
        || event === EVENTS.ProficiencyUpdated) {
        this.initializeValues();
      }
    });
  }

  ngOnDestroy() {
    this.eventSub.unsubscribe();
  }

  private initializeValues(): void {
    this.initiative = this.creatureService.getMiscModifier(SID.MISC_ATTRIBUTES.INITIATIVE, this.collection);
    this.initializeProficiency();

    this.base = this.creatureService.getInitiativeModifier(this.collection, false, false, false);
    this.modifiers = this.creatureService.getModifiers(this.initiative.modifiers, this.collection);
    this.modifiersDisplay = this.creatureService.getModifierLabels(this.initiative.modifiers, this.collection);
    this.profModifier = this.getProfModifier();

    this.updateTotal();
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

  private initializeProficiency(): void {
    this.proficiency = new Proficiency();
    this.proficiency.proficient = this.initiative.proficient || this.initiative.inheritedFrom.length > 0;
    this.proficiency.doubleProf = this.initiative.proficiency.doubleProf;
    this.proficiency.halfProf = this.initiative.proficiency.halfProf;
    this.proficiency.roundUp = this.initiative.proficiency.roundUp;
    this.proficiency.advantage = this.initiative.proficiency.advantage;
    this.proficiency.disadvantage = this.initiative.proficiency.disadvantage;
    this.misc = this.creatureService.getModifierValueFromProficiency(this.initiative.proficiency);
  }

  private getProfModifier(): number {
    const profMod = this.creatureService.getProfModifier(this.collection);
    return this.creatureService.getProfModifierValue(profMod, this.proficiency.proficient, this.proficiency);
  }

  private updateTotal(): void {
    this.total = this.base + this.modifiers + this.profModifier + this.misc;
  }

  closeDetails(): void {
    this.close.emit();
  }

  roll(): void {
    this.creatureService.rollStandard(this.playerCharacter, this.getRollRequest()).then((roll: Roll) => {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.data = new RollResultDialogData(this.playerCharacter, roll);
      this.dialog.open(RollResultDialogComponent, dialogConfig);
      this.closeDetails();
    });
  }

  private getRollRequest(): RollRequest {
    return this.diceService.getStandardRollRequest(
      this.translate.instant('Headers.Initiative'),
      this.total,
      this.proficiency.advantage,
      this.proficiency.disadvantage
    );
  }

}
