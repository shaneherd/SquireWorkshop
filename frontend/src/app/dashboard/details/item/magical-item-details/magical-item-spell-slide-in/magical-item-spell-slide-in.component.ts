import {ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {ListObject} from '../../../../../shared/models/list-object';
import {CreatureSpell} from '../../../../../shared/models/creatures/creature-spell';
import {CreatureConfigurationCollection} from '../../../../../shared/models/creatures/configs/creature-configuration-collection';
import {Subscription} from 'rxjs';
import {Spell} from '../../../../../shared/models/powers/spell';
import {DamageConfigurationCollection} from '../../../../../shared/models/damage-configuration-collection';
import {ModifierConfigurationCollection} from '../../../../../shared/models/modifier-configuration-collection';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {DiceService} from '../../../../../core/services/dice.service';
import {PowerService} from '../../../../../core/services/powers/power.service';
import {TranslateService} from '@ngx-translate/core';
import {CreatureService} from '../../../../../core/services/creatures/creature.service';
import {CharacterService} from '../../../../../core/services/creatures/character.service';
import {EventsService} from '../../../../../core/services/events.service';
import {RangeType} from '../../../../../shared/models/powers/range-type.enum';
import {YesNoDialogData} from '../../../../../core/components/yes-no-dialog/yes-no-dialog-data';
import {YesNoDialogComponent} from '../../../../../core/components/yes-no-dialog/yes-no-dialog.component';
import {AttackType} from '../../../../../shared/models/attack-type.enum';
import {Roll} from '../../../../../shared/models/rolls/roll';
import {RollRequest} from '../../../../../shared/models/rolls/roll-request';
import {RollResultDialogData} from '../../../../../core/components/roll-results/roll-result-dialog/roll-result-dialog-data';
import {RollResultDialogComponent} from '../../../../../core/components/roll-results/roll-result-dialog/roll-result-dialog.component';
import {MagicalItemSpellConfiguration} from '../../../../../shared/models/items/magical-item-spell-configuration';
import {Creature} from '../../../../../shared/models/creatures/creature';
import {MagicalItem} from '../../../../../shared/models/items/magical-item';
import {PlayerCharacter} from '../../../../../shared/models/creatures/characters/player-character';
import {CreatureType} from '../../../../../shared/models/creatures/creature-type.enum';
import {CreatureItem} from '../../../../../shared/models/creatures/creature-item';
import {MagicalItemType} from '../../../../../shared/models/items/magical-item-type.enum';
import {ConfirmDialogComponent} from '../../../../../core/components/confirm-dialog/confirm-dialog.component';
import {ConfirmDialogData} from '../../../../../core/components/confirm-dialog/confirmDialogData';
import {CreatureItemService} from '../../../../../core/services/creatures/creature-item.service';
import {CreatureItemAction} from '../../../../../shared/models/creatures/creature-item-action.enum';
import {PowerModifier} from '../../../../../shared/models/powers/power-modifier';
import {Proficiency} from '../../../../../shared/models/proficiency';
import {MagicalItemSpellAttackCalculationType} from '../../../../../shared/models/items/magical-item-spell-attack-calculation-type.enum';

@Component({
  selector: 'app-magical-item-spell-slide-in',
  templateUrl: './magical-item-spell-slide-in.component.html',
  styleUrls: ['./magical-item-spell-slide-in.component.scss']
})
export class MagicalItemSpellSlideInComponent implements OnInit, OnDestroy {
  @Input() creatureItem: CreatureItem;
  @Input() magicalItem: MagicalItem;
  @Input() magicalItemSpellConfiguration: MagicalItemSpellConfiguration;
  @Input() requiresPreparation = false;
  @Input() creature: Creature;
  @Input() collection: CreatureConfigurationCollection;
  @Input() castable = true;
  @Output() cast = new EventEmitter<boolean>();
  @Output() close = new EventEmitter();

  playerCharacter: PlayerCharacter;
  eventSub: Subscription;
  selectedAction: ListObject;
  loading = true;
  viewingSpell: Spell = null;
  useDisabled = false;
  concentratingSpell: CreatureSpell = null;
  confirmCast = '';
  active = false;

  castLabel = '';
  tertiaryLabel = '';
  selectedSlot = 0;
  damages: DamageConfigurationCollection;
  modifiers: ModifierConfigurationCollection;
  charges = 0;
  notInClassList = false;
  notAttuned = false;
  notEnoughCharges = false;

  constructor(
    private cd: ChangeDetectorRef,
    private dialog: MatDialog,
    private diceService: DiceService,
    private powerService: PowerService,
    private translate: TranslateService,
    private creatureService: CreatureService,
    private creatureItemService: CreatureItemService,
    private characterService: CharacterService,
    private eventsService: EventsService
  ) { }

  ngOnInit() {
    this.loading = true;
    if (this.creature != null && this.creature.creatureType === CreatureType.CHARACTER) {
      this.playerCharacter = this.creature as PlayerCharacter;
    }
    this.powerService.getPower(this.magicalItemSpellConfiguration.spell.id).then((spell: Spell) => {
      this.viewingSpell = spell;
      if (this.viewingSpell.concentration) {
        this.concentratingSpell = this.creatureService.getConcentratingSpell(this.creature);
        //todo - handle concentrating item spell

        if (this.concentratingSpell != null && this.concentratingSpell.spell.id !== this.magicalItemSpellConfiguration.spell.id) {
          this.confirmCast = this.translate.instant('ConfirmConcentratingCast', {'spell': this.concentratingSpell.spell.name});
        }
      }
      this.loading = false;
    });

    this.initializeSpellState();
    this.initializeDisabledState();

    this.eventSub = this.eventsService.events.subscribe(event => {
      //todo - handle concentration spell change
      //todo - handle spells list change
      //todo - handle creature item removed? - parent slide in being removed should handle this already

      // if (event === EVENTS.SpellSlotsUpdated) {
      //   if (this.selectedSlot > -1) {
      //     this.slotChange(this.selectedSlot);
      //   }
      // } else if (event === EVENTS.SpellUpdated + this.magicalItemSpellConfiguration.spell.id) {
      //   this.updateCreatureSpell();
      //   this.initializeSpellState();
      // } else if (event === EVENTS.SpellRemoved + this.magicalItemSpellConfiguration.spell.id) {
      //   this.closeDetails();
      // }
    });
  }

  private initializeDisabledState(): void {
    if (this.magicalItem.magicalItemType === MagicalItemType.SCROLL) {
      this.characterService.isSpellInClassList(this.magicalItemSpellConfiguration.spell, this.playerCharacter).then((inClassList: boolean) => {
        this.notInClassList = !inClassList;
        this.updateCastDisabled();
      });
    } else {
      this.updateCastDisabled();
    }
  }

  private initializeSpellState(): void {
    this.active = this.magicalItemSpellConfiguration.active;
    this.tertiaryLabel = this.active ? this.translate.instant('Dismiss') : '';

    if (this.castable) {
      this.castLabel = this.active ? this.translate.instant('Continue') : this.translate.instant('Cast');
    } else {
      this.castLabel = '';
    }
  }

  ngOnDestroy() {
    this.eventSub.unsubscribe();
  }

  castClick(): void {
    if (this.magicalItemSpellConfiguration.removeOnCasting || this.magicalItem.magicalItemType === MagicalItemType.SCROLL || (this.magicalItem.hasCharges && this.magicalItem.chanceOfDestruction && this.creatureItem.chargesRemaining <= this.charges)) {
      const data = new ConfirmDialogData();
      if (this.magicalItemSpellConfiguration.removeOnCasting) {
        data.title = this.translate.instant('MagicalItem.Spell.RemoveOnCasting.Confirmation.Title');
        data.message = this.translate.instant('MagicalItem.Spell.RemoveOnCasting.Confirmation.Message');
      } else if (this.magicalItem.magicalItemType === MagicalItemType.SCROLL) {
        const casterMaxSpellLevel = this.creatureService.getMaxSpellLevel(this.creature, this.collection);
        if (casterMaxSpellLevel < this.magicalItemSpellConfiguration.storedLevel) {
          data.title = this.translate.instant('MagicalItem.Spell.Scroll.ChanceOfFailure.Confirmation.Title');
          data.message = this.translate.instant('MagicalItem.Spell.Scroll.ChanceOfFailure.Confirmation.Message', {dc: (10 + this.magicalItemSpellConfiguration.storedLevel)});
        } else {
          data.title = this.translate.instant('MagicalItem.Spell.Scroll.OneTimeUse.Confirmation.Title');
          data.message = this.translate.instant('MagicalItem.Spell.Scroll.OneTimeUse.Confirmation.Message');
        }
      } else if (this.magicalItem.magicalItemType === MagicalItemType.POTION) {
        data.title = this.translate.instant('MagicalItem.Potion.OneTimeUse.Confirmation.Title');
        data.message = this.translate.instant('MagicalItem.Potion.OneTimeUse.Confirmation.Message');
      } else {
        data.title = this.translate.instant('MagicalItem.ChanceOfDestruction.Confirmation.Title');
        data.message = this.translate.instant('MagicalItem.ChanceOfDestruction.Confirmation.Message');
      }
      data.confirm = () => {
        this.continueCasting();
      };
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.data = data;
      this.dialog.open(ConfirmDialogComponent, dialogConfig);
    } else {
      this.continueCasting();
    }
  }

  private continueCasting(ignoreScrollCheck = false): void {
    if (!ignoreScrollCheck && this.magicalItem.magicalItemType === MagicalItemType.SCROLL) {
      const casterMaxSpellLevel = this.creatureService.getMaxSpellLevel(this.creature, this.collection);
      if (casterMaxSpellLevel < this.magicalItemSpellConfiguration.storedLevel) {
        this.rollForScrollCheck().then((success: boolean) => {
          if (success) {
            this.continueCasting(true);
          } else {
            // failed check - destroy scroll
            this.creatureItemService.performAction(CreatureItemAction.DISCARD, this.creature, this.creatureItem, 1).then(() => {
              this.cast.emit(true);
            });
          }
        });
      } else {
        this.continueCasting(true);
      }
    } else {
      if (this.magicalItemSpellConfiguration.active || this.viewingSpell.instantaneous || this.modifiers == null || this.modifiers.modifierConfigurations.length === 0) {
        this.rollAttack();
        this.finishProcessingSpell(false);
      } else if (this.viewingSpell.rangeType === RangeType.SELF) {
        this.rollAttack();
        this.finishProcessingSpell(true);
      } else {
        this.promptIsSelfTarget();
      }
    }
  }

  private processMagicalItemRules(): Promise<boolean> {
    if (!this.magicalItemSpellConfiguration.active)  {
      return this.creatureItemService.processMagicalItemRules(this.creatureItem, this.playerCharacter, this.charges, this.magicalItemSpellConfiguration);
    }

    return Promise.resolve(false);
  }

  private finishProcessingSpell(isSelfTarget: boolean): Promise<any> {
    return this.processMagicalItemRules().then((removed: boolean) => {
      if (!this.magicalItemSpellConfiguration.active && (this.viewingSpell.concentration || !this.viewingSpell.instantaneous)) {
        return this.finishActivatingSpell(isSelfTarget).then(() => {
          this.cast.emit(removed);
        });
      } else {
        this.cast.emit(removed);
      }
    });
  }

  private promptIsSelfTarget(): void {
    const data = new YesNoDialogData();
    data.title = this.translate.instant('SpellTarget');
    data.message = this.translate.instant('AreYouTheSpellTarget');
    data.yes = () => {
      this.rollAttack();
      this.finishProcessingSpell(true);
    };
    data.no = () => {
      this.rollAttack();
      this.finishProcessingSpell(false);
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
    return this.creatureItemService.activateMagicalItemSpell(this.creature, isSelfTarget, this.viewingSpell);
  }

  private rollForScrollCheck(): Promise<boolean> {
    return this.creatureItemService.rollForScrollCheck(this.creatureItem, this.creature, this.collection);
  }

  private getAttackRequest(): RollRequest {
    switch (this.damages.attackType) {
      case AttackType.ATTACK:
        let powerModifier: PowerModifier = null;
        let attackDisadvantage = false;

        if (this.magicalItem.spellAttackCalculationType === MagicalItemSpellAttackCalculationType.CASTER) {
          if (this.playerCharacter != null) {
            powerModifier = this.characterService.getMagicalItemMaxPowerModifier(this.magicalItem, this.playerCharacter, AttackType.ATTACK, this.collection);
            attackDisadvantage = this.characterService.hasModifiedAttackRollDisadvantage(this.playerCharacter, this.collection, powerModifier.ability.ability.sid);
          } else {
            //todo - monster
            powerModifier = new PowerModifier();
            powerModifier.proficiency = new Proficiency();
            //   attackDisadvantage = this.creatureService.hasModifiedAttackRollDisadvantage(this.creature, abilitySID, this.collection);
          }
        }

        return this.diceService.getAttackRollRequest(
          this.magicalItemSpellConfiguration.spell.name,
          this.damages.attackMod,
          this.damages.halfOnSave,
          powerModifier == null ? false : powerModifier.proficiency.advantage,
          powerModifier == null ? false : (powerModifier.proficiency.disadvantage || attackDisadvantage));
      case AttackType.SAVE:
        return this.diceService.getSaveRollRequest(
          this.magicalItemSpellConfiguration.spell.name,
          this.damages.attackMod,
          this.damages.halfOnSave);
      case AttackType.HEAL:
        return this.diceService.getHealRollRequest(this.magicalItemSpellConfiguration.spell.name);
    }

    return null;
  }

  private getDamageRequest(): RollRequest {
    const damages = this.damages.damageConfigurations;
    return this.diceService.getDamageRollRequest(this.magicalItemSpellConfiguration.spell.name, damages);
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
      //todo - dismiss spell

      // this.characterService.updateCreatureSpell(this.creature, this.magicalItemSpellConfiguration, false, '0', false, 0, null, this.collection).then(() => {
      //   this.eventsService.dispatchEvent(EVENTS.SpellUpdated + this.magicalItemSpellConfiguration.spell.id);
      //   this.eventsService.dispatchEvent(EVENTS.ModifiersUpdated);
      //   this.closeDetails();
      // });
    }
  }

  slotChange(selectedSlot: number): void {
    this.selectedSlot = selectedSlot;
  }

  damageChange(damages: DamageConfigurationCollection): void {
    this.damages = damages;
  }

  modifierChange(modifiers: ModifierConfigurationCollection): void {
    this.modifiers = modifiers;
  }

  chargeChange(cost: number): void {
    this.charges = cost;
    this.updateCastDisabled();
  }

  private updateCastDisabled(): void {
    let disabled = false;
    if (this.creatureItem == null) {
      disabled = true;
    } else if (this.magicalItem.hasCharges && this.magicalItemSpellConfiguration.charges > 0 && this.creatureItem.chargesRemaining < this.charges && !this.magicalItemSpellConfiguration.active && !this.magicalItemSpellConfiguration.concentrating) {
      disabled = true;
      this.notEnoughCharges = true;
    } else if (this.magicalItem.requiresAttunement && (!this.creatureItem.attuned || !this.characterService.canAttune(this.playerCharacter, this.creatureItem))) {
      this.notAttuned = true;
      disabled = true;
    } else if (this.magicalItem.magicalItemType === MagicalItemType.SCROLL && this.notInClassList) {
      disabled = true;
    }

    this.useDisabled = disabled;
  }
}
