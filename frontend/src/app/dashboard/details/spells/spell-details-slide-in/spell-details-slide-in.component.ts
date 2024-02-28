import {ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {CreatureConfigurationCollection} from '../../../../shared/models/creatures/configs/creature-configuration-collection';
import {Spell} from '../../../../shared/models/powers/spell';
import {PowerService} from '../../../../core/services/powers/power.service';
import {CreatureSpell} from '../../../../shared/models/creatures/creature-spell';
import {PowerModifier} from '../../../../shared/models/powers/power-modifier';
import {TranslateService} from '@ngx-translate/core';
import {CreatureService} from '../../../../core/services/creatures/creature.service';
import {RollRequest} from '../../../../shared/models/rolls/roll-request';
import {Roll} from '../../../../shared/models/rolls/roll';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {RollResultDialogData} from '../../../../core/components/roll-results/roll-result-dialog/roll-result-dialog-data';
import {RollResultDialogComponent} from '../../../../core/components/roll-results/roll-result-dialog/roll-result-dialog.component';
import {DiceService} from '../../../../core/services/dice.service';
import {DamageConfigurationCollection} from '../../../../shared/models/damage-configuration-collection';
import {AttackType} from '../../../../shared/models/attack-type.enum';
import {CreatureSpellSlots} from '../../../../shared/models/creatures/creature-spell-slots';
import {CreatureSpellSlot} from '../../../../shared/models/creatures/creature-spell-slot';
import * as _ from 'lodash';
import {CharacterService} from '../../../../core/services/creatures/character.service';
import {EVENTS} from '../../../../constants';
import {EventsService} from '../../../../core/services/events.service';
import {YesNoDialogData} from '../../../../core/components/yes-no-dialog/yes-no-dialog-data';
import {YesNoDialogComponent} from '../../../../core/components/yes-no-dialog/yes-no-dialog.component';
import {RangeType} from '../../../../shared/models/powers/range-type.enum';
import {Subscription} from 'rxjs';
import {ModifierConfigurationCollection} from '../../../../shared/models/modifier-configuration-collection';
import {ListObject} from '../../../../shared/models/list-object';
import {CreatureSpellList} from '../../../../shared/models/creatures/creature-spell-list';
import {ButtonAction} from '../../../../shared/models/button/button-action';
import {Creature} from '../../../../shared/models/creatures/creature';
import {CreatureType} from '../../../../shared/models/creatures/creature-type.enum';
import {PlayerCharacter} from '../../../../shared/models/creatures/characters/player-character';

@Component({
  selector: 'app-spell-details-slide-in',
  templateUrl: './spell-details-slide-in.component.html',
  styleUrls: ['./spell-details-slide-in.component.scss']
})
export class SpellDetailsSlideInComponent implements OnInit, OnDestroy, OnChanges {
  @Input() actionChoices: ListObject[] = [];
  @Input() creatureSpell: CreatureSpell;
  @Input() requiresPreparation = false;
  @Input() attackModifier: PowerModifier;
  @Input() saveModifier: PowerModifier;
  @Input() creature: Creature;
  @Input() collection: CreatureConfigurationCollection;
  @Input() castable = true;
  @Output() cast = new EventEmitter();
  @Output() close = new EventEmitter();
  @Output() prepare = new EventEmitter();
  @Output() remove = new EventEmitter();
  @Output() selectionChange = new EventEmitter<string>();

  eventSub: Subscription;
  selectedAction: ListObject;
  configuring = false;
  loading = true;
  viewingSpell: Spell = null;
  useDisabled = false;
  concentratingSpell: CreatureSpell = null;
  confirmCast = '';
  active = false;
  showSlotsRemaining = true;

  prepared = false;
  tertiaryLabel = '';
  slotsRemaining = -1;
  selectedSlot = 0;
  damages: DamageConfigurationCollection;
  modifiers: ModifierConfigurationCollection;
  primaryActions: ButtonAction[] = [];

  constructor(
    private cd: ChangeDetectorRef,
    private dialog: MatDialog,
    private diceService: DiceService,
    private powerService: PowerService,
    private translate: TranslateService,
    private creatureService: CreatureService,
    private characterService: CharacterService,
    private eventsService: EventsService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.powerService.getPower(this.creatureSpell.spell.id).then((spell: Spell) => {
      this.viewingSpell = spell;
      if (this.viewingSpell != null && this.viewingSpell.concentration) {
        this.concentratingSpell = this.creatureService.getConcentratingSpell(this.creature);
        if (this.concentratingSpell != null && this.concentratingSpell.spell.id !== this.creatureSpell.spell.id) {
          this.confirmCast = this.translate.instant('ConfirmConcentratingCast', {'spell': this.concentratingSpell.spell.name});
        }
      }
      this.loading = false;
    });

    this.initializeSelectedAction();
    this.initializeSpellState();

    this.eventSub = this.eventsService.events.subscribe(event => {
      if (event === EVENTS.SpellSlotsUpdated) {
        if (this.selectedSlot > -1) {
          this.slotChange(this.selectedSlot);
        }
      } else if (event === EVENTS.UpdateSpellList) {
        this.updateCreatureSpell();
      } else if (event === EVENTS.SpellUpdated + this.creatureSpell.spell.id) {
        this.updateCreatureSpell();
        this.initializeSpellState();
      } else if (event === EVENTS.SpellRemoved + this.creatureSpell.spell.id) {
        this.closeDetails();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        if (propName === 'creatureSpell') {
          this.initializeSpellState();
          if (this.selectedSlot > -1) {
            this.slotChange(this.selectedSlot);
          }
        }
      }
    }
  }

  actionChange(action: ListObject): void {
    this.selectedAction = action;
    this.selectionChange.emit(action.id);
  }

  private updateCreatureSpell(): void {
    if (this.creature != null) {
      for (let i = 0; i < this.creature.creatureSpellCasting.spells.length; i++) {
        const spell = this.creature.creatureSpellCasting.spells[i];
        if (spell.id === this.creatureSpell.id) {
          this.creatureSpell = spell;
          break;
        }
      }
    }
  }

  private initializeSelectedAction(): void {
    for (let i = 0; i < this.actionChoices.length; i++) {
      const action = this.actionChoices[i];
      if (action.id === this.creatureSpell.id) {
        this.selectedAction = action;
        break;
      }
    }
  }

  private initializeSpellState(): void {
    let prepared: boolean;
    const requiresPreparation = this.requiresPreparation && this.creatureSpell.spell.level > 0;

    this.active = this.creatureSpell.active;
    if (this.active) {
      this.tertiaryLabel = this.translate.instant('Dismiss');
      prepared = true;
    } else {
      if (this.creatureSpell.innate) {
        prepared = true;
        this.tertiaryLabel = '';
        this.showSlotsRemaining = false;
        if (this.creatureSpell.innateMaxUses > 0) {
          this.tertiaryLabel = this.translate.instant('Reset');
        }
      } else if (requiresPreparation) {
        const creatureSpellConfiguration = this.characterService.getCreatureSpellConfiguration(this.creature, this.collection, this.creatureSpell);
        const alwaysPrepared = creatureSpellConfiguration.configuration.alwaysPrepared;
        prepared = alwaysPrepared || this.creatureSpell.prepared;
        if (!alwaysPrepared) {
          this.tertiaryLabel = this.creatureSpell.prepared ? this.translate.instant('Unprepare') : this.translate.instant('Prepare');
        }
      } else {
        prepared = true;
        this.tertiaryLabel = '';
      }
    }

    this.prepared = prepared;

    this.initializeActions(requiresPreparation, prepared);
  }

  private initializeActions(requiresPreparation: boolean, prepared: boolean): void {
    this.primaryActions = [];
    const self = this;
    if (this.castable && (!requiresPreparation || prepared)) {
      const castLabel = this.active ? this.translate.instant('Continue') : this.translate.instant('Cast');
      const castBtn = new ButtonAction('CAST_SPELL', castLabel, () => {
        this.castClick();
      }, this.useDisabled, this.confirmCast);
      this.primaryActions.push(castBtn);
    }
    const removeBtn = new ButtonAction('REMOVE_SPELL', self.translate.instant('Remove'), () => {
      this.removeSpell();
    });
    this.primaryActions.push(removeBtn);
  }

  ngOnDestroy() {
    this.eventSub.unsubscribe();
  }

  removeSpell(): void {
    this.configuring = false;

    this.creatureService.removeSpell(this.creature, this.creatureSpell).then(() => {
      this.eventsService.dispatchEvent(EVENTS.SpellRemoved + this.creatureSpell.spell.id);
      this.eventsService.dispatchEvent(EVENTS.FetchSpellList);
      this.remove.emit(this.creatureSpell);
    });
  }

  castClick(): void {
    const promises = [];
    promises.push(this.updateSpellSlot());
    promises.push(this.updateSpellState());
    Promise.all(promises).then(() => {
      this.cast.emit(this.creatureSpell);
    });
  }

  private updateSpellState(): Promise<any> {
    if (!this.creatureSpell.active && (this.viewingSpell.concentration || !this.viewingSpell.instantaneous)) {
      if (this.viewingSpell.instantaneous || this.modifiers == null || this.modifiers.modifierConfigurations.length === 0) {
        this.rollAttack();
        return this.finishActivatingSpell(false);
      } else if (this.viewingSpell.rangeType === RangeType.SELF) {
        this.rollAttack();
        return this.finishActivatingSpell(true);
      } else {
        this.promptIsSelfTarget();
        return Promise.resolve();
      }
    } else {
      this.rollAttack();
      if (this.creatureSpell.innate && this.creatureSpell.innateMaxUses > 0) {
        const active = !this.viewingSpell.instantaneous;
        const concentrating = this.viewingSpell.concentration;
        const target = this.creatureSpell.activeTargetCreatureId;
        return this.characterService.updateCreatureSpell(this.creature, this.creatureSpell, active, target, concentrating, 0, null, this.collection, false).then(() => {
          this.eventsService.dispatchEvent(EVENTS.SpellUpdated + this.creatureSpell.spell.id);
        });
      } else {
        return Promise.resolve();
      }
    }
  }

  private promptIsSelfTarget(): void {
    const data = new YesNoDialogData();
    data.title = this.translate.instant('SpellTarget');
    data.message = this.translate.instant('AreYouTheSpellTarget');
    data.yes = () => {
      this.rollAttack();
      this.finishActivatingSpell(true);
    };
    data.no = () => {
      this.rollAttack();
      this.finishActivatingSpell(false);
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = data;
    this.dialog.open(YesNoDialogComponent, dialogConfig);
  }

  private rollAttack(): void {
    if (this.damages.attackType !== AttackType.NONE) {
      const attackRequest = this.getAttackRequest();
      const damageRequest = this.getDamageRequest();

      this.creatureService.rollAttackDamage(this.creature, attackRequest, damageRequest).then((roll: Roll) => {
        this.showCastResult(roll);
      });
    }
  }

  private finishActivatingSpell(isSelfTarget: boolean): Promise<any> {
    const active = !this.viewingSpell.instantaneous;
    const concentrating = this.viewingSpell.concentration;
    const activeTargetCreatureId = isSelfTarget ? this.creature.id : '0';
    return this.characterService.updateCreatureSpell(this.creature, this.creatureSpell, active, activeTargetCreatureId, concentrating, this.selectedSlot, this.concentratingSpell, this.collection).then(() => {
      if (this.concentratingSpell != null && concentrating) {
        this.eventsService.dispatchEvent(EVENTS.SpellUpdated + this.concentratingSpell.spell.id);
      }
      this.eventsService.dispatchEvent(EVENTS.SpellUpdated + this.creatureSpell.spell.id);
      this.eventsService.dispatchEvent(EVENTS.ModifiersUpdated);
    });
  }

  private updateSpellSlot(): Promise<any> {
    if (this.selectedSlot > 0 && !this.active && !this.creatureSpell.innate) {
      const creatureSpellSlots: CreatureSpellSlots = new CreatureSpellSlots();
      creatureSpellSlots.spellSlots = _.cloneDeep(this.creature.creatureSpellCasting.spellSlots);
      this.useSpellSlot(creatureSpellSlots, this.selectedSlot);
      return this.creatureService.updateSpellSlots(this.creature, creatureSpellSlots).then((response: any) => {
        this.creature.creatureSpellCasting.spellSlots = creatureSpellSlots.spellSlots;
        this.eventsService.dispatchEvent(EVENTS.SpellSlotsUpdated);
        return response;
      });
    } else {
      return Promise.resolve();
    }
  }

  private useSpellSlot(creatureSpellSlots: CreatureSpellSlots, slotLevel: number): void {
    if (slotLevel === 0 || this.active) {
      return;
    }
    creatureSpellSlots.spellSlots.forEach((spellSlot: CreatureSpellSlot) => {
      if (spellSlot.level === slotLevel) {
        spellSlot.remaining--;
        if (spellSlot.remaining < 0) {
          spellSlot.remaining = 0;
        }
      }
    })
  }

  private getAttackDisadvantage(abilitySID: number): boolean {
    if (this.creature.creatureType === CreatureType.CHARACTER) {
      const playerCharacter = this.creature as PlayerCharacter;
      return this.characterService.hasModifiedAttackRollDisadvantage(playerCharacter, this.collection, abilitySID);
    } else {
      return this.creatureService.hasModifiedAttackRollDisadvantage(this.creature, abilitySID, this.collection);
    }
  }

  private getAttackRequest(): RollRequest {
    switch (this.damages.attackType) {
      case AttackType.ATTACK:
        const abilitySID = this.attackModifier.ability == null ? null : this.attackModifier.ability.ability.sid;
        const attackDisadvantage = this.getAttackDisadvantage(abilitySID);
        return this.diceService.getAttackRollRequest(
            this.creatureSpell.spell.name,
            this.damages.attackMod,
            this.damages.halfOnSave,
            this.attackModifier.proficiency.advantage,
            this.attackModifier.proficiency.disadvantage || attackDisadvantage);
      case AttackType.SAVE:
        return this.diceService.getSaveRollRequest(
            this.creatureSpell.spell.name,
            this.damages.attackMod,
            this.damages.halfOnSave);
      case AttackType.HEAL:
        return this.diceService.getHealRollRequest(this.creatureSpell.spell.name);
    }

    return null;
  }

  private getDamageRequest(): RollRequest {
    const damages = this.damages.damageConfigurations;
    return this.diceService.getDamageRollRequest(this.creatureSpell.spell.name, damages);
  }

  private showCastResult(roll: Roll): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = new RollResultDialogData(this.creature, roll);
    this.dialog.open(RollResultDialogComponent, dialogConfig);
    this.closeDetails();
  }

  closeDetails(): void {
    this.close.emit();
  }

  tertiaryClick(): void {
    if (this.active) {
      this.characterService.updateCreatureSpell(this.creature, this.creatureSpell, false, '0', false, 0, null, this.collection).then(() => {
        this.eventsService.dispatchEvent(EVENTS.SpellUpdated + this.creatureSpell.spell.id);
        this.eventsService.dispatchEvent(EVENTS.ModifiersUpdated);
        this.closeDetails();
      });
    } else if (this.creatureSpell.innate && this.creatureSpell.innateMaxUses > 0) {
      const spells: CreatureSpell[] = [];
      spells.push(this.creatureSpell);
      this.characterService.resetSpellLimitedUses(spells, this.creature).then(() => {
        this.eventsService.dispatchEvent(EVENTS.SpellUpdated + this.creatureSpell.spell.id);
        this.close.emit();
      });
    } else {
      this.onPrepare();
    }
  }

  private onPrepare(): void {
    const creatureSpellList: CreatureSpellList = new CreatureSpellList();
    const creatureSpell = _.cloneDeep(this.creatureSpell);
    creatureSpell.prepared = !this.creatureSpell.prepared;
    creatureSpellList.creatureSpells.push(creatureSpell);

    this.creatureService.prepareSpell(this.creature, creatureSpellList).then(() => {
      this.creatureSpell.prepared = !this.creatureSpell.prepared;
      this.eventsService.dispatchEvent(EVENTS.SpellUpdated + this.creatureSpell.spell.id);
      this.eventsService.dispatchEvent(EVENTS.FetchSpellList);
      this.prepare.emit();
    });
  }

  slotChange(selectedSlot: number): void {
    this.selectedSlot = selectedSlot;
    if (selectedSlot > 0) {
      this.slotsRemaining = this.creatureService.getSpellSlotsForLevel(this.creature, selectedSlot);
    } else {
      this.slotsRemaining = -1;
    }
    this.updateUseDisabled();
    this.cd.detectChanges();
  }

  private updateUseDisabled(): void {
    if (this.creatureSpell.innate) {
      this.useDisabled = this.creatureSpell.usesRemaining === 0 && this.creatureSpell.innateMaxUses > 0;
    } else {
      this.useDisabled = this.slotsRemaining === 0 && !this.creatureSpell.active;
    }
    const castBtn = _.find(this.primaryActions, (btn: ButtonAction) => { return btn.event === 'CAST_SPELL'; });
    if (castBtn != null) {
      castBtn.disabled = this.useDisabled;
    }
  }

  damageChange(damages: DamageConfigurationCollection): void {
    this.damages = damages;
  }

  modifierChange(modifiers: ModifierConfigurationCollection): void {
    this.modifiers = modifiers;
  }
}
