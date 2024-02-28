import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {CreatureConfigurationCollection} from '../../../../shared/models/creatures/configs/creature-configuration-collection';
import {EVENTS, SID} from '../../../../constants';
import {Proficiency} from '../../../../shared/models/proficiency';
import {EventsService} from '../../../../core/services/events.service';
import {CharacterService} from '../../../../core/services/creatures/character.service';
import {CreatureService} from '../../../../core/services/creatures/creature.service';
import {CreatureAbilityProficiency} from '../../../../shared/models/creatures/configs/creature-ability-proficiency';
import {CreatureListProficiency} from '../../../../shared/models/creatures/creature-list-proficiency';
import {Subscription} from 'rxjs';
import {LabelValue} from '../../../../shared/models/label-value';
import {Creature} from '../../../../shared/models/creatures/creature';
import {CreatureType} from '../../../../shared/models/creatures/creature-type.enum';
import {BattleMonster} from '../../../../shared/models/creatures/battle-monsters/battle-monster';
import {MonsterService} from '../../../../core/services/creatures/monster.service';

@Component({
  selector: 'app-ac-details',
  templateUrl: './ac-details.component.html',
  styleUrls: ['./ac-details.component.scss']
})
export class AcDetailsComponent implements OnInit, OnDestroy {
  @Input() creature: Creature;
  @Input() collection: CreatureConfigurationCollection;
  @Output() close = new EventEmitter();

  eventSub: Subscription;
  configuring = false;
  base = 10;
  useBase = true;
  abilities = 0;
  abilityDisplays: LabelValue[] = [];
  modifiers = 0;
  modifiersDisplay: LabelValue[] = [];
  misc = 0;
  items = 0;
  itemsDisplay: LabelValue[] = [];
  total = 0;

  proficiency: Proficiency = new Proficiency();
  ac: CreatureListProficiency;

  constructor(
    private eventsService: EventsService,
    private characterService: CharacterService,
    private creatureService: CreatureService,
    private monsterService: MonsterService
  ) { }

  ngOnInit() {
    this.initializeValues();

    this.eventSub = this.eventsService.events.subscribe(event => {
      if (event === EVENTS.ModifiersUpdated
        || event === EVENTS.AbilityScoreChange
        || event === EVENTS.AcUpdated
        || event === EVENTS.ItemsUpdated) {
          this.initializeValues();
      }
    });
  }

  ngOnDestroy() {
    this.eventSub.unsubscribe();
  }

  private initializeValues(): void {
    this.abilityDisplays = [];
    this.ac = this.creatureService.getMiscModifier(SID.MISC_ATTRIBUTES.AC, this.collection);
    this.initializeProficiency();
    const abilities = this.creatureService.getAbilities(this.creature.acAbilities, this.collection);
    this.abilities = 0;
    abilities.forEach((ability: CreatureAbilityProficiency) => {
      const abilityModifier = this.creatureService.getAbilityModifier(ability, this.collection);
      this.abilities += abilityModifier;
      const display = new LabelValue(ability.ability.abbr, abilityModifier.toString(10));
      this.abilityDisplays.push(display);
    });

    if (this.creature.creatureType === CreatureType.CHARACTER) {
      this.items = this.creatureService.calculateEquippedArmor(this.creature, this.collection);
      this.itemsDisplay = this.creatureService.getEquippedArmorTooltip(this.creature, this.collection);
      this.useBase = !this.creatureService.wearingBodyArmor(this.creature);
    } else if (this.creature.creatureType === CreatureType.MONSTER) {
      this.items = 0;
      this.itemsDisplay = [];
      this.useBase = true;
      this.base = this.monsterService.getAC(this.creature as BattleMonster, this.collection, false, false, false)
    }

    this.modifiers = this.creatureService.getModifiers(this.ac.modifiers, this.collection);
    this.modifiersDisplay = this.creatureService.getModifierLabels(this.ac.modifiers, this.collection);
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
    this.misc = this.creatureService.getModifierValueFromProficiency(this.ac.proficiency);
  }

  private updateTotal(): void {
    let total = this.misc + this.modifiers + this.items;
    if (this.useBase) {
      total += this.base + this.abilities;
    }
    this.total = total;
  }

  closeDetails(): void {
    this.close.emit();
  }
}
