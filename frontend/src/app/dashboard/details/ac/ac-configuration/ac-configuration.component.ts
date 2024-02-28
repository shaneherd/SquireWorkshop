import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {CreatureConfigurationCollection} from '../../../../shared/models/creatures/configs/creature-configuration-collection';
import {Proficiency} from '../../../../shared/models/proficiency';
import {CreatureListProficiency} from '../../../../shared/models/creatures/creature-list-proficiency';
import {EventsService} from '../../../../core/services/events.service';
import {CharacterService} from '../../../../core/services/creatures/character.service';
import {CreatureService} from '../../../../core/services/creatures/creature.service';
import {EVENTS, SID} from '../../../../constants';
import {CreatureAbilityProficiency} from '../../../../shared/models/creatures/configs/creature-ability-proficiency';
import {Subscription} from 'rxjs';
import {LabelValue} from '../../../../shared/models/label-value';
import {CreatureAC} from '../../../../shared/models/creatures/creature-ac';
import {ListObject} from '../../../../shared/models/list-object';
import {AbilityService} from '../../../../core/services/attributes/ability.service';
import {Ability} from '../../../../shared/models/attributes/ability.model';
import * as _ from 'lodash';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {Creature} from '../../../../shared/models/creatures/creature';
import {CreatureType} from '../../../../shared/models/creatures/creature-type.enum';
import {BattleMonster} from '../../../../shared/models/creatures/battle-monsters/battle-monster';
import {MonsterService} from '../../../../core/services/creatures/monster.service';

export class AcAbilityConfiguration {
  ability: CreatureAbilityProficiency;
  modifier = 0;
  modifierDisplay = '';
  selected = false;
}

@Component({
  selector: 'app-ac-configuration',
  templateUrl: './ac-configuration.component.html',
  styleUrls: ['./ac-configuration.component.scss']
})
export class AcConfigurationComponent implements OnInit, OnDestroy {
  @Input() creature: Creature;
  @Input() collection: CreatureConfigurationCollection;
  @Output() save = new EventEmitter();
  @Output() close = new EventEmitter();

  eventSub: Subscription;
  base = 10;
  useBase = true;
  abilityList: AcAbilityConfiguration[] = [];
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
    private monsterService: MonsterService,
    private abilityService: AbilityService
  ) { }

  ngOnInit() {
    this.initializeAc();
    this.initializeProficiency();
    this.initializeAbilities();
    this.initializeValues();

    this.eventSub = this.eventsService.events.subscribe(event => {
      if (event === EVENTS.ModifiersUpdated
        || event === EVENTS.AbilityScoreChange
        || event === EVENTS.ItemsUpdated) {
        this.initializeAc();
        this.initializeAbilities();
        this.initializeValues();
      }
    });
  }

  ngOnDestroy() {
    this.eventSub.unsubscribe();
  }

  private initializeAbilities(): void {
    this.abilityList = [];
    const abilities = this.abilityService.getAbilitiesDetailedFromStorage();
    abilities.forEach((ability: Ability) => {
      const abilityProf = this.creatureService.getAbility(ability.id, this.collection);
      const modifier = this.creatureService.getAbilityModifier(abilityProf, this.collection);
      const config = new AcAbilityConfiguration();
      config.ability = abilityProf;
      config.modifier = modifier;
      config.modifierDisplay = this.abilityService.convertScoreToString(modifier);
      config.selected = _.findIndex(this.creature.acAbilities, function(_ability) { return _ability.id === ability.id }) > -1;
      this.abilityList.push(config);
    });
  }

  private initializeValues(): void {
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

  private initializeAc(): void {
    this.ac = this.creatureService.getMiscModifier(SID.MISC_ATTRIBUTES.AC, this.collection);
  }

  private initializeProficiency(): void {
    this.proficiency = new Proficiency();
    this.misc = this.creatureService.getModifierValueFromProficiency(this.ac.proficiency);
  }

  private updateTotal(): void {
    let total = this.misc + this.modifiers + this.items;
    if (this.useBase) {
      total += this.base;
      this.abilityList.forEach((config: AcAbilityConfiguration) => {
        if (config.selected) {
          total += config.modifier;
        }
      });
    }
    this.total = total;
  }

  miscChange(input): void {
    this.misc = parseInt(input.value, 10);
    this.updateTotal();
  }

  closeDetails(): void {
    this.close.emit();
  }

  configSelectionChange(event: MatCheckboxChange, config: AcAbilityConfiguration): void {
    config.selected = event.checked;
    this.updateTotal();
  }

  private getSelectedAcAbilities(): ListObject[] {
    const list: ListObject[] = [];
    this.abilityList.forEach((config: AcAbilityConfiguration) => {
      if (config.selected) {
        list.push(new ListObject(config.ability.ability.id, config.ability.ability.name));
      }
    });
    return list;
  }

  saveDetails(): void {
    this.creatureService.updateProficiencyModifier(this.misc, this.ac, this.proficiency);
    const creatureAC = new CreatureAC();
    creatureAC.abilities = this.getSelectedAcAbilities();

    const promises: Promise<any>[] = [];
    promises.push(this.creatureService.updateAttribute(this.creature, this.ac.proficiency))
    promises.push(this.creatureService.updateCreatureAc(this.creature, creatureAC));

    Promise.all(promises).then(() => {
      this.creature.acAbilities = creatureAC.abilities;
      if (this.close != null) {
        this.eventsService.dispatchEvent(EVENTS.AcUpdated);
        this.save.emit();
      }
    });
  }

}
