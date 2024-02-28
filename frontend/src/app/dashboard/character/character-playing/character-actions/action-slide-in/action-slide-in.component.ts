import {ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {CreatureAction} from '../../../../../shared/models/creatures/creature-action';
import {ListObject} from '../../../../../shared/models/list-object';
import {CreatureActionType} from '../../../../../shared/models/creatures/creature-action-type.enum';
import {CreatureSpell} from '../../../../../shared/models/creatures/creature-spell';
import {PlayerCharacter} from '../../../../../shared/models/creatures/characters/player-character';
import {CreatureFeature} from '../../../../../shared/models/creatures/creature-feature';
import {CreatureItem} from '../../../../../shared/models/creatures/creature-item';
import {CreatureItemService} from '../../../../../core/services/creatures/creature-item.service';
import {ChosenClass} from '../../../../../shared/models/creatures/characters/chosen-class';
import {CreatureAbilityProficiency} from '../../../../../shared/models/creatures/configs/creature-ability-proficiency';
import {Spellcasting} from '../../../../../shared/models/spellcasting';
import {AttackType} from '../../../../../shared/models/attack-type.enum';
import {CreatureService} from '../../../../../core/services/creatures/creature.service';
import {CharacterService} from '../../../../../core/services/creatures/character.service';
import {PowerModifier} from '../../../../../shared/models/powers/power-modifier';
import {CreatureConfigurationCollection} from '../../../../../shared/models/creatures/configs/creature-configuration-collection';
import {DamageConfigurationCollection} from '../../../../../shared/models/damage-configuration-collection';
import {PowerService} from '../../../../../core/services/powers/power.service';
import {CharacterLevel} from '../../../../../shared/models/character-level';
import {TranslateService} from '@ngx-translate/core';
import {EVENTS} from '../../../../../constants';
import {Subscription} from 'rxjs';
import {EventsService} from '../../../../../core/services/events.service';
import {CreatureItemState} from '../../../../../shared/models/creatures/creature-item-state.enum';
import * as _ from 'lodash';
import {SpellConfigurationCollectionItem} from '../../../../../shared/models/spell-configuration-collection-item';

@Component({
  selector: 'app-action-slide-in',
  templateUrl: './action-slide-in.component.html',
  styleUrls: ['./action-slide-in.component.scss']
})
export class ActionSlideInComponent implements OnInit, OnDestroy {
  @Input() creatureAction: CreatureAction;
  @Input() playerCharacter: PlayerCharacter;
  @Input() collection: CreatureConfigurationCollection;
  @Output() continue = new EventEmitter();
  @Output() cancel = new EventEmitter();

  eventSub: Subscription;
  actionChoices: ListObject[] = [];
  selectedAction: ListObject;
  characteristics: ListObject[] = [];

  creatureSpell: CreatureSpell;
  preparations = new Map<string, boolean>();
  requiresPreparation = false;
  spellAttackModifiers = new Map<string, PowerModifier>();
  spellSaveModifiers = new Map<string, PowerModifier>();
  spellAttackModifier: PowerModifier = null;
  spellSaveModifier: PowerModifier = null;
  slotsRemaining = -1;
  selectedSlot = 0;
  damages: DamageConfigurationCollection;
  useDisabled = false;

  creatureFeature: CreatureFeature;
  usesRemaining = 0;
  characterLevel: CharacterLevel = null;

  flatItems: CreatureItem[] = [];
  creatureItem: CreatureItem;

  constructor(
    private cd: ChangeDetectorRef,
    private powerService: PowerService,
    private characterService: CharacterService,
    private creatureService: CreatureService,
    private creatureItemService: CreatureItemService,
    private translate: TranslateService,
    private eventsService: EventsService
  ) { }

  ngOnInit() {
    this.characteristics = this.getCharacteristics();
    this.initializeActionChoices();

    this.eventSub = this.eventsService.events.subscribe(event => {
      if (event === EVENTS.AbilityScoreChange
        || event === EVENTS.SpellcastingAbilityChange
        || event === EVENTS.ModifiersUpdated) {
        this.initializePowerModifiers();
        if (this.creatureSpell != null) {
          this.spellActionChange(this.creatureSpell.id);
        } else if (this.creatureFeature != null) {
          this.featureActionChange(this.creatureFeature.id);
        } else if (this.creatureItem != null) {
          this.itemActionChange(this.creatureItem.id);
        }
      } else if (event === EVENTS.UpdateFeatureList) {
        if (this.creatureFeature != null) {
          this.featureActionChange(this.creatureFeature.id);
        }
      } else if (event === EVENTS.UpdateSpellList) {
        if (this.creatureSpell != null) {
          this.spellActionChange(this.creatureSpell.id);
        }
      } else if (event === EVENTS.ItemsUpdated) {
        if (this.creatureItem != null) {
          this.flatItems = this.creatureItemService.getFlatItemList(this.playerCharacter.items);
          this.creatureItem = this.getPrioritizedCreatureItem(this.creatureItem);
        }
      }
    });
  }

  ngOnDestroy() {
    this.eventSub.unsubscribe();
  }

  private getCharacteristics(): ListObject[] {
    const characteristics: ListObject[] = [];
    characteristics.push(new ListObject('0', ''));
    this.playerCharacter.classes.forEach((chosenClass: ChosenClass) => {
      characteristics.push(new ListObject(chosenClass.characterClass.id, chosenClass.characterClass.name));
    });
    characteristics.push(new ListObject(this.playerCharacter.characterRace.race.id, this.playerCharacter.characterRace.race.name));
    if (this.playerCharacter.characterBackground.background != null) {
      characteristics.push(new ListObject(this.playerCharacter.characterBackground.background.id, this.playerCharacter.characterBackground.background.name));
    }
    return characteristics;
  }

  private getCharacteristic(id: string): ListObject {
    for (let i = 0; i < this.characteristics.length; i++) {
      const characteristic = this.characteristics[i];
      if (characteristic.id === id) {
        return characteristic;
      }
    }
    return null;
  }

  private initializeActionChoices(): void {
    switch (this.creatureAction.creatureActionType) {
      case CreatureActionType.SPELL:
        this.initializePowerModifiers();
        this.initializePreparations();
        this.initializeSpellActionChoices();
        break;
      case CreatureActionType.FEATURE:
        this.initializeFeatureActionChoices();
        break;
      case CreatureActionType.ITEM:
        this.initializeItemActionChoices();
        break;
    }

    if (this.selectedAction == null && this.actionChoices.length > 0) {
      this.actionChange(this.actionChoices[0]);
    }
  }

  private initializeSpellActionChoices(): void {
    this.playerCharacter.creatureSpellCasting.spells.forEach((creatureSpell: CreatureSpell) => {
      if (creatureSpell.spell.id === this.creatureAction.item.id) {
        const characteristic = this.getCharacteristic(creatureSpell.assignedCharacteristic);
        if (characteristic != null) {
          const actionChoice = new ListObject(creatureSpell.id, creatureSpell.spell.name + ' - ' + characteristic.name);
          this.actionChoices.push(actionChoice);
          if (characteristic.id === this.creatureAction.defaultId) {
            this.actionChange(actionChoice);
          }
        }
      }
    });
  }

  private initializeFeatureActionChoices(): void {
    this.playerCharacter.creatureFeatures.features.forEach((creatureFeature: CreatureFeature) => {
      if (creatureFeature.feature.id === this.creatureAction.item.id) {
        if (creatureFeature.feature.characteristic == null) {
          const actionChoice = new ListObject(creatureFeature.id, creatureFeature.feature.name);
          this.actionChoices.push(actionChoice);
        } else {
          const actionChoice = new ListObject(creatureFeature.id, creatureFeature.feature.name + ' - ' + creatureFeature.feature.characteristic.name);
          this.actionChoices.push(actionChoice);
        }
      }
    });
  }

  private initializeItemActionChoices(): void {
    this.flatItems = this.creatureItemService.getFlatItemList(this.playerCharacter.items);
    const subItemId = this.creatureAction.subItem == null ? null : this.creatureAction.subItem.id;
    const uniqueCopies = this.creatureItemService.getUniqueCopies(this.creatureAction.item.id, subItemId, this.playerCharacter.items);
    uniqueCopies.sort(function(left: CreatureItem, right: CreatureItem) {
      if (left.chargesRemaining > 0 && right.chargesRemaining === 0) {
        return -1;
      } else if (left.chargesRemaining === 0 && right.chargesRemaining > 0) {
        return 1;
      } else {
        return 0;
      }
    });

    uniqueCopies.forEach((creatureItem: CreatureItem) => {
      let name = creatureItem.name;
      if (creatureItem.magicalItem != null) {
        name += ` (${creatureItem.magicalItem.name})`;
      }
      if (creatureItem.spells.length === 1) {
        name += ` (${creatureItem.spells[0].spell.name})`;
      }
      const properties = [];
      if (creatureItem.poisoned) {
        properties.push('P');
      }
      if (creatureItem.silvered) {
        properties.push('S');
      }
      if (creatureItem.attuned) {
        properties.push('A');
      }
      if (creatureItem.cursed) {
        properties.push('C');
      }
      const suffix = properties.join(', ');
      if (suffix !== '') {
        name += ' - ' + suffix;
      }

      const actionChoice = new ListObject(creatureItem.id, name);
      this.actionChoices.push(actionChoice);
    });
  }

  actionChange(action: ListObject): void {
    this.selectedAction = action;

    switch (this.creatureAction.creatureActionType) {
      case CreatureActionType.SPELL:
        this.spellActionChange(action.id);
        break;
      case CreatureActionType.FEATURE:
        this.featureActionChange(action.id);
        break;
      case CreatureActionType.ITEM:
        this.itemActionChange(action.id);
        break;
    }
  }

  spellActionChange(id: string): void {
    this.creatureSpell = this.getCreatureSpell(id);
    if (this.creatureSpell != null) {
      this.spellAttackModifier = this.spellAttackModifiers.get(this.creatureSpell.assignedCharacteristic);
      this.spellSaveModifier = this.spellSaveModifiers.get(this.creatureSpell.assignedCharacteristic);
      this.requiresPreparation = this.preparations.get(this.creatureSpell.assignedCharacteristic) || false;
    }
  }

  private getCreatureSpell(creatureSpellId: string): CreatureSpell {
    for (let i = 0; i < this.playerCharacter.creatureSpellCasting.spells.length; i++) {
      const creatureSpell = this.playerCharacter.creatureSpellCasting.spells[i];
      if (creatureSpell.id === creatureSpellId) {
        return creatureSpell;
      }
    }
    return null;
  }

  private featureActionChange(id: string): void {
    this.creatureFeature = this.getCreatureFeature(id);
  }

  private getCreatureFeature(creatureFeatureId: string): CreatureFeature {
    for (let i = 0; i < this.playerCharacter.creatureFeatures.features.length; i++) {
      const creatureFeature = this.playerCharacter.creatureFeatures.features[i];
      if (creatureFeature.id === creatureFeatureId) {
        return creatureFeature;
      }
    }
    return null;
  }

  itemActionChange(id: string): void {
    this.creatureItem = this.getCreatureItem(id);
  }

  private getCreatureItem(creatureItemId: string): CreatureItem {
    let matchedItem: CreatureItem = null;
    for (let i = 0; i < this.flatItems.length; i++) {
      const creatureItem = this.flatItems[i];
      if (creatureItem.id === creatureItemId) {
        matchedItem = creatureItem;
        break;
      }
    }

    return this.getPrioritizedCreatureItem(matchedItem);
  }

  private getPrioritizedCreatureItem(creatureItem: CreatureItem) {
    if (creatureItem == null) {
      return null;
    }
    let matchedItem: CreatureItem = null;
    for (let i = 0; i < this.flatItems.length; i++) {
      const current = this.flatItems[i];
      if (current.item.id === creatureItem.item.id
        && (
          (current.magicalItem == null && creatureItem.magicalItem == null)
          || (current.magicalItem != null && creatureItem.magicalItem != null && current.magicalItem.id === creatureItem.magicalItem.id)
        )
        && (
          current.spells.length === creatureItem.spells.length
          && (current.spells.length === 0 || current.spells[0].spell.id === creatureItem.spells[0].spell.id)
        )
        && (creatureItem.maxCharges === 0 || current.id === creatureItem.id)
        && current.attuned === creatureItem.attuned
        && current.poisoned === creatureItem.poisoned
        && current.silvered === creatureItem.silvered) {
        if (matchedItem == null) {
          matchedItem = current;
        } else if (current.creatureItemState === CreatureItemState.EQUIPPED) {
          matchedItem = current;
        } else if (matchedItem.creatureItemState === CreatureItemState.DROPPED && current.creatureItemState !== CreatureItemState.DROPPED) {
          matchedItem = current;
        }
      }
    }
    return matchedItem;
  }

  private initializePowerModifiers(): void {
    this.playerCharacter.classes.forEach((chosenClass: ChosenClass) => {
      this.initializeClassPowerModifier(chosenClass);
    });
    this.initializeRacePowerModifier();
    this.initializeBackgroundPowerModifier();
    this.initializeOtherPowerModifier();
  }

  private initializeClassPowerModifier(chosenClass: ChosenClass): void {
    const ability: CreatureAbilityProficiency = this.characterService.getChosenClassSpellCastingAbility(chosenClass, this.collection);
    this.initializePowerModifier(
      chosenClass.characterClass.id,
      ability,
      chosenClass.spellcastingAttack,
      chosenClass.spellcastingSave
    );
  }

  private initializeRacePowerModifier(): void {
    const ability: CreatureAbilityProficiency = this.characterService.getRaceSpellCastingAbility(this.playerCharacter.characterRace, this.collection);
    this.initializePowerModifier(
      this.playerCharacter.characterRace.race.id,
      ability,
      this.playerCharacter.characterRace.spellcastingAttack,
      this.playerCharacter.characterRace.spellcastingSave
    );
  }

  private initializeBackgroundPowerModifier(): void {
    if (this.playerCharacter.characterBackground.background == null) {
      return;
    }

    const ability: CreatureAbilityProficiency = this.characterService.getBackgroundSpellCastingAbility(this.playerCharacter.characterBackground, this.collection);
    this.initializePowerModifier(
      this.playerCharacter.characterBackground.background.id,
      ability,
      this.playerCharacter.characterBackground.spellcastingAttack,
      this.playerCharacter.characterBackground.spellcastingSave
    );
  }

  private initializeOtherPowerModifier(): void {
    const ability: CreatureAbilityProficiency = this.creatureService.getSpellcastingAbility(this.playerCharacter, this.collection);
    this.initializePowerModifier(
      '0',
      ability,
      this.playerCharacter.creatureSpellCasting.spellcastingAttack,
      this.playerCharacter.creatureSpellCasting.spellcastingSave
    );
  }

  private initializePowerModifier(characteristicId: string, ability: CreatureAbilityProficiency, spellcastingAttack: Spellcasting, spellcastingSave: Spellcasting): void {
    const attackModifier = this.creatureService.getSpellModifier(ability, this.collection, spellcastingAttack, AttackType.ATTACK, characteristicId);
    const saveModifier = this.creatureService.getSpellModifier(ability, this.collection, spellcastingSave, AttackType.SAVE, characteristicId);
    this.spellAttackModifiers.set(characteristicId, attackModifier);
    this.spellSaveModifiers.set(characteristicId, saveModifier);
  }

  private initializePreparations(): void {
    this.playerCharacter.classes.forEach((chosenClass: ChosenClass) => {
      this.preparations.set(chosenClass.characterClass.id, chosenClass.characterClass.classSpellPreparation.requirePreparation);
    });
    // this.characterService.updateHiddenByPrepared(this.playerCharacter.creatureSpellCasting.spells, this.playerCharacter, this.filters, this.collection);
  }

  onContinue(): void {
    this.continue.emit();
  }

  onItemContinue(): void {
    this.eventsService.dispatchEvent(EVENTS.FetchItemsList);
    this.continue.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }

}
