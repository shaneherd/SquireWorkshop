import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {PlayerCharacter} from '../../../../shared/models/creatures/characters/player-character';
import {CreatureConfigurationCollection} from '../../../../shared/models/creatures/configs/creature-configuration-collection';
import {EventsService} from '../../../../core/services/events.service';
import {CreatureService} from '../../../../core/services/creatures/creature.service';
import {CharacterService} from '../../../../core/services/creatures/character.service';
import {ModifierService} from '../../../../core/services/modifier.service';
import {EVENTS, SID, STRENGTH_MULTIPLIERS} from '../../../../constants';
import {CharacterSettings} from '../../../../shared/models/creatures/characters/character-settings';
import * as _ from 'lodash';
import {SingleCarryingDetails} from '../single-carrying-detail/single-carrying-detail.component';
import {TranslateService} from '@ngx-translate/core';
import {ProficiencyList} from '../../../../shared/models/proficiency-list';
import {Proficiency} from '../../../../shared/models/proficiency';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-carrying-configuration',
  templateUrl: './carrying-configuration.component.html',
  styleUrls: ['./carrying-configuration.component.scss']
})
export class CarryingConfigurationComponent implements OnInit, OnDestroy {
  @Input() playerCharacter: PlayerCharacter;
  @Input() collection: CreatureConfigurationCollection;
  @Output() save = new EventEmitter();
  @Output() close = new EventEmitter();

  MISC_NOT_FOUND = -9999999999;
  eventSub: Subscription;
  strScore = 0;
  equipment: SingleCarryingDetails;
  carryingCapacity: SingleCarryingDetails;
  pushCapacity: SingleCarryingDetails;
  encumbered: SingleCarryingDetails;
  heavilyEncumbered: SingleCarryingDetails;
  settings = new CharacterSettings();

  constructor(
    private eventsService: EventsService,
    private creatureService: CreatureService,
    private characterService: CharacterService,
    private modifierService: ModifierService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.settings = _.cloneDeep(this.playerCharacter.characterSettings);
    this.initializeValues(true);

    this.eventSub = this.eventsService.events.subscribe(event => {
      if (event === EVENTS.ModifiersUpdated
        || event === EVENTS.AbilityScoreChange
        || event === EVENTS.ItemsUpdated
        || event === EVENTS.SettingsUpdated
        || event === EVENTS.EquipmentSettingsUpdated) {
        this.initializeValues(false);
      }
    });
  }

  ngOnDestroy() {
    this.eventSub.unsubscribe();
  }

  private initializeValues(updateMisc: boolean): void {
    const str = this.creatureService.getAbilityBySid(SID.ABILITIES.STRENGTH, this.collection);
    this.strScore = this.creatureService.getAbilityScore(str, this.collection);

    this.initializeEquipment(updateMisc);
    this.carryingCapacity = this.initializeModifiedValue(SID.MISC_ATTRIBUTES.CARRYING_CAPACITY, this.strScore, STRENGTH_MULTIPLIERS.CARRYING, updateMisc);
    this.pushCapacity = this.initializeModifiedValue(SID.MISC_ATTRIBUTES.PUSH_CAPACITY, this.strScore, STRENGTH_MULTIPLIERS.PUSH, updateMisc);
    this.encumbered = this.initializeModifiedValue(SID.MISC_ATTRIBUTES.ENCUMBERED, this.strScore, STRENGTH_MULTIPLIERS.ENCUMBERED, updateMisc);
    this.heavilyEncumbered = this.initializeModifiedValue(SID.MISC_ATTRIBUTES.HEAVILY_ENCUMBERED, this.strScore, STRENGTH_MULTIPLIERS.HEAVILY_ENCUMBERED, updateMisc);

    setTimeout(() => {
      this.eventsService.dispatchEvent(EVENTS.UpdateSingleCarryingDetails);
    });
  }

  private initializeEquipment(updateMisc: boolean): void {
    const equipment = this.creatureService.getMiscModifier(SID.MISC_ATTRIBUTES.EQUIPMENT, this.collection);
    const base = this.characterService.getCarrying(this.playerCharacter, this.collection, false, false);
    const baseTooltip = this.characterService.getCarryingTooltip(this.playerCharacter, this.collection, false, false);
    const modifiers = this.creatureService.getModifiers(equipment.modifiers, this.collection);
    const modifiersDisplay = this.creatureService.getModifierLabels(equipment.modifiers, this.collection);
    let misc = this.creatureService.getMiscModifierValue(equipment);
    if (!updateMisc && this.equipment != null) {
      misc = this.equipment.misc;
    }

    const details = new SingleCarryingDetails();
    details.label = this.translate.instant('Headers.WeightCarried');
    details.sid = SID.MISC_ATTRIBUTES.EQUIPMENT;
    details.base = base;
    details.baseTooltip = baseTooltip;
    details.strScore = 0;
    details.strModifier = 0;
    details.creatureListProficiency = equipment;
    details.modifiers = modifiers;
    details.modifiersDisplay = modifiersDisplay;
    details.misc = misc;

    this.equipment = details;
  }

  private initializeModifiedValue(sid: number, strScore: number, strModifier: number, updateMisc: boolean): SingleCarryingDetails {
    const creatureListProficiency = this.creatureService.getMiscModifier(sid, this.collection);
    const modifiers = this.creatureService.getModifiers(creatureListProficiency.modifiers, this.collection);
    const modifiersDisplay = this.creatureService.getModifierLabels(creatureListProficiency.modifiers, this.collection);
    let misc = this.creatureService.getMiscModifierValue(creatureListProficiency);
    if (!updateMisc) {
      const temp = this.getMisc(sid);
      if (temp !== this.MISC_NOT_FOUND) {
        misc = temp;
      }
    }

    const details = new SingleCarryingDetails();
    details.label = this.getLabel(sid);
    details.labelTooltip = this.getLabelTooltip(sid);
    details.sid = sid;
    details.base = 0;
    details.baseTooltip = '';
    details.strScore = strScore;
    details.strModifier = strModifier;
    details.creatureListProficiency = creatureListProficiency;
    details.modifiers = modifiers;
    details.modifiersDisplay = modifiersDisplay;
    details.misc = misc;

    return details;
  }

  private getMisc(sid: number): number {
    let misc = this.MISC_NOT_FOUND;
    switch (sid) {
      case SID.MISC_ATTRIBUTES.CARRYING_CAPACITY:
        if (this.carryingCapacity != null) {
          misc = this.carryingCapacity.misc;
        }
        break;
      case SID.MISC_ATTRIBUTES.PUSH_CAPACITY:
        if (this.pushCapacity != null) {
          misc = this.pushCapacity.misc;
        }
        break;
      case SID.MISC_ATTRIBUTES.ENCUMBERED:
        if (this.encumbered != null) {
          misc = this.encumbered.misc;
        }
        break;
      case SID.MISC_ATTRIBUTES.HEAVILY_ENCUMBERED:
        if (this.heavilyEncumbered != null) {
          misc = this.heavilyEncumbered.misc;
        }
        break;
    }
    return misc;
  }

  private getLabel(sid: number): string {
    switch (sid) {
      case SID.MISC_ATTRIBUTES.CARRYING_CAPACITY:
        return this.translate.instant('Headers.CarryingCapacity');
      case SID.MISC_ATTRIBUTES.PUSH_CAPACITY:
        return this.translate.instant('Headers.PushLiftDrag');
      case SID.MISC_ATTRIBUTES.ENCUMBERED:
        return this.translate.instant('Headers.Encumbered');
      case SID.MISC_ATTRIBUTES.HEAVILY_ENCUMBERED:
        return this.translate.instant('Headers.HeavilyEncumbered');
    }

    return '';
  }

  private getLabelTooltip(sid: number): string {
    switch (sid) {
      case SID.MISC_ATTRIBUTES.ENCUMBERED:
        return this.translate.instant('Tooltips.Encumbered');
      case SID.MISC_ATTRIBUTES.HEAVILY_ENCUMBERED:
        return this.translate.instant('Tooltips.HeavilyEncumbered');
    }
    return '';
  }

  closeDetails(): void {
    this.close.emit();
  }

  saveDetails(): void {
    this.creatureService.updateProficiencyModifier(this.equipment.misc, this.equipment.creatureListProficiency, null);
    this.creatureService.updateProficiencyModifier(this.carryingCapacity.misc, this.carryingCapacity.creatureListProficiency, null);
    this.creatureService.updateProficiencyModifier(this.pushCapacity.misc, this.pushCapacity.creatureListProficiency, null);
    this.creatureService.updateProficiencyModifier(this.encumbered.misc, this.encumbered.creatureListProficiency, null);
    this.creatureService.updateProficiencyModifier(this.heavilyEncumbered.misc, this.heavilyEncumbered.creatureListProficiency, null);

    const promises = [];

    const proficiencies: Proficiency[] = [];
    proficiencies.push(this.equipment.creatureListProficiency.proficiency);
    proficiencies.push(this.carryingCapacity.creatureListProficiency.proficiency);
    proficiencies.push(this.pushCapacity.creatureListProficiency.proficiency);
    proficiencies.push(this.encumbered.creatureListProficiency.proficiency);
    proficiencies.push(this.heavilyEncumbered.creatureListProficiency.proficiency);
    const proficiencyList = new ProficiencyList();
    proficiencyList.proficiencies = proficiencies;
    promises.push(this.creatureService.updateAttributes(this.playerCharacter, proficiencyList));

    const settings = _.cloneDeep(this.playerCharacter.characterSettings);
    settings.equipment = this.settings.equipment;
    promises.push(this.characterService.updateCharacterSettings(this.playerCharacter, settings).then(() => {
      this.playerCharacter.characterSettings.equipment = settings.equipment;
    }));

    const self = this;
    Promise.all(promises).then(function() {
      self.eventsService.dispatchEvent(EVENTS.CarryingUpdated);
      self.save.emit();
    });
  }
}
