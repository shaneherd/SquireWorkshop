import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PowerModifier} from '../../../../shared/models/powers/power-modifier';
import {CreatureService} from '../../../../core/services/creatures/creature.service';
import {CharacterService} from '../../../../core/services/creatures/character.service';
import {PlayerCharacter} from '../../../../shared/models/creatures/characters/player-character';
import {CharacteristicType} from '../../../../shared/models/characteristics/characteristic-type.enum';
import {EventsService} from '../../../../core/services/events.service';
import {ListObject} from '../../../../shared/models/list-object';
import {AbilityService} from '../../../../core/services/attributes/ability.service';
import {TranslateService} from '@ngx-translate/core';
import {EVENTS} from '../../../../constants';
import {Creature} from '../../../../shared/models/creatures/creature';

@Component({
  selector: 'app-spell-ability-configuration',
  templateUrl: './spell-ability-configuration.component.html',
  styleUrls: ['./spell-ability-configuration.component.scss']
})
export class SpellAbilityConfigurationComponent implements OnInit {
  @Input() creature: Creature;
  @Input() characteristicId: string;
  @Input() characteristicType: CharacteristicType;
  @Input() attackModifier: PowerModifier;
  @Input() saveModifier: PowerModifier;
  @Output() save = new EventEmitter();
  @Output() close = new EventEmitter();

  noAbility = '';
  ability = '0';
  abilities: ListObject[] = [];

  constructor(
    private abilityService: AbilityService,
    private creatureService: CreatureService,
    private characterService: CharacterService,
    private eventsService: EventsService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.initializeAbilities();
    this.initializeSelectedAbility();
  }

  private initializeAbilities(): void {
    this.noAbility = this.translate.instant('None');
    this.abilities = [];
    this.abilityService.getAbilities().then().then((abilities: ListObject[]) => {
      abilities = abilities.slice(0);
      const noAbility = new ListObject('0', '');
      abilities.unshift(noAbility);
      this.abilities = abilities;
    });
  }

  private initializeSelectedAbility(): void {
    this.ability = this.attackModifier.ability == null ? '0' : this.attackModifier.ability.ability.id;
  }

  spellcastingAbilityChange(value: string): void {
    this.ability = value;
  }

  saveClick(): void {
    if (this.characteristicId === '0' || this.characteristicId === 'innate') {
      const innate = this.characteristicId === 'innate';
      this.creatureService.updateSpellcastingAbility(this.creature, this.ability, innate).then(() => {
        this.finishSave();
      });
    } else {
      this.characterService.updateCharacteristicSpellcastingAbility(this.creature as PlayerCharacter, this.characteristicId, this.characteristicType, this.ability).then(() => {
        this.finishSave();
      });
    }
  }

  private finishSave(): void {
    this.eventsService.dispatchEvent(EVENTS.SpellcastingAbilityChange);
    this.save.emit();
  }

  closeDetails(): void {
    this.close.emit();
  }

}
