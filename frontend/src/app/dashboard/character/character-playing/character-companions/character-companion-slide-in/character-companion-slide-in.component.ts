import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CompanionListObject} from '../../../../../shared/models/creatures/companions/companion-list-object';
import {PlayerCharacter} from '../../../../../shared/models/creatures/characters/player-character';
import {Companion} from '../../../../../shared/models/creatures/companions/companion';
import {EventsService} from '../../../../../core/services/events.service';
import {EVENTS} from '../../../../../constants';
import {CreatureConfigurationCollection} from '../../../../../shared/models/creatures/configs/creature-configuration-collection';
import {CompanionService} from '../../../../../core/services/creatures/companion.service';
import {CreatureAbilityScoreDisplay} from '../../../../../shared/models/creatures/creature-ability-score';
import {CreatureAbilityProficiency} from '../../../../../shared/models/creatures/configs/creature-ability-proficiency';
import {CreatureService} from '../../../../../core/services/creatures/creature.service';
import {AbilityService} from '../../../../../core/services/attributes/ability.service';
import {TranslateService} from '@ngx-translate/core';
import {DiceService} from '../../../../../core/services/dice.service';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {HealthCalculatorState} from '../../../../../shared/components/health-calculator/health-calculator.component';
import * as _ from 'lodash';
import {CreatureConditions} from '../../../../../shared/models/creatures/creature-conditions';
import {ActiveCondition} from '../../../../../shared/models/creatures/active-condition';
import {ConfirmDialogData} from '../../../../../core/components/confirm-dialog/confirmDialogData';
import {ConfirmDialogComponent} from '../../../../../core/components/confirm-dialog/confirm-dialog.component';
import {Monster} from '../../../../../shared/models/creatures/monsters/monster';
import {MonsterService} from '../../../../../core/services/creatures/monster.service';
import {SpellConfiguration} from '../../../../../shared/models/characteristics/spell-configuration';
import {ProficiencyType} from '../../../../../shared/models/proficiency';
import {Roll} from '../../../../../shared/models/rolls/roll';
import {RollResultDialogData} from '../../../../../core/components/roll-results/roll-result-dialog/roll-result-dialog-data';
import {RollResultDialogComponent} from '../../../../../core/components/roll-results/roll-result-dialog/roll-result-dialog.component';
import {Speed, SpeedDisplay} from '../../../../../shared/models/speed';
import {SpeedType} from '../../../../../shared/models/speed-type.enum';
import {CompanionFeature} from '../../../../../shared/models/creatures/companion-feature';
import {CompanionAction} from '../../../../../shared/models/creatures/companion-action';
import {CreatureSpell} from '../../../../../shared/models/creatures/creature-spell';

@Component({
  selector: 'app-character-companion-slide-in',
  templateUrl: './character-companion-slide-in.component.html',
  styleUrls: ['./character-companion-slide-in.component.scss']
})
export class CharacterCompanionSlideInComponent implements OnInit {
  @Input() playerCharacter: PlayerCharacter;
  @Input() characterCollection: CreatureConfigurationCollection;
  @Input() companionListObject: CompanionListObject;
  @Output() save = new EventEmitter<Companion>();
  @Output() delete = new EventEmitter<Companion>();
  @Output() close = new EventEmitter();

  loading = false;
  companion: Companion = null;
  monster: Monster = null;
  actions: CompanionAction[];
  features: CompanionFeature[];
  spells: CreatureSpell[];
  configuring = false;
  collection: CreatureConfigurationCollection = new CreatureConfigurationCollection();
  abilityScores: CreatureAbilityScoreDisplay[] = [];
  calculatorState = new HealthCalculatorState();
  ac = 0;

  languageType = ProficiencyType.LANGUAGE;
  speeds: SpeedDisplay[] = [];

  headerName = '';
  step = 0;

  viewingAction: CompanionAction = null;
  viewingFeature: CompanionFeature = null;
  viewingSpell: CreatureSpell = null;

  constructor(
    private dialog: MatDialog,
    private eventsService: EventsService,
    private companionService: CompanionService,
    private monsterService: MonsterService,
    private creatureService: CreatureService,
    private abilityService: AbilityService,
    private diceService: DiceService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.initializeValues();
    this.setStep(0);
  }

  private initializeValues(): void {
    this.loading = true;
    this.calculatorState = new HealthCalculatorState();
    this.companionService.get(this.companionListObject.id).then((companion: Companion) => {
      this.companion = companion;

      if (this.companion == null) {
        this.loading = false;
        return;
      }

      const promises = [];
      promises.push(this.monsterService.getMonster(this.companion.monster.id).then((monster: Monster) => {
        this.monster = monster;
      }));
      promises.push(this.companionService.getMonsterActions(this.companion.id).then((actions: CompanionAction[]) => {
        this.actions = actions;
        this.actions.forEach((action: CompanionAction) => {
          action.calculatedMax = this.companionService.getMaxUses(action.monsterAction, this.collection);
        });
      }));
      promises.push(this.companionService.getMonsterFeatures(this.companion.id).then((features: CompanionFeature[]) => {
        this.features = features;
        this.features.forEach((feature: CompanionFeature) => {
          feature.calculatedMax = this.companionService.getMaxUses(feature.monsterFeature, this.collection);
        });
      }));
      promises.push(this.companionService.getSpells(this.companion.id).then((spells: CreatureSpell[]) => {
        this.spells = spells;
        // this.spells.forEach((spell: CreatureSpell) => {
        //   spell.calculatedMax = this.companionService.getMaxUses(spell, this.collection);
        // })
      }));

      promises.push(this.companionService.initializeConfigurationCollection(this.companion, this.characterCollection).then((collection: CreatureConfigurationCollection) => {
        this.collection = collection;
      }));

      Promise.all(promises).then(() => {
        this.companionService.addMonsterToCollection(this.monster, this.collection);

        const characterProf = this.creatureService.getProfModifier(this.characterCollection);
        this.ac = this.companionService.getAc(this.companion, this.collection, characterProf);

        this.abilityScores = [];
        this.collection.proficiencyCollection.abilities.forEach((abilityScore: CreatureAbilityProficiency) => {
          const display = new CreatureAbilityScoreDisplay();
          display.ability = abilityScore.abilityScore.ability.abbr;
          display.score = this.creatureService.getAbilityScore(abilityScore, this.collection);
          display.modifier = this.abilityService.getAbilityModifier(display.score);
          display.modifierDisplay = this.abilityService.convertScoreToString(display.modifier);
          display.saveModifier = this.companionService.getAbilitySaveModifier(abilityScore, this.companion, this.collection, characterProf);
          display.saveDisplay = this.abilityService.convertScoreToString(display.saveModifier);
          this.abilityScores.push(display);
        });

        this.speeds = [];
        if (this.monster != null) {
          this.monster.speeds.forEach((speed: Speed) => {
            const speedDisplay = new SpeedDisplay();
            speedDisplay.speedType = speed.speedType;
            speedDisplay.value = speed.value;
            if (speed.speedType === SpeedType.FLY) {
              speedDisplay.hover = this.monster.hover;
            }
            this.speeds.push(speedDisplay);
          });
        }

        this.loading = false;
      });
    });
  }

  setStep(step: number): void {
    this.step = step;
    switch (this.step) {
      case 0:
        this.headerName = this.companionListObject.name;
        break;
      case 1:
        this.headerName = this.translate.instant('Companion.Page.Actions');
        break;
      case 2:
        this.headerName = this.translate.instant('Companion.Page.Features');
        break;
      case 3:
        this.headerName = this.translate.instant('Companion.Page.Spells');
        break;
      case 4:
        this.headerName = this.translate.instant('Companion.Page.Scores');
        break;
      case 5:
        this.headerName = this.translate.instant('Companion.Page.Skills');
        break;
      case 6:
        this.headerName = this.translate.instant('Companion.Page.Misc');
        break;
    }
  }

  onClose(): void {
    if (this.calculatorState.healthModificationResults.length > 0) {
      const self = this;
      const data = new ConfirmDialogData();
      data.title = this.translate.instant('CreatureHealth.Cancel.Title');
      data.message = this.translate.instant('CreatureHealth.Cancel.Message');
      data.confirm = () => {
        self.close.emit();
      };
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.data = data;
      this.dialog.open(ConfirmDialogComponent, dialogConfig);
    } else {
      this.close.emit();
    }
  }

  configure(): void {
    if (this.calculatorState.healthModificationResults.length > 0) {
      const self = this;
      const data = new ConfirmDialogData();
      data.message = this.translate.instant('SaveAndContinueMessage');
      data.confirm = () => {
        this.saveDetails(false).then(() => {
          self.configuring = true;
        });
      };
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.data = data;
      this.dialog.open(ConfirmDialogComponent, dialogConfig);
    } else {
      this.configuring = true;
    }
  }

  saveConfiguration(companion: Companion): void {
    this.configuring = false;
    this.eventsService.dispatchEvent(EVENTS.CompanionUpdated)
    this.companionListObject.name = companion.name;
    this.companionListObject.maxHp = companion.maxHp;
    this.companionListObject.creatureHealth = companion.creatureHealth;
    this.save.emit(companion);
  }

  deleteCompanion(companion: Companion): void {
    this.configuring = false;
    this.eventsService.dispatchEvent(EVENTS.CompanionUpdated)
    this.delete.emit(companion);
  }

  cancel(): void {
    this.configuring = false;
  }

  saveDetails(close = true): Promise<any> {
    const creatureHealth = _.cloneDeep(this.companion.creatureHealth);
    creatureHealth.currentHp = this.calculatorState.calculatedCurrent;
    creatureHealth.tempHp = this.calculatorState.calculatedTemp;
    // creatureHealth.creatureHitDice = this.getUpdatedHitDice();

    creatureHealth.numDeathSaveThrowFailures = this.calculatorState.calculatedDeathSaveFailures;
    creatureHealth.numDeathSaveThrowSuccesses = this.calculatorState.calculatedDeathSaveSuccesses;
    creatureHealth.creatureState = this.calculatorState.calculatedCreatureState;
    // creatureHealth.resurrectionPenalty = 0;
    // creatureHealth.exhaustionLevel = 0;

    const promises = [];
    //update health
    promises.push(this.creatureService.updateCreatureHealth(this.companion, creatureHealth).then(() => {
      this.companion.creatureHealth = creatureHealth;
    }));

    //update conditions
    const creatureConditions = new CreatureConditions();
    creatureConditions.activeConditions = this.calculatorState.activeConditions;
    promises.push(this.creatureService.updateConditions(this.companion.id, creatureConditions).then((activeConditions: ActiveCondition[]) => {
      this.companion.activeConditions = activeConditions;
    }));

    if (this.calculatorState.failedConcentration && this.calculatorState.concentratingSpell != null) {
      promises.push(this.creatureService.loseConcentration(this.companion, this.calculatorState.concentratingSpell).then(() => {
        this.calculatorState.concentratingSpell = null;
      }));
    }

    const self = this;
    return Promise.all(promises).then(function () {
      self.eventsService.dispatchEvent(EVENTS.HpUpdated);

      if (close) {
        self.save.emit();
      } else {
        self.initializeValues();
      }
    });
  }

  abilityCheck(ability: CreatureAbilityScoreDisplay): void {
    const rollRequest = this.diceService.getStandardRollRequest(
      ability.ability,
      ability.modifier,
      false,
      false
    );

    this.creatureService.rollStandard(this.companion, rollRequest).then((roll: Roll) => {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.data = new RollResultDialogData(this.companion, roll);
      this.dialog.open(RollResultDialogComponent, dialogConfig);
    });
  }

  abilitySave(ability: CreatureAbilityScoreDisplay): void {
    const rollRequest = this.diceService.getStandardRollRequest(
      ability.ability,
      ability.saveModifier,
      false,
      false
    );

    this.creatureService.rollStandard(this.companion, rollRequest).then((roll: Roll) => {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.data = new RollResultDialogData(this.companion, roll);
      this.dialog.open(RollResultDialogComponent, dialogConfig);
    });
  }

  actionClick(action: CompanionAction): void {
    if (this.viewingAction == null) {
      this.viewingAction = action;
    }
  }

  useAction(action: CompanionAction): void {
    this.viewingAction = null;
  }

  closeAction(): void {
    this.viewingAction = null;
  }

  featureClick(feature: CompanionFeature): void {
    if (this.viewingFeature == null) {
      this.viewingFeature = feature;
    }
  }

  useFeature(feature: CompanionFeature): void {
    this.viewingFeature = null;
  }

  closeFeature(): void {
    this.viewingFeature = null;
  }

  spellClick(spell: CreatureSpell): void {
    if (this.viewingSpell == null) {
      this.viewingSpell = spell;
    }
  }

  useSpell(spell: SpellConfiguration): void {
    this.viewingSpell = null;
  }

  closeSpell(): void {
    this.viewingSpell = null;
  }
}
