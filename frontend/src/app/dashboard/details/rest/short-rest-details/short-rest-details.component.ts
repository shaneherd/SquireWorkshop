import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {PlayerCharacter} from '../../../../shared/models/creatures/characters/player-character';
import {CreatureConfigurationCollection} from '../../../../shared/models/creatures/configs/creature-configuration-collection';
import {CreatureHitDiceModification} from '../../../../shared/models/creatures/creature-hit-dice-modification';
import {Roll} from '../../../../shared/models/rolls/roll';
import {TranslateService} from '@ngx-translate/core';
import {NotificationService} from '../../../../core/services/notification.service';
import {CreatureHitDice} from '../../../../shared/models/creatures/creature-hit-dice';
import {CharacterService} from '../../../../core/services/creatures/character.service';
import {EVENTS, SID} from '../../../../constants';
import {CreatureService} from '../../../../core/services/creatures/creature.service';
import * as _ from 'lodash';
import {CreatureState} from '../../../../shared/models/creatures/creature-state.enum';
import {EventsService} from '../../../../core/services/events.service';
import {HitDiceService} from '../../../../core/services/hit-dice.service';
import {CreaturePower} from '../../../../shared/models/creatures/creature-power';
import {Subscription} from 'rxjs';
import {HealthModificationType} from '../../../../shared/components/health-calculator/health-calculator.component';

@Component({
  selector: 'app-short-rest-details',
  templateUrl: './short-rest-details.component.html',
  styleUrls: ['./short-rest-details.component.scss']
})
export class ShortRestDetailsComponent implements OnInit, OnDestroy {
  @Input() playerCharacter: PlayerCharacter;
  @Input() collection: CreatureConfigurationCollection;
  @Output() save = new EventEmitter();
  @Output() close = new EventEmitter();

  eventSub: Subscription;
  currentHP = 0;
  tempHP = 0;
  currentHPTooltip = '';
  maxHP = 0;
  maxHPTooltip = '';
  maxHpModifier = 0;
  conModifier = 0;
  hitDice: CreatureHitDiceModification[] = [];
  hitDiceResults: number[] = [];
  deathSaveSuccesses = 0;
  deathSaveFailures = 0;
  creatureState: CreatureState = CreatureState.CONSCIOUS;

  constructor(
    private creatureService: CreatureService,
    private characterService: CharacterService,
    private translate: TranslateService,
    private notificationService: NotificationService,
    private eventsService: EventsService,
    private hitDiceService: HitDiceService
  ) { }

  ngOnInit() {
    this.initializeValues();

    this.eventSub = this.eventsService.events.subscribe(event => {
      if (event === EVENTS.ModifiersUpdated
        || event === EVENTS.AbilityScoreChange
        || event === EVENTS.HpUpdated
        || event === EVENTS.ExhaustionLevelChanged
        || event === EVENTS.HealthSettingsChanged) {
        this.initializeValues();
      }
    });
  }

  ngOnDestroy() {
    this.eventSub.unsubscribe();
  }

  private initializeValues(): void {
    this.initializeHP();
    this.hitDice = this.hitDiceService.getHitDice(this.playerCharacter, this.collection);
  }

  private initializeHP(): void {
    this.currentHP = this.playerCharacter.creatureHealth.currentHp;
    this.tempHP = this.playerCharacter.creatureHealth.tempHp;
    this.currentHPTooltip = this.creatureService.getCurrentHPTooltip(this.playerCharacter);
    this.maxHP = this.characterService.getMaxHP(this.playerCharacter, this.collection);
    this.maxHpModifier = this.maxHP - this.characterService.getMaxHP(this.playerCharacter, this.collection, false, false, false);
    this.maxHPTooltip = this.characterService.getMaxHPTooltip(this.playerCharacter, this.collection);
    const con = this.creatureService.getAbilityBySid(SID.ABILITIES.CONSTITUTION, this.collection);
    this.conModifier = this.creatureService.getAbilityModifier(con, this.collection);
    this.deathSaveSuccesses = this.playerCharacter.creatureHealth.numDeathSaveThrowSuccesses;
    this.deathSaveFailures = this.playerCharacter.creatureHealth.numDeathSaveThrowFailures;
    this.creatureState = this.playerCharacter.creatureHealth.creatureState;
  }

  closeDetails(): void {
    this.close.emit();
  }

  restClick(): void {
    const creatureHealth = _.cloneDeep(this.playerCharacter.creatureHealth);
    creatureHealth.currentHp = this.currentHP;
    creatureHealth.tempHp = 0;
    creatureHealth.creatureHitDice = this.getUpdatedHitDice();
    creatureHealth.numDeathSaveThrowFailures = this.deathSaveFailures;
    creatureHealth.numDeathSaveThrowSuccesses = this.deathSaveSuccesses;
    creatureHealth.creatureState = this.creatureState;

    const promises = [];
    const powers: CreaturePower[] = this.getPowersToReset();
    if (powers.length > 0) {
      promises.push(this.characterService.resetPowerLimitedUses(powers, this.playerCharacter, this.collection, false, false, true));
    }
    promises.push(this.creatureService.updateCreatureHealth(this.playerCharacter, creatureHealth));

    const self = this;
    Promise.all(promises).then(function () {
      self.playerCharacter.creatureHealth = creatureHealth;
      self.eventsService.dispatchEvent(EVENTS.HpUpdated);
      self.save.emit();
    });
  }

  private getPowersToReset(): CreaturePower[] {
    let powers: CreaturePower[] = this.getRechargeablePowers(this.playerCharacter.creatureFeatures.features);
    powers = powers.concat(this.getRechargeablePowers(this.playerCharacter.creatureSpellCasting.spells));
    return powers;
  }

  private getRechargeablePowers(creaturePowers: CreaturePower[]): CreaturePower[] {
    const rechargeablePowers: CreaturePower[] = [];
    creaturePowers.forEach((creaturePower: CreaturePower) => {
      if (creaturePower.rechargeOnShortRest) {
        rechargeablePowers.push(creaturePower);
      }
    });
    return rechargeablePowers;
  }

  private getUpdatedHitDice(): CreatureHitDice[] {
    const hitDice: CreatureHitDice[] = [];
    this.hitDice.forEach((creatureHitDiceModification: CreatureHitDiceModification) => {
      const hitDie = new CreatureHitDice();
      hitDie.diceSize = creatureHitDiceModification.diceSize;
      hitDie.remaining = creatureHitDiceModification.remaining;
      hitDice.push(hitDie);
    });
    return hitDice;
  }

  applyHitDiceResults(roll: Roll): void {
    const rollResult = roll.totalResult;
    const display = this.translate.instant('HealthModificationType.' + HealthModificationType.HIT_DICE, {
      diceSize: this.translate.instant('DiceSize.' + roll.results[0].results[0].diceSize),
      value: rollResult
    });

    this.notificationService.success(display);
    this.hitDiceResults.push(rollResult);
    this.updateNewHp(rollResult);
  }

  private updateNewHp(hitDiceResult: number): void {
    let calculatedCurrent = this.currentHP;

    calculatedCurrent = calculatedCurrent + hitDiceResult
    if (calculatedCurrent > this.maxHP) {
      calculatedCurrent = this.maxHP;
    }

    this.currentHP = calculatedCurrent;
    this.currentHPTooltip = this.getCalculatedTooltip();
    this.deathSaveFailures = 0;
    this.deathSaveSuccesses = 0;
    this.creatureState = CreatureState.CONSCIOUS;
  }

  private getCalculatedTooltip(): string {
    const parts = [];
    parts.push(this.translate.instant('Labels.Current') + ' ' + this.currentHP);
    if (this.tempHP) {
      parts.push(this.translate.instant('Labels.Temp') + ' ' + this.tempHP);
    }
    return parts.join('\n');
  }
}
