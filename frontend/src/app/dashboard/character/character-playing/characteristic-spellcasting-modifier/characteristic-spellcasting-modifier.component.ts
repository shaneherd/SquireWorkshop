import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {PowerModifier} from '../../../../shared/models/powers/power-modifier';
import {PlayerCharacter} from '../../../../shared/models/creatures/characters/player-character';
import {Characteristic} from '../../../../shared/models/characteristics/characteristic';
import {Subscription} from 'rxjs';
import {CharacteristicType} from '../../../../shared/models/characteristics/characteristic-type.enum';
import {TranslateService} from '@ngx-translate/core';
import {CharacterService} from '../../../../core/services/creatures/character.service';
import {CreatureService} from '../../../../core/services/creatures/creature.service';
import {AbilityService} from '../../../../core/services/attributes/ability.service';
import {SpellService} from '../../../../core/services/powers/spell.service';
import {EventsService} from '../../../../core/services/events.service';
import {EVENTS} from '../../../../constants';
import {CreatureConfigurationCollection} from '../../../../shared/models/creatures/configs/creature-configuration-collection';
import {Creature} from '../../../../shared/models/creatures/creature';

@Component({
  selector: 'app-characteristic-spellcasting-modifier',
  templateUrl: './characteristic-spellcasting-modifier.component.html',
  styleUrls: ['./characteristic-spellcasting-modifier.component.scss']
})
export class CharacteristicSpellcastingModifierComponent implements OnInit, OnDestroy, OnChanges {
  @Input() creature: Creature;
  @Input() collection: CreatureConfigurationCollection;
  @Input() clickDisabled = false;
  @Input() characteristic: Characteristic;
  @Input() attackModifiers: Map<string, PowerModifier>;
  @Input() saveModifiers: Map<string, PowerModifier>;
  @Output() abilityClick = new EventEmitter();
  @Output() attackClick = new EventEmitter();
  @Output() saveClick = new EventEmitter();

  eventSub: Subscription;
  characteristicId = '0';
  characteristicType: CharacteristicType = null;
  ability = '';
  saveDC = '';
  spellAttack = '';
  saveDCTooltip = '';
  spellAttackTooltip = '';
  attackModifier: PowerModifier = null;
  saveModifier: PowerModifier = null;

  constructor(
    private translate: TranslateService,
    private characterService: CharacterService,
    private creatureService: CreatureService,
    private abilityService: AbilityService,
    private spellService: SpellService,
    private eventsService: EventsService
  ) { }

  ngOnInit() {
    this.initializeSpellCasting();

    this.eventSub = this.eventsService.events.subscribe(event => {
      if (event === EVENTS.UpdateSpellcastingDisplay) {
        this.initializeSpellCasting();
      }
    });
  }

  ngOnDestroy() {
    this.eventSub.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        if (propName === 'characteristic') {
          this.initializeSpellCasting();
        }
      }
    }
  }

  private initializeSpellCasting(): void {
    this.characteristicId = this.characteristic == null ? '0' : this.characteristic.id;
    this.characteristicType = this.characteristic == null ? null : this.characteristic.characteristicType;

    this.attackModifier = this.attackModifiers.get(this.characteristicId);
    this.saveModifier = this.saveModifiers.get(this.characteristicId);
    const ability = this.attackModifier.ability;

    if (ability == null) {
      this.ability = this.translate.instant('None');
    } else {
      this.ability = ability.ability.abbr;
    }

    const savePowerModifier = this.creatureService.getModifiers(this.saveModifier.modifiers, this.collection);
    const saveModifierValue = this.spellService.getSpellSaveDC(this.saveModifier, savePowerModifier);
    const saveModifierTooltips = this.creatureService.getModifierTooltips(this.saveModifier.modifiers, this.collection);
    this.saveDC = saveModifierValue.toString(10);
    this.saveDCTooltip = this.spellService.getSpellSaveDCTooltip(this.saveModifier, saveModifierTooltips);

    const attackPowerModifier = this.creatureService.getModifiers(this.attackModifier.modifiers, this.collection);
    const attackModifierValue = this.spellService.getSpellAttackModifier(this.attackModifier, attackPowerModifier, this.creature);
    const attackModifierTooltips = this.creatureService.getModifierTooltips(this.attackModifier.modifiers, this.collection);
    this.spellAttack = this.abilityService.convertScoreToString(attackModifierValue);
    this.spellAttackTooltip = this.spellService.getSpellAttackModifierTooltip(this.attackModifier, attackModifierTooltips, this.creature);
  }

  onAbilityClick(): void {
    if (!this.clickDisabled) {
      this.abilityClick.emit(this.characteristic);
    }
  }

  onAttackClick(): void {
    if (!this.clickDisabled) {
      this.attackClick.emit(this.characteristic);
    }
  }

  onSaveClick(): void {
    if (!this.clickDisabled) {
      this.saveClick.emit(this.characteristic);
    }
  }
}
