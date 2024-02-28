import {Component, Input, OnInit} from '@angular/core';
import {Monster, MonsterAbilityScore, MonsterAction, MonsterFeature} from '../../../../shared/models/creatures/monsters/monster';
import {SpeedType} from '../../../../shared/models/speed-type.enum';
import {MonsterConfigurationCollection} from '../../../../shared/models/creatures/configs/creature-configuration-collection';
import {MonsterService} from '../../../../core/services/creatures/monster.service';
import {CasterTypeService} from '../../../../core/services/attributes/caster-type.service';
import {ListObject} from '../../../../shared/models/list-object';
import {AbilityService} from '../../../../core/services/attributes/ability.service';

@Component({
  selector: 'app-monster-details',
  templateUrl: './monster-details.component.html',
  styleUrls: ['./monster-details.component.scss']
})
export class MonsterDetailsComponent implements OnInit {
  @Input() monster: Monster;
  @Input() actions: MonsterAction[] = [];
  @Input() features: MonsterFeature[] = [];

  loading = false;
  flySpeedType = SpeedType.FLY;
  monsterConfigurationCollection: MonsterConfigurationCollection = null;
  casterType: ListObject = null;
  spellcastingAbility: ListObject = null;
  innateSpellcastingAbility: ListObject = null;
  spellAttackTotal = 0;
  spellSaveTotal = 0;
  innateSpellAttackTotal = 0;
  innateSpellSaveTotal = 0;
  hasSlots = false;

  constructor(
    private monsterService: MonsterService,
    private casterTypeService: CasterTypeService,
    private abilityService: AbilityService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.monsterConfigurationCollection = new MonsterConfigurationCollection();

    this.monsterService.initializeConfigurationCollection(this.monster)
      .then((collection: MonsterConfigurationCollection) => {
        this.monsterConfigurationCollection = collection;

        this.casterTypeService.getCasterTypes().then((casterTypes: ListObject[]) => {
          this.casterType = this.getCasterType(this.monsterConfigurationCollection.spellConfigurationCollection.casterType, casterTypes);
        });
        const abilities = this.abilityService.getAbilitiesDetailedFromStorageAsListObject();
        this.spellcastingAbility = this.getAbility(this.monsterConfigurationCollection.spellConfigurationCollection.spellcastingAbility, abilities);
        this.innateSpellcastingAbility = this.getAbility(this.monsterConfigurationCollection.spellConfigurationCollection.innateSpellcastingAbility, abilities);

        const abilityScore = this.getAbilityScore();
        let spellcastingAbilityModifier = 0;
        if (abilityScore != null) {
          spellcastingAbilityModifier = this.abilityService.getAbilityModifier(abilityScore.value);
        }
        const profModifier = this.monsterService.getProfBonus(this.monster.challengeRating);
        this.spellAttackTotal = spellcastingAbilityModifier + profModifier + this.monster.spellAttackModifier;
        this.spellSaveTotal = 8 + spellcastingAbilityModifier + profModifier + this.monster.spellSaveModifier;

        const innateAbilityScore = this.getAbilityScore();
        let innateSpellcastingAbilityModifier = 0;
        if (innateAbilityScore != null) {
          innateSpellcastingAbilityModifier = this.abilityService.getAbilityModifier(innateAbilityScore.value);
        }
        this.innateSpellAttackTotal = innateSpellcastingAbilityModifier + profModifier + this.monster.innateSpellAttackModifier;
        this.innateSpellSaveTotal = 8 + innateSpellcastingAbilityModifier + profModifier + this.monster.innateSpellSaveModifier;

        this.hasSlots = this.monster.spellSlots.slot1 > 0
          || this.monster.spellSlots.slot2 > 0
          || this.monster.spellSlots.slot3 > 0
          || this.monster.spellSlots.slot4 > 0
          || this.monster.spellSlots.slot5 > 0
          || this.monster.spellSlots.slot6 > 0
          || this.monster.spellSlots.slot7 > 0
          || this.monster.spellSlots.slot8 > 0
          || this.monster.spellSlots.slot9 > 0;

        this.loading = false;
      });
  }

  private getAbilityScore(): MonsterAbilityScore {
    for (let i = 0; i < this.monster.abilityScores.length; i++) {
      const abilityScore = this.monster.abilityScores[i];
      if (abilityScore.ability.id === this.monsterConfigurationCollection.spellConfigurationCollection.spellcastingAbility) {
        return abilityScore;
      }
    }
    return null;
  }

  private getAbility(id: string, abilities: ListObject[]): ListObject {
    for (let i = 0; i < abilities.length; i++) {
      const ability: ListObject = abilities[i];
      if (ability.id === id) {
        return ability;
      }
    }
    return null;
  }

  private getCasterType(id: string, casterTypes: ListObject[]): ListObject {
    for (let i = 0; i < casterTypes.length; i++) {
      const casterType: ListObject = casterTypes[i];
      if (casterType.id === id) {
        return casterType;
      }
    }
    return null;
  }

}
