import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {PlayerCharacter} from '../../../../shared/models/creatures/characters/player-character';
import {CreatureConfigurationCollection} from '../../../../shared/models/creatures/configs/creature-configuration-collection';
import {EVENTS, SID, STRENGTH_MULTIPLIERS} from '../../../../constants';
import {EventsService} from '../../../../core/services/events.service';
import {CharacterService} from '../../../../core/services/creatures/character.service';
import {ModifierService} from '../../../../core/services/modifier.service';
import {CreatureService} from '../../../../core/services/creatures/creature.service';
import {SingleCarryingDetails} from '../single-carrying-detail/single-carrying-detail.component';
import {TranslateService} from '@ngx-translate/core';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-carrying-details',
  templateUrl: './carrying-details.component.html',
  styleUrls: ['./carrying-details.component.scss']
})
export class CarryingDetailsComponent implements OnInit, OnDestroy {
  @Input() playerCharacter: PlayerCharacter;
  @Input() collection: CreatureConfigurationCollection;
  @Output() close = new EventEmitter();

  eventSub: Subscription;
  configuring = false;
  strScore = 0;
  equipment: SingleCarryingDetails;
  carryingCapacity: SingleCarryingDetails;
  pushCapacity: SingleCarryingDetails;
  encumbered: SingleCarryingDetails;
  heavilyEncumbered: SingleCarryingDetails;
  isEncumbered = false;
  isHeavilyEncumbered = false;

  constructor(
    private eventsService: EventsService,
    private creatureService: CreatureService,
    private characterService: CharacterService,
    private modifierService: ModifierService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.initializeValues();

    this.eventSub = this.eventsService.events.subscribe(event => {
      if (event === EVENTS.ModifiersUpdated
        || event === EVENTS.AbilityScoreChange
        || event === EVENTS.CarryingUpdated
        || event === EVENTS.ItemsUpdated
        || event === EVENTS.SettingsUpdated
        || event === EVENTS.EquipmentSettingsUpdated) {
        this.initializeValues();
      }
    });
  }

  ngOnDestroy() {
    this.eventSub.unsubscribe();
  }

  private initializeValues(): void {
    const str = this.creatureService.getAbilityBySid(SID.ABILITIES.STRENGTH, this.collection);
    this.strScore = this.creatureService.getAbilityScore(str, this.collection);

    this.initializeEquipment();
    this.carryingCapacity = this.initializeModifiedValue(SID.MISC_ATTRIBUTES.CARRYING_CAPACITY, this.strScore, STRENGTH_MULTIPLIERS.CARRYING);
    this.pushCapacity = this.initializeModifiedValue(SID.MISC_ATTRIBUTES.PUSH_CAPACITY, this.strScore, STRENGTH_MULTIPLIERS.PUSH);
    this.encumbered = this.initializeModifiedValue(SID.MISC_ATTRIBUTES.ENCUMBERED, this.strScore, STRENGTH_MULTIPLIERS.ENCUMBERED);
    this.heavilyEncumbered = this.initializeModifiedValue(SID.MISC_ATTRIBUTES.HEAVILY_ENCUMBERED, this.strScore, STRENGTH_MULTIPLIERS.HEAVILY_ENCUMBERED);

    this.isEncumbered = this.characterService.isEncumbered(this.playerCharacter, this.collection);
    this.isHeavilyEncumbered = this.characterService.isHeavilyEncumbered(this.playerCharacter, this.collection);
  }

  private initializeEquipment(): void {
    const equipment = this.creatureService.getMiscModifier(SID.MISC_ATTRIBUTES.EQUIPMENT, this.collection);
    const base = this.characterService.getCarrying(this.playerCharacter, this.collection, false, false);
    const baseTooltip = this.characterService.getCarryingTooltip(this.playerCharacter, this.collection, false, false);
    const modifiers = this.creatureService.getModifiers(equipment.modifiers, this.collection);
    const modifiersDisplay = this.creatureService.getModifierLabels(equipment.modifiers, this.collection);
    const misc = this.creatureService.getMiscModifierValue(equipment);

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
    this.updateTotal(details);

    this.equipment = details;
  }

  private initializeModifiedValue(sid: number, strScore: number, strModifier: number): SingleCarryingDetails {
    const creatureListProficiency = this.creatureService.getMiscModifier(sid, this.collection);
    const modifiers = this.creatureService.getModifiers(creatureListProficiency.modifiers, this.collection);
    const modifiersDisplay = this.creatureService.getModifierLabels(creatureListProficiency.modifiers, this.collection);
    const misc = this.creatureService.getMiscModifierValue(creatureListProficiency);

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
    this.updateTotal(details);

    return details;
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

  private updateTotal(details: SingleCarryingDetails): void {
    details.total
      = details.base
      + (details.strScore * details.strModifier)
      + details.misc
      + details.modifiers;
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
}
