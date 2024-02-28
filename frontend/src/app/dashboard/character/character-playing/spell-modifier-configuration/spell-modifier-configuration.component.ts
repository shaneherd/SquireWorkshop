import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {PowerModifier} from '../../../../shared/models/powers/power-modifier';
import {TranslateService} from '@ngx-translate/core';
import {AttackType} from '../../../../shared/models/attack-type.enum';
import {PlayerCharacter} from '../../../../shared/models/creatures/characters/player-character';
import {CharacterService} from '../../../../core/services/creatures/character.service';
import {CreatureService} from '../../../../core/services/creatures/creature.service';
import {CreatureConfigurationCollection} from '../../../../shared/models/creatures/configs/creature-configuration-collection';
import {Proficiency} from '../../../../shared/models/proficiency';
import {Spellcasting} from '../../../../shared/models/spellcasting';
import {EVENTS} from '../../../../constants';
import {EventsService} from '../../../../core/services/events.service';
import {Subscription} from 'rxjs';
import {LabelValue} from '../../../../shared/models/label-value';
import {Creature} from '../../../../shared/models/creatures/creature';

@Component({
  selector: 'app-spell-modifier-configuration',
  templateUrl: './spell-modifier-configuration.component.html',
  styleUrls: ['./spell-modifier-configuration.component.scss']
})
export class SpellModifierConfigurationComponent implements OnInit, OnDestroy, OnChanges {
  @Input() creature: Creature;
  @Input() characteristicId: string;
  @Input() powerModifier: PowerModifier;
  @Input() collection: CreatureConfigurationCollection;
  @Output() save = new EventEmitter();
  @Output() close = new EventEmitter();

  eventSub: Subscription;
  header = '';
  isSave = false;
  abilityModifier = 0;
  profModifier = 0;
  proficiency: Proficiency = new Proficiency();
  modifiersDisplay: LabelValue[] = [];
  modifiers = 0;

  constructor(
    private translate: TranslateService,
    private eventsService: EventsService,
    private characterService: CharacterService,
    private creatureService: CreatureService
  ) { }

  ngOnInit() {
    this.initializeValues();
    this.initializeProficiency();

    this.eventSub = this.eventsService.events.subscribe(event => {
      if (event === EVENTS.AbilityScoreChange
        || event === EVENTS.ModifiersUpdated
        || event === EVENTS.ProficiencyUpdated) {
        this.initializeValues();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        if (propName === 'powerModifier') {
          this.initializeValues();
        }
      }
    }
  }

  private initializeValues(): void {
    this.isSave = this.powerModifier.attackType === AttackType.SAVE;
    this.abilityModifier = this.creatureService.getAbilityModifier(this.powerModifier.ability, this.collection);
    this.profModifier = this.creatureService.getProfModifier(this.collection);
    this.modifiers = this.creatureService.getModifiers(this.powerModifier.modifiers, this.collection);
    this.modifiersDisplay = this.creatureService.getModifierLabels(this.powerModifier.modifiers, this.collection);

    this.header = this.isSave ?
      this.translate.instant('Navigation.Manage.Spells.ConfigureSave') :
      this.header = this.translate.instant('Navigation.Manage.Spells.ConfigureAttack');
  }

  ngOnDestroy() {
    this.eventSub.unsubscribe();
  }

  private initializeProficiency(): void {
    this.proficiency.proficient = this.powerModifier.proficiency.proficient;
    this.proficiency.doubleProf = this.powerModifier.proficiency.doubleProf;
    this.proficiency.halfProf = this.powerModifier.proficiency.halfProf;
    this.proficiency.roundUp = this.powerModifier.proficiency.roundUp;
    this.proficiency.advantage = this.powerModifier.proficiency.advantage;
    this.proficiency.disadvantage = this.powerModifier.proficiency.disadvantage;
    this.proficiency.miscModifier = this.creatureService.getModifierValueFromProficiency(this.powerModifier.proficiency);
  }

  getProfModifier(): number {
    return this.creatureService.getProfModifierValue(this.profModifier, this.proficiency.proficient, this.proficiency);
  }

  miscChange(input): void {
    this.proficiency.miscModifier = parseInt(input.value, 10);
  }

  getTotal(): number {
    let total = this.abilityModifier + this.getProfModifier() + this.proficiency.miscModifier + this.modifiers;
    if (this.isSave) {
      total += 8;
    }
    return total;
  }

  saveClick(): void {
    this.powerModifier.proficiency = this.proficiency;
    const spellcasting = new Spellcasting();
    spellcasting.proficiency = this.proficiency;
    spellcasting.attackType = this.powerModifier.attackType;

    if (this.characteristicId === '0' || this.characteristicId === 'innate') {
      const innate = this.characteristicId === 'innate';
      this.creatureService.updateSpellcasting(this.creature, spellcasting, innate).then(() => {
        this.finishSave();
      });
    } else {
      this.characterService.updateCharacteristicSpellcasting(this.creature as PlayerCharacter, this.characteristicId, spellcasting).then(() => {
        this.finishSave();
      });
    }
  }

  private finishSave(): void {
    const event = EVENTS.SpellcastingAbilityChange;
    this.eventsService.dispatchEvent(event);
    this.save.emit();
  }

  closeDetails(): void {
    this.close.emit();
  }
}
