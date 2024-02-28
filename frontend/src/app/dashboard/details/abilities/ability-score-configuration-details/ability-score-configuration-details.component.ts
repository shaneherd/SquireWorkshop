import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CreatureAbilityProficiency} from '../../../../shared/models/creatures/configs/creature-ability-proficiency';
import {PlayerCharacter} from '../../../../shared/models/creatures/characters/player-character';
import {CreatureConfigurationCollection} from '../../../../shared/models/creatures/configs/creature-configuration-collection';
import {CharacterService} from '../../../../core/services/creatures/character.service';
import {CreatureService} from '../../../../core/services/creatures/creature.service';
import {AbilityService} from '../../../../core/services/attributes/ability.service';
import {CreatureListModifierValue} from '../../../../shared/models/creatures/creature-list-modifier-value';
import {ModifierService} from '../../../../core/services/modifier.service';
import {LabelValue} from '../../../../shared/models/label-value';
import {Creature} from '../../../../shared/models/creatures/creature';

@Component({
  selector: 'app-ability-score-configuration-details',
  templateUrl: './ability-score-configuration-details.component.html',
  styleUrls: ['./ability-score-configuration-details.component.scss']
})
export class AbilityScoreConfigurationDetailsComponent implements OnInit {
  @Input() creatureAbilityProficiency: CreatureAbilityProficiency;
  @Input() creature: Creature;
  @Input() collection: CreatureConfigurationCollection;
  @Output() save = new EventEmitter();
  @Output() close = new EventEmitter();

  base = 0;
  modifiers = 0;
  modifiersDisplay: LabelValue[] = [];
  increases = 0;
  misc = 0;
  asi = 0;
  inherited = 0;

  constructor(
    private characterService: CharacterService,
    private creatureService: CreatureService,
    private abilityService: AbilityService,
    private modifierService: ModifierService
  ) { }

  ngOnInit() {
    this.initializeValues();
  }

  private initializeValues(): void {
    this.base = this.creatureService.getAbilityScore(this.creatureAbilityProficiency, this.collection, false, false, false, false);
    this.modifiers = this.creatureService.getModifiers(this.creatureAbilityProficiency.scoreModifiers, this.collection);
    this.modifiersDisplay = this.creatureService.getModifierLabels(this.creatureAbilityProficiency.scoreModifiers, this.collection);
    this.increases = this.abilityService.getAbilityScoreIncreaseModifier(this.creatureAbilityProficiency);
    this.misc = this.abilityService.getMiscModifier(this.creatureAbilityProficiency);
    this.asi = this.abilityService.getASI(this.creatureAbilityProficiency);
    this.inherited = this.getTotalInheritedValue();
  }

  baseChange(input): void {
    this.base = parseInt(input.value, 10);
  }

  miscChange(input): void {
    this.misc = parseInt(input.value, 10);
  }

  asiChange(input): void {
    this.asi = parseInt(input.value, 10);
  }

  getInheritedValue(inheritedValue: CreatureListModifierValue): string {
    return this.abilityService.convertScoreToString(inheritedValue.value);
  }

  private getTotalInheritedValue(): number {
    let total = 0;
    if (this.creatureAbilityProficiency.abilityModifier != null) {
      this.creatureAbilityProficiency.abilityModifier.inheritedValues.forEach((inheritedValue: CreatureListModifierValue) => {
        total += inheritedValue.value;
      });
    }
    return total;
  }

  getTotal(): string {
    const total = this.base + this.modifiers + this.increases + this.inherited + this.misc + this.asi;
    return this.abilityService.getScoreAndModifier(total);
  }

  saveDetails(): void {
    this.abilityService.updateBaseScore(this.creatureAbilityProficiency, this.base);
    this.abilityService.updateMiscModifier(this.creatureAbilityProficiency, this.misc);
    this.creatureAbilityProficiency.abilityScore.asiModifier = this.asi;

    this.creatureService.updateCreatureAbilityScore(this.creature, this.creatureAbilityProficiency.abilityScore).then(() => {
      this.save.emit();
    });
  }

  closeDetails(): void {
    this.close.emit();
  }
}
