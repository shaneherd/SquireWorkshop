import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {PlayerCharacter} from '../../../../shared/models/creatures/characters/player-character';
import {CreatureConfigurationCollection} from '../../../../shared/models/creatures/configs/creature-configuration-collection';
import {ChosenClass} from '../../../../shared/models/creatures/characters/chosen-class';
import {AbilityService} from '../../../../core/services/attributes/ability.service';
import {CharacterService} from '../../../../core/services/creatures/character.service';
import {TranslateService} from '@ngx-translate/core';
import {CharacterBackground} from '../../../../shared/models/creatures/characters/character-background';
import {CreatureSpell} from '../../../../shared/models/creatures/creature-spell';
import {SpellService} from '../../../../core/services/powers/spell.service';
import {PowerModifier} from '../../../../shared/models/powers/power-modifier';
import {CharacterRace} from '../../../../shared/models/creatures/characters/character-race';
import {CreatureService} from '../../../../core/services/creatures/creature.service';
import {CharacteristicType} from '../../../../shared/models/characteristics/characteristic-type.enum';
import {EventsService} from '../../../../core/services/events.service';
import {Characteristic} from '../../../../shared/models/characteristics/characteristic';
import {EVENTS} from '../../../../constants';
import {CreatureSpellConfiguration} from '../../../../shared/models/creatures/creature-spell-configuration';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-character-spells-display',
  templateUrl: './character-spells-display.component.html',
  styleUrls: ['./character-spells-display.component.scss']
})
export class CharacterSpellsDisplayComponent implements OnInit, OnDestroy {
  @Input() playerCharacter: PlayerCharacter;
  @Input() collection: CreatureConfigurationCollection;
  @Input() chosenClass: ChosenClass;
  @Input() characterRace: CharacterRace;
  @Input() characterBackground: CharacterBackground;
  @Input() clickDisabled = false;
  @Input() characteristic: Characteristic;
  @Input() attackModifiers: Map<string, PowerModifier>;
  @Input() saveModifiers: Map<string, PowerModifier>;
  @Output() spellClick = new EventEmitter();
  @Output() configuringClick = new EventEmitter();
  @Output() configuringClose = new EventEmitter();
  @Output() close = new EventEmitter();

  eventSub: Subscription;
  viewingSpell: CreatureSpell = null;
  characteristicId = '0';
  characteristicType: CharacteristicType = null;
  attackModifier: PowerModifier = null;
  saveModifier: PowerModifier = null;

  configuringAbility = false;
  configuringAttack = false;
  configuringSave = false;

  creatureSpellConfigurations: CreatureSpellConfiguration[] = [];

  constructor(
    private translate: TranslateService,
    private characterService: CharacterService,
    private creatureService: CreatureService,
    private abilityService: AbilityService,
    private spellService: SpellService,
    private eventsService: EventsService
  ) { }

  ngOnInit() {
    this.characteristicId = this.characteristic == null ? '0' : this.characteristic.id;
    this.characteristicType = this.characteristic == null ? null : this.characteristic.characteristicType;
    this.initializeSpellCasting();

    this.eventSub = this.eventsService.events.subscribe(event => {
      if (event === EVENTS.UpdateSpellcastingDisplay) {
        this.initializeSpellCasting();
      } else if (event === EVENTS.UpdateSpellList) {
        this.initializeSpells();
      }
    });
  }

  ngOnDestroy() {
    this.eventSub.unsubscribe();
  }

  private initializeSpells(): void {
    this.creatureSpellConfigurations = [];
    this.playerCharacter.creatureSpellCasting.spells.forEach((creatureSpell: CreatureSpell) => {
      if (!creatureSpell.hidden && creatureSpell.assignedCharacteristic === this.characteristicId) {
        const creatureSpellConfiguration: CreatureSpellConfiguration = this.characterService.getCreatureSpellConfiguration(this.playerCharacter, this.collection, creatureSpell);
        this.creatureSpellConfigurations.push(creatureSpellConfiguration);
      }
    });
  }

  private initializeSpellCasting(): void {
    this.initializeSpells();
    this.attackModifier = this.attackModifiers.get(this.characteristicId);
    this.saveModifier = this.saveModifiers.get(this.characteristicId);
  }

  onSpellCLick(creatureSpell: CreatureSpell): void {
    if (!this.clickDisabled) {
      this.viewingSpell = creatureSpell;
      this.spellClick.emit(creatureSpell);
    }
  }

  closeDetails(): void {
    this.viewingSpell = null;
    this.close.emit();
  }

  saveConfiguring(): void {
    this.closeConfiguring();
  }

  abilityClick(): void {
    this.configuringAbility = true;
    this.configuringClick.emit();
  }

  attackClick(): void {
    this.configuringAttack = true;
    this.configuringClick.emit();
  }

  saveClick(): void {
    this.configuringSave = true;
    this.configuringClick.emit();
  }

  closeConfiguring(): void {
    this.configuringAbility = false;
    this.configuringAttack = false;
    this.configuringSave = false;
    this.configuringClose.emit();
  }
}
