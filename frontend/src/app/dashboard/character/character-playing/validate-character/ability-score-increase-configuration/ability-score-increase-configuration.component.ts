import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CharacterValidationConfiguration} from '../validate-character.component';
import {Ability} from '../../../../../shared/models/attributes/ability.model';
import {CreatureAbilityProficiency} from '../../../../../shared/models/creatures/configs/creature-ability-proficiency';
import {CharacterService} from '../../../../../core/services/creatures/character.service';
import {CreatureService} from '../../../../../core/services/creatures/creature.service';
import {PlayerCharacter} from '../../../../../shared/models/creatures/characters/player-character';
import {CreatureConfigurationCollection} from '../../../../../shared/models/creatures/configs/creature-configuration-collection';
import {ListObject} from '../../../../../shared/models/list-object';
import {CharacterValidationConfigurationASI} from '../../../../../shared/models/creatures/characters/character-validation';

export class AbilityScoreIncreaseConfiguration {
  creatureAbilityProficiency: CreatureAbilityProficiency;
  score = 0;
  adjustmentAmount = 0;
  otherAdjustment = 0;
  upDisabled = false;
  downDisabled = false;
}

@Component({
  selector: 'app-ability-score-increase-configuration',
  templateUrl: './ability-score-increase-configuration.component.html',
  styleUrls: ['./ability-score-increase-configuration.component.scss']
})
export class AbilityScoreIncreaseConfigurationComponent implements OnInit {
  @Input() playerCharacter: PlayerCharacter
  @Input() collection: CreatureConfigurationCollection
  @Input() page: CharacterValidationConfiguration;
  @Input() pages: CharacterValidationConfiguration[];
  @Output() save = new EventEmitter();
  @Output() cancel = new EventEmitter();

  loading = false;
  abilities: Ability[] = [];
  asiConfigurations: AbilityScoreIncreaseConfiguration[] = [];
  pointsSpent = 0;
  pointsAllowed = 0;
  restrictToTwenty = true;

  constructor(
    private characterService: CharacterService,
    private creatureService: CreatureService
  ) { }

  ngOnInit() {
    this.initializeValues();
  }

  private initializeValues(): void {
    this.initializeASIConfigurations();
    this.restrictToTwenty = this.playerCharacter.characterSettings.restrictToTwenty;
    this.pointsAllowed = this.page.characterValidationItem.abilityScoreIncreaseApplicable ? 2 : 0;
    this.updatePointsSpent();
    this.updateASIConfigurations();
  }

  private initializeASIConfigurations(): void {
    const asiConfigs = [];
    this.collection.proficiencyCollection.abilities.forEach((creatureAbilityProficiency: CreatureAbilityProficiency) => {
      const config = new AbilityScoreIncreaseConfiguration();
      config.creatureAbilityProficiency = creatureAbilityProficiency;
      config.score = this.creatureService.getAbilityScore(creatureAbilityProficiency, this.collection);
      this.initializeAdjustmentAmount(config);
      this.initializeOtherAdjustmentAmount(config);
      asiConfigs.push(config);
    });
    this.asiConfigurations = asiConfigs;
  }

  private initializeOtherAdjustmentAmount(config: AbilityScoreIncreaseConfiguration): void {
    let other = 0;
    this.pages.forEach((page: CharacterValidationConfiguration) => {
      if (!this.isCurrentPage(page)) {
        other += this.getAdjustmentAmount(page, config.creatureAbilityProficiency.ability.id);
      }
    });
    config.otherAdjustment = other;
  }

  private isCurrentPage(page: CharacterValidationConfiguration): boolean {
    return page.characterValidationItem.characteristic.id === this.page.characterValidationItem.characteristic.id
      && page.characterValidationItem.level.id === this.page.characterValidationItem.level.id;
  }

  private initializeAdjustmentAmount(asiConfig: AbilityScoreIncreaseConfiguration): void {
    asiConfig.adjustmentAmount = this.getAdjustmentAmount(this.page, asiConfig.creatureAbilityProficiency.ability.id);
  }

  private getAdjustmentAmount(page: CharacterValidationConfiguration, abilityId: string): number {
    let amount = 0;
    page.abilityScoreIncreases.forEach((asi: CharacterValidationConfigurationASI) => {
      if (asi.ability.id === abilityId) {
        amount += asi.amount;
      }
    });
    return amount;
  }

  amountChange(): void {
    this.updatePointsSpent();
    this.updateASIConfigurations();
  }

  private updatePointsSpent(): void {
    let pointsSpent = 0;
    this.asiConfigurations.forEach((asiConfiguration: AbilityScoreIncreaseConfiguration) => {
      pointsSpent += asiConfiguration.adjustmentAmount;
    });
    this.pointsSpent = pointsSpent;
  }

  private updateASIConfigurations(): void {
    this.asiConfigurations.forEach((asiConfiguration: AbilityScoreIncreaseConfiguration) => {
      asiConfiguration.downDisabled = asiConfiguration.adjustmentAmount === 0;
      asiConfiguration.upDisabled = (asiConfiguration.score + asiConfiguration.adjustmentAmount + asiConfiguration.otherAdjustment >= 20 && this.restrictToTwenty) || this.pointsSpent === this.pointsAllowed;
    });
  }

  closeDetails(): void {
    this.cancel.emit();
  }

  saveClick(): void {
    this.page.abilityScoreIncreases = this.getNewASI();
    this.save.emit();
  }

  private getNewASI(): CharacterValidationConfigurationASI[] {
    const asiList: CharacterValidationConfigurationASI[] = [];
    this.asiConfigurations.forEach((config: AbilityScoreIncreaseConfiguration) => {
      if (config.adjustmentAmount > 0) {
        const asi = new CharacterValidationConfigurationASI();
        const ability = config.creatureAbilityProficiency.ability;
        asi.ability = new ListObject(ability.id, ability.name, ability.sid);
        asi.amount = config.adjustmentAmount;
        asiList.push(asi);
      }
    });
    return asiList;
  }

}
