import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {routing} from './dashboard.routing';
import {DashboardComponent} from './dashboard.component';
import {CharactersListComponent} from './character/characters-list/characters-list.component';
import {DefaultDetailsComponent} from './default-details/default-details.component';
import {DefaultPageComponent} from './default-page/default-page.component';
import {SharedModule} from '../shared/shared.module';
import {ViewEditComponent} from './view-edit/view-edit.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatNativeDateModule,
  MatProgressBarModule,
  MatSelectModule,
  MatTooltipModule
} from '@angular/material';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {BackgroundInfoComponent} from './manage/background/background-info/background-info.component';
import {BackgroundListComponent} from './manage/background/background-list/background-list.component';
import {CasterTypeInfoComponent} from './manage/caster-type/caster-type-info/caster-type-info.component';
import {CasterTypeListComponent} from './manage/caster-type/caster-type-list/caster-type-list.component';
import {ClassInfoComponent} from './manage/class/class-info/class-info.component';
import {ClassListComponent} from './manage/class/class-list/class-list.component';
import {ConditionInfoComponent} from './manage/condition/condition-info/condition-info.component';
import {ConditionListComponent} from './manage/condition/condition-list/condition-list.component';
import {FeatureInfoComponent} from './manage/feature/feature-info/feature-info.component';
import {FeatureListComponent} from './manage/feature/feature-list/feature-list.component';
import {ItemInfoComponent} from './manage/item/item-info/item-info.component';
import {ItemListComponent} from './manage/item/item-list/item-list.component';
import {LanguageInfoComponent} from './manage/language/language-info/language-info.component';
import {LanguageListComponent} from './manage/language/language-list/language-list.component';
import {RaceInfoComponent} from './manage/race/race-info/race-info.component';
import {RaceListComponent} from './manage/race/race-list/race-list.component';
import {SkillInfoComponent} from './manage/skill/skill-info/skill-info.component';
import {SkillListComponent} from './manage/skill/skill-list/skill-list.component';
import {SpellInfoComponent} from './manage/spell/spell-info/spell-info.component';
import {SpellListComponent} from './manage/spell/spell-list/spell-list.component';
import {WeaponPropertyInfoComponent} from './manage/weapon-property/weapon-property-info/weapon-property-info.component';
import {WeaponPropertyListComponent} from './manage/weapon-property/weapon-property-list/weapon-property-list.component';
import {ArmorTypeListComponent} from './manage/armor-type/armor-type-list/armor-type-list.component';
import {DamageTypeListComponent} from './manage/damage-type/damage-type-list/damage-type-list.component';
import {DamageTypeInfoComponent} from './manage/damage-type/damage-type-info/damage-type-info.component';
import {ArmorTypeInfoComponent} from './manage/armor-type/armor-type-info/armor-type-info.component';
import {BackgroundTraitListComponent} from './manage/background/background-trait-list/background-trait-list.component';
import {AddSpellsComponent} from './manage/spell/add-spells/add-spells.component';
import {SpellConfigurationListComponent} from './manage/spell/spell-configuration-list/spell-configuration-list.component';
import {SpellConfigurationComponent} from './manage/spell/spell-configuration/spell-configuration.component';
import {DamageModifierConfigurationsComponent} from './manage/damage-type/damage-modifier-configurations/damage-modifier-configurations.component';
import {AbilityScoreIncreasesComponent} from './manage/class/ability-score-increases/ability-score-increases.component';
import {SingleSpellConfigurationComponent} from './manage/spell/single-spell-configuration/single-spell-configuration.component';
import {WeaponInfoComponent} from './manage/item/weapon-info/weapon-info.component';
import {ArmorInfoComponent} from './manage/item/armor-info/armor-info.component';
import {GearInfoComponent} from './manage/item/gear-info/gear-info.component';
import {ToolInfoComponent} from './manage/item/tool-info/tool-info.component';
import {AmmoInfoComponent} from './manage/item/ammo-info/ammo-info.component';
import {MountInfoComponent} from './manage/item/mount-info/mount-info.component';
import {TreasureInfoComponent} from './manage/item/treasure-info/treasure-info.component';
import {PackInfoComponent} from './manage/item/pack-info/pack-info.component';
import {MagicalItemInfoComponent} from './manage/item/magical-item-info/magical-item-info.component';
import {ConnectingConditionsConfigurationComponent} from './manage/condition/connecting-conditions-configuration/connecting-conditions-configuration.component';
import {AlignmentInfoComponent} from './manage/alignment/alignment-info/alignment-info.component';
import {AlignmentListComponent} from './manage/alignment/alignment-list/alignment-list.component';
import {AreaOfEffectInfoComponent} from './manage/area-of-effect/area-of-effect-info/area-of-effect-info.component';
import {AreaOfEffectListComponent} from './manage/area-of-effect/area-of-effect-list/area-of-effect-list.component';
import {DeityInfoComponent} from './manage/deity/deity-info/deity-info.component';
import {DeityListComponent} from './manage/deity/deity-list/deity-list.component';
import {LevelInfoComponent} from './manage/level/level-info/level-info.component';
import {LevelListComponent} from './manage/level/level-list/level-list.component';
import {ToolCategoryInfoComponent} from './manage/tool-category/tool-category-info/tool-category-info.component';
import {ToolCategoryListComponent} from './manage/tool-category/tool-category-list/tool-category-list.component';
import {DeityCategoryInfoComponent} from './manage/deity/deity-category-info/deity-category-info.component';
import {DeityCategoryListComponent} from './manage/deity/deity-category-list/deity-category-list.component';
import {CharacterEditComponent} from './character/character-edit/character-edit.component';
import {CharacterPlayingComponent} from './character/character-playing/character-playing.component';
import {CreatureConditionImmunityConfigurationsComponent} from './creature/creature-condition-immunity-configurations/creature-condition-immunity-configurations.component';
import {CreatureDamageModifierConfigurationsComponent} from './creature/creature-damage-modifier-configurations/creature-damage-modifier-configurations.component';
import {CreatureSenseConfigurationsComponent} from './creature/creature-sense-configurations/creature-sense-configurations.component';
import {CharacterEditAbilitiesComponent} from './character/character-edit-abilities/character-edit-abilities.component';
import {CharacterEditAbilityComponent} from './character/character-edit-ability/character-edit-ability.component';
import {CharacterEditBasicInfoComponent} from './character/character-edit-basic-info/character-edit-basic-info.component';
import {CharacterEditChosenClassComponent} from './character/character-edit-chosen-class/character-edit-chosen-class.component';
import {CharacterEditBackgroundComponent} from './character/character-edit-background/character-edit-background.component';
import {CharacterEditCharacteristicsComponent} from './character/character-edit-characteristics/character-edit-characteristics.component';
import {CharacterEditHealthComponent} from './character/character-edit-health/character-edit-health.component';
import {CharacterEditHealthClassComponent} from './character/character-edit-health-class/character-edit-health-class.component';
import {CharacterEditHealthClassLevelComponent} from './character/character-edit-health-class-level/character-edit-health-class-level.component';
import {CharacterEditHealthHitDiceComponent} from './character/character-edit-health-hit-dice/character-edit-health-hit-dice.component';
import {CharacterEditBackgroundTraitChoiceCategoryComponent} from './character/character-edit-background-trait-choice-category/character-edit-background-trait-choice-category.component';
import {CreatureAbilitiesComponent} from './character/character-playing/creature-abilities/creature-abilities.component';
import {CharacterCharacteristicsComponent} from './character/character-playing/character-characteristics/character-characteristics.component';
import {CharacterCompanionsComponent} from './character/character-playing/character-companions/character-companions.component';
import {CreatureConditionsComponent} from './character/character-playing/creature-conditions/creature-conditions.component';
import {CreatureDamageModifiersComponent} from './character/character-playing/creature-damage-modifiers/creature-damage-modifiers.component';
import {CreatureEquipmentComponent} from './character/character-playing/creature-equipment/creature-equipment.component';
import {CharacterFeaturesComponent} from './character/character-playing/character-features/character-features.component';
import {CharacterNotesComponent} from './character/character-playing/character-notes/character-notes.component';
import {CreatureProficienciesComponent} from './character/character-playing/creature-proficiencies/creature-proficiencies.component';
import {CreatureSkillsComponent} from './character/character-playing/creature-skills/creature-skills.component';
import {CreatureSpellsComponent} from './character/character-playing/creature-spells/creature-spells.component';
import {CharacterPageOrderComponent} from './character/character-playing/character-page-order/character-page-order.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {ConditionDetailsSlideInComponent} from './details/condition/condition-details-slide-in/condition-details-slide-in.component';
import {SkillDetailsSlideInComponent} from './details/skills/skill-details-slide-in/skill-details-slide-in.component';
import {SkillConfigurationDetailsComponent} from './details/skills/skill-configuration-details/skill-configuration-details.component';
import {AbilitySaveConfigurationDetailsComponent} from './details/abilities/ability-save-configuration-details/ability-save-configuration-details.component';
import {AbilitySaveDetailsComponent} from './details/abilities/ability-save-details/ability-save-details.component';
import {AbilityScoreConfigurationDetailsComponent} from './details/abilities/ability-score-configuration-details/ability-score-configuration-details.component';
import {AbilityScoreDetailsComponent} from './details/abilities/ability-score-details/ability-score-details.component';
import {RollLogComponent} from './character/character-playing/roll-log/roll-log.component';
import {CharacterSettingsComponent} from './character/character-playing/character-settings/character-settings.component';
import {DamageModifierConfigurationDetailsComponent} from './details/damage-modifiers/damage-modifier-configuration-details/damage-modifier-configuration-details.component';
import {DamageModifierDetailsComponent} from './details/damage-modifiers/damage-modifier-details/damage-modifier-details.component';
import {NoteConfigurationDetailsComponent} from './details/notes/note-configuration-details/note-configuration-details.component';
import {FeatureDetailsComponent} from './details/features/feature-details/feature-details.component';
import {FeaturesSelectionListComponent} from './selection-list/features-selection-list/features-selection-list.component';
import {SelectionListSlideInComponent} from './selection-list/selection-list-slide-in/selection-list-slide-in.component';
import {AddRemoveFeatureComponent} from './selection-list/features-selection-list/add-remove-feature/add-remove-feature.component';
import {FeatureDetailsSlideInComponent} from './details/features/feature-details-slide-in/feature-details-slide-in.component';
import {SpellDetailsComponent} from './details/spells/spell-details/spell-details.component';
import {SpellDetailsSlideInComponent} from './details/spells/spell-details-slide-in/spell-details-slide-in.component';
import {SpellSelectionListComponent} from './selection-list/spell-selection-list/spell-selection-list.component';
import {AddRemoveSpellComponent} from './selection-list/spell-selection-list/add-remove-spell/add-remove-spell.component';
import {CharacterSpellsDisplayComponent} from './character/character-playing/character-spells-display/character-spells-display.component';
import {SpellAbilityConfigurationComponent} from './character/character-playing/spell-ability-configuration/spell-ability-configuration.component';
import {SpellModifierConfigurationComponent} from './character/character-playing/spell-modifier-configuration/spell-modifier-configuration.component';
import {CreatureSpellsCombinedDisplayComponent} from './character/character-playing/creature-spells-combined-display/creature-spells-combined-display.component';
import {CreatureSpellSlotsComponent} from './character/character-playing/creature-spell-slots/creature-spell-slots.component';
import {CreatureSpellSlotsSlideInComponent} from './character/character-playing/creature-spell-slots-slide-in/creature-spell-slots-slide-in.component';
import {CreatureSpellSlotsConfigurationComponent} from './character/character-playing/creature-spell-slots-configuration/creature-spell-slots-configuration.component';
import {CreatureSpellSlotUseRegainComponent} from './character/character-playing/creature-spell-slot-use-regain/creature-spell-slot-use-regain.component';
import {MatSliderModule} from '@angular/material/slider';
import {CreatureSpellSlotConfigureComponent} from './character/character-playing/creature-spell-slot-configure/creature-spell-slot-configure.component';
import {CharacterSpellInfoSlideInComponent} from './character/character-playing/character-spell-info-slide-in/character-spell-info-slide-in.component';
import {CharacterSpellInfoSingleCharacteristicComponent} from './character/character-playing/character-spell-info-single-characteristic/character-spell-info-single-characteristic.component';
import {SpellTaggingConfigurationSlideInComponent} from './character/character-playing/spell-tagging-configuration-slide-in/spell-tagging-configuration-slide-in.component';
import {SpellTaggingConfigurationComponent} from './character/character-playing/spell-tagging-configuration/spell-tagging-configuration.component';
import {TagColorConfigurationSlideInComponent} from './character/character-playing/tag-color-configuration-slide-in/tag-color-configuration-slide-in.component';
import {ColorSketchModule} from 'ngx-color/sketch';
import {PowerTaggingConfigurationSlideInComponent} from './character/character-playing/power-tagging-configuration-slide-in/power-tagging-configuration-slide-in.component';
import {ClassSpellInfoComponent} from './manage/class/class-spell-info/class-spell-info.component';
import {FeatureTaggingConfigurationSlideInComponent} from './character/character-playing/feature-tagging-configuration-slide-in/feature-tagging-configuration-slide-in.component';
import {FeatureTaggingConfigurationComponent} from './character/character-playing/feature-tagging-configuration/feature-tagging-configuration.component';
import {CharacterFeatureInfoSlideInComponent} from './character/character-playing/character-feature-info-slide-in/character-feature-info-slide-in.component';
import {CharacterFeatureUseRegainComponent} from './character/character-playing/character-feature-use-regain/character-feature-use-regain.component';
import {CreatureAbilityCardComponent} from './character/character-playing/creature-ability-card/creature-ability-card.component';
import {CreatureAbilitySaveCardComponent} from './character/character-playing/creature-ability-save-card/creature-ability-save-card.component';
import {CreatureSkillCardComponent} from './character/character-playing/creature-skill-card/creature-skill-card.component';
import {AcDetailsComponent} from './details/ac/ac-details/ac-details.component';
import {CarryingDetailsComponent} from './details/carrying/carrying-details/carrying-details.component';
import {HealthDetailsComponent} from './details/health/health-details/health-details.component';
import {InitiativeDetailsComponent} from './details/initiative/initiative-details/initiative-details.component';
import {LevelDetailsComponent} from './details/level/level-details/level-details.component';
import {ProficiencyBonusDetailsComponent} from './details/proficiency-bonus/proficiency-bonus-details/proficiency-bonus-details.component';
import {SpeedDetailsComponent} from './details/speed/speed-details/speed-details.component';
import {CharacterBasicComponent} from './character/character-playing/character-basic/character-basic.component';
import {SingleSpeedDetailsComponent} from './details/speed/single-speed-details/single-speed-details.component';
import {HealthConfigurationDetailsComponent} from './details/health/health-configuration-details/health-configuration-details.component';
import {HealthClassComponent} from './details/health/health-class/health-class.component';
import {HealthClassLevelComponent} from './details/health/health-class-level/health-class-level.component';
import {HealthClassHitDiceComponent} from './details/health/health-class-hit-dice/health-class-hit-dice.component';
import {ConcentrationCheckSlideInComponent} from './character/character-playing/concentration-check-slide-in/concentration-check-slide-in.component';
import {ConcentrationCheckConfigurationSlideInComponent} from './character/character-playing/concentration-check-configuration-slide-in/concentration-check-configuration-slide-in.component';
import {ResurrectionDetailsComponent} from './details/health/resurrection-details/resurrection-details.component';
import {AcConfigurationComponent} from './details/ac/ac-configuration/ac-configuration.component';
import {CarryingConfigurationComponent} from './details/carrying/carrying-configuration/carrying-configuration.component';
import {InitiativeConfigurationComponent} from './details/initiative/initiative-configuration/initiative-configuration.component';
import {SpeedConfigurationComponent} from './details/speed/speed-configuration/speed-configuration.component';
import {ProficiencyBonusConfigurationComponent} from './details/proficiency-bonus/proficiency-bonus-configuration/proficiency-bonus-configuration.component';
import {ConditionConfigurationComponent} from './details/condition/condition-configuration/condition-configuration.component';
import {MatRadioModule} from '@angular/material/radio';
import {SingleCarryingDetailComponent} from './details/carrying/single-carrying-detail/single-carrying-detail.component';
import {CharacterSlideInComponent} from './character/character-playing/character-slide-in/character-slide-in.component';
import {MatMenuModule} from '@angular/material/menu';
import {ShortRestDetailsComponent} from './details/rest/short-rest-details/short-rest-details.component';
import {LongRestDetailsComponent} from './details/rest/long-rest-details/long-rest-details.component';
import {ValidateCharacterComponent} from './character/character-playing/validate-character/validate-character.component';
import {AbilityScoreIncreaseConfigurationComponent} from './character/character-playing/validate-character/ability-score-increase-configuration/ability-score-increase-configuration.component';
import {FeatSelectionComponent} from './character/character-playing/validate-character/feat-selection/feat-selection.component';
import {AbilityScoreIncreaseConfigurationSingleScoreComponent} from './character/character-playing/validate-character/ability-score-increase-configuration-single-score/ability-score-increase-configuration-single-score.component';
import {FeatureSelectionItemsComponent} from './selection-list/feature-selection-items/feature-selection-items.component';
import {ValidateCharacterConfigurationComponent} from './character/character-playing/validate-character/validate-character-configuration/validate-character-configuration.component';
import {CreatureWealthComponent} from './character/character-playing/creature-wealth/creature-wealth.component';
import {CreatureWealthConfigurationComponent} from './character/character-playing/creature-wealth-configuration/creature-wealth-configuration.component';
import {MatDividerModule} from '@angular/material/divider';
import {CreatureEquipmentGroupComponent} from './character/character-playing/creature-equipment/creature-equipment-group/creature-equipment-group.component';
import {CreatureWealthConvertComponent} from './character/character-playing/creature-wealth-convert/creature-wealth-convert.component';
import {ItemDetailsSlideInComponent} from './details/item/item-details-slide-in/item-details-slide-in.component';
import {WeaponDetailsComponent} from './details/item/weapon-details/weapon-details.component';
import {ArmorDetailsComponent} from './details/item/armor-details/armor-details.component';
import {GearDetailsComponent} from './details/item/gear-details/gear-details.component';
import {ToolDetailsComponent} from './details/item/tool-details/tool-details.component';
import {AmmoDetailsComponent} from './details/item/ammo-details/ammo-details.component';
import {MountDetailsComponent} from './details/item/mount-details/mount-details.component';
import {TreasureDetailsComponent} from './details/item/treasure-details/treasure-details.component';
import {PackDetailsComponent} from './details/item/pack-details/pack-details.component';
import {MagicalItemDetailsComponent} from './details/item/magical-item-details/magical-item-details.component';
import {AddRemoveItemComponent} from './selection-list/item-selection-list/add-remove-item/add-remove-item.component';
import {ItemDetailsComponent} from './details/item/item-details/item-details.component';
import {BasicItemDetailsComponent} from './details/item/basic-item-details/basic-item-details.component';
import {AddRemoveSlideInComponent} from './selection-list/add-remove-slide-in/add-remove-slide-in.component';
import {CommonActionComponent} from './details/item/item-actions/common-action/common-action.component';
import {CostDetailsComponent} from './details/item/cost-details/cost-details.component';
import {EquipComponent} from './details/item/item-actions/equip/equip.component';
import {GainComponent} from './details/item/item-actions/gain/gain.component';
import {SellComponent} from './details/item/item-actions/sell/sell.component';
import {ShoppingCartSlideInComponent} from './character/character-playing/shopping-cart-slide-in/shopping-cart-slide-in.component';
import {ShoppingCartCartPageComponent} from './character/character-playing/shopping-cart-slide-in/shopping-cart-cart-page/shopping-cart-cart-page.component';
import {ShoppingCartCheckoutPageComponent} from './character/character-playing/shopping-cart-slide-in/shopping-cart-checkout-page/shopping-cart-checkout-page.component';
import {VehicleDetailsComponent} from './details/item/vehicle-details/vehicle-details.component';
import {VehicleInfoComponent} from './manage/item/vehicle-info/vehicle-info.component';
import {CharacterEquipmentSettingsComponent} from './character/character-playing/creature-equipment/character-equipment-settings/character-equipment-settings.component';
import {StartingEquipmentComponent} from './character/character-playing/starting-equipment/starting-equipment.component';
import {StartingEquipmentSelectionGroupComponent} from './character/character-playing/starting-equipment/starting-equipment-selection-group/starting-equipment-selection-group.component';
import {CharacterActionsComponent} from './character/character-playing/character-actions/character-actions.component';
import {ActionsSlideInComponent} from './character/character-playing/character-actions/actions-slide-in/actions-slide-in.component';
import {FavoriteActionsSlideInComponent} from './character/character-playing/character-actions/favorite-actions-slide-in/favorite-actions-slide-in.component';
import {StartingEquipmentFilterSelectionComponent} from './character/character-playing/starting-equipment/starting-equipment-filter-selection/starting-equipment-filter-selection.component';
import {ActionSlideInComponent} from './character/character-playing/character-actions/action-slide-in/action-slide-in.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import { CharacterPlayingColumnComponent } from './character/character-playing/character-playing-column/character-playing-column.component';
import { FeatureConfigurationComponent } from './manage/feature/feature-configuration/feature-configuration.component';
import { CharacteristicFeaturesSectionComponent } from './manage/characteristic-features-section/characteristic-features-section.component';
import { CharacteristicFeatureCardComponent } from './manage/characteristic-features-section/characteristic-feature-card/characteristic-feature-card.component';
import { AddItemsComponent } from './manage/item/add-items/add-items.component';
import { SpellSelectionItemsComponent } from './selection-list/spell-selection-items/spell-selection-items.component';
import { AttackActionComponent } from './details/item/item-actions/attack-action/attack-action.component';
import {SubclassListComponent} from './manage/class/subclass-list/subclass-list.component';
import { SubRaceListComponent } from './manage/race/sub-race-list/sub-race-list.component';
import { CharacteristicSpellcastingModifierComponent } from './character/character-playing/characteristic-spellcasting-modifier/characteristic-spellcasting-modifier.component';
import {HeaderModule} from '../core/header/header.module';
import {ImportsComponent} from './imports/imports.component';
import {CompareImportComponent} from './imports/compare-import/compare-import.component';
import {ImportItemComponent} from './imports/import-item/import-item.component';
import { ArmorTypeDetailsComponent } from './details/armor-type/armor-type-details/armor-type-details.component';
import { CasterTypeDetailsComponent } from './details/caster-type/caster-type-details/caster-type-details.component';
import { LanguageDetailsComponent } from './details/language/language-details/language-details.component';
import { WeaponPropertyDetailsComponent } from './details/weapon-property/weapon-property-details/weapon-property-details.component';
import { ConditionDetailsComponent } from './details/condition/condition-details/condition-details.component';
import { SkillDetailsComponent } from './details/skills/skill-details/skill-details.component';
import { BackgroundDetailsComponent } from './details/background/background-details/background-details.component';
import { CharacterClassDetailsComponent } from './details/character-class/character-class-details/character-class-details.component';
import { RaceDetailsComponent } from './details/race/race-details/race-details.component';
import { PlayerCharacterDetailsComponent } from './details/player-character/player-character-details/player-character-details.component';
import { MonsterDetailsComponent } from './details/monster/monster-details/monster-details.component';
import { SubBackgroundListComponent } from './manage/background/sub-background-list/sub-background-list.component';
import { ImportCategoryComponent } from './imports/import-category/import-category.component';
import { LinkImportComponent } from './imports/link-import/link-import.component';
import { CharacteristicDetailsComponent } from './details/characteristic/characteristic-details/characteristic-details.component';
import { MagicalItemSpellConfigurationComponent } from './manage/item/magical-item-info/magical-item-spell-configuration/magical-item-spell-configuration.component';
import { MagicalItemApplicableItemConfigurationComponent } from './manage/item/magical-item-info/magical-item-applicable-item-configuration/magical-item-applicable-item-configuration.component';
import {NgxMatSelectSearchModule} from 'ngx-mat-select-search';
import { MagicalItemTypeSelectionComponent } from './character/character-playing/shopping-cart-slide-in/magical-item-type-selection/magical-item-type-selection.component';
import { CreatureEquipmentChargesComponent } from './character/character-playing/creature-equipment-charges/creature-equipment-charges.component';
import { CharacterEquipmentAttunementComponent } from './character/character-playing/character-equipment-attunement/character-equipment-attunement.component';
import { ChargesComponent } from './details/item/item-actions/charges/charges.component';
import { SpellsComponent } from './details/item/item-actions/spells/spells.component';
import { MagicalItemDamageConfigurationComponent } from './manage/item/magical-item-info/magical-item-damage-configuration/magical-item-damage-configuration.component';
import { MagicalItemSpellsComponent } from './manage/item/magical-item-info/magical-item-spells/magical-item-spells.component';
import { MagicalItemApplicableSpellConfigurationComponent } from './manage/item/magical-item-info/magical-item-applicable-spell-configuration/magical-item-applicable-spell-configuration.component';
import { MagicalItemSpellSelectionComponent } from './character/character-playing/shopping-cart-slide-in/magical-item-spell-selection/magical-item-spell-selection.component';
import { AddClassesComponent } from './manage/class/add-classes/add-classes.component';
import { AddRemoveClassComponent } from './manage/class/add-remove-class/add-remove-class.component';
import { MagicalItemAttunementClassConfigurationComponent } from './manage/item/magical-item-info/magical-item-attunement-class-configuration/magical-item-attunement-class-configuration.component';
import { MagicalItemSpellSlideInComponent } from './details/item/magical-item-details/magical-item-spell-slide-in/magical-item-spell-slide-in.component';
import { MagicalItemTableConfigurationComponent } from './manage/item/magical-item-info/magical-item-table-configuration/magical-item-table-configuration.component';
import { MagicalItemTableCellConfigurationComponent } from './manage/item/magical-item-info/magical-item-table-cell-configuration/magical-item-table-cell-configuration.component';
import { AddAlignmentsComponent } from './manage/alignment/add-alignments/add-alignments.component';
import { AddRemoveAlignmentComponent } from './manage/alignment/add-remove-alignment/add-remove-alignment.component';
import { MagicalItemAttunementAlignmentConfigurationComponent } from './manage/item/magical-item-info/magical-item-attunement-alignment-configuration/magical-item-attunement-alignment-configuration.component';
import { AlignmentDetailsComponent } from './details/alignment/alignment-details/alignment-details.component';
import { AddRacesComponent } from './manage/race/add-races/add-races.component';
import { AddRemoveRaceComponent } from './manage/race/add-remove-race/add-remove-race.component';
import { MagicalItemAttunementRaceConfigurationComponent } from './manage/item/magical-item-info/magical-item-attunement-race-configuration/magical-item-attunement-race-configuration.component';
import { MonsterListComponent } from './manage/monster/monster-list/monster-list.component';
import { MonsterInfoComponent } from './manage/monster/monster-info/monster-info.component';
import { MonsterActionSectionComponent } from './manage/monster/monster-action-section/monster-action-section.component';
import { MonsterFeatureSectionComponent } from './manage/monster/monster-feature-section/monster-feature-section.component';
import { MonsterFeatureCardComponent } from './manage/monster/monster-feature-section/monster-feature-card/monster-feature-card.component';
import { MonsterActionCardComponent } from './manage/monster/monster-action-section/monster-action-card/monster-action-card.component';
import { MonsterActionConfigurationComponent } from './manage/monster/monster-action-section/monster-action-configuration/monster-action-configuration.component';
import { MonsterFeatureConfigurationComponent } from './manage/monster/monster-feature-section/monster-feature-configuration/monster-feature-configuration.component';
import { MonsterSpellInfoComponent } from './manage/monster/monster-spell-info/monster-spell-info.component';
import { MonsterSpellConfigurationListComponent } from './manage/monster/monster-spell-configuration-list/monster-spell-configuration-list.component';
import { MonsterInnateSpellInfoComponent } from './manage/monster/monster-innate-spell-info/monster-innate-spell-info.component';
import { SingleInnateSpellConfigurationComponent } from './manage/spell/single-innate-spell-configuration/single-innate-spell-configuration.component';
import { MonsterItemsSectionComponent } from './manage/monster/monster-items-section/monster-items-section.component';
import { MonsterItemConfigurationComponent } from './manage/monster/monster-item-configuration/monster-item-configuration.component';
import { MonsterHpCalculationComponent } from './manage/monster/monster-hp-calculation/monster-hp-calculation.component';
import { CharacterCompanionListSectionComponent } from './character/character-playing/character-companions/character-companion-list-section/character-companion-list-section.component';
import { CharacterCompanionSlideInComponent } from './character/character-playing/character-companions/character-companion-slide-in/character-companion-slide-in.component';
import { CharacterCompanionConfigureSlideInComponent } from './character/character-playing/character-companions/character-companion-configure-slide-in/character-companion-configure-slide-in.component';
import { CompanionAbilityScoreConfigurationComponent } from './character/character-playing/character-companions/companion-ability-score-configuration/companion-ability-score-configuration.component';
import { CompanionSkillCardComponent } from './character/character-playing/character-companions/companion-skill-card/companion-skill-card.component';
import { CompanionProfSectionComponent } from './character/character-playing/character-companions/companion-prof-section/companion-prof-section.component';
import { CompanionFeatureSlideInComponent } from './character/character-playing/character-companions/companion-feature-slide-in/companion-feature-slide-in.component';
import { CompanionActionSlideInComponent } from './character/character-playing/character-companions/companion-action-slide-in/companion-action-slide-in.component';
import { CompanionActionCardComponent } from './character/character-playing/character-companions/companion-action-card/companion-action-card.component';
import { CompanionFeatureCardComponent } from './character/character-playing/character-companions/companion-feature-card/companion-feature-card.component';
import {CompanionSpellCardComponent} from './character/character-playing/character-companions/companion-spell-card/companion-spell-card.component';
import { CompanionSpellSlideInComponent } from './character/character-playing/character-companions/companion-spell-slide-in/companion-spell-slide-in.component';
import { CompanionScoreModifierConfigurationComponent } from './character/character-playing/character-companions/companion-score-modifier-configuration/companion-score-modifier-configuration.component';
import { ToolCheckComponent } from './details/item/item-actions/tool-check/tool-check.component';
import { CampaignsListComponent } from './gm-mode/campaigns-list/campaigns-list.component';
import { CampaignInfoComponent } from './gm-mode/campaign-info/campaign-info.component';
import { CampaignInviteComponent } from './gm-mode/campaign-invite/campaign-invite.component';
import { JoinCampaignSlideInComponent } from './character/character-playing/join-campaign-slide-in/join-campaign-slide-in.component';
import {CampaignCharacterSlideInComponent} from './gm-mode/campaign-character-slide-in/campaign-character-slide-in.component';
import { PrintCharacterComponent } from './character/character-playing/print-character/print-character.component';
import { CharacterBoxComponent } from './character/character-playing/print-character/character-box/character-box.component';
import { PrintCharacterProfComponent } from './character/character-playing/print-character/print-character-prof/print-character-prof.component';
import { PrintCharacterCheckboxComponent } from './character/character-playing/print-character/print-character-checkbox/print-character-checkbox.component';
import { PrintCharacterListItemComponent } from './character/character-playing/print-character/print-character-list-item/print-character-list-item.component';
import { PrintCharacterListSpellComponent } from './character/character-playing/print-character/print-character-list-spell/print-character-list-spell.component';
import { PrintCharacterSpellsSectionComponent } from './character/character-playing/print-character/print-character-spells-section/print-character-spells-section.component';
import { ImageSelectorSlideInComponent } from './character/character-playing/image-selector-slide-in/image-selector-slide-in.component';
import { QuickReferencesSlideInComponent } from './character/character-playing/quick-references-slide-in/quick-references-slide-in.component';
import { QuickReferenceItemComponent } from './character/character-playing/quick-references-slide-in/quick-reference-item/quick-reference-item.component';
import {QuickReferenceTableComponent} from './character/character-playing/quick-references-slide-in/quick-reference-table/quick-reference-table.component';
import {ArmorTypeManageComponent} from './manage/armor-type/armor-type-manage/armor-type-manage.component';
import { AlignmentManageComponent } from './manage/alignment/alignment-manage/alignment-manage.component';
import { AreaOfEffectManageComponent } from './manage/area-of-effect/area-of-effect-manage/area-of-effect-manage.component';
import { BackgroundManageComponent } from './manage/background/background-manage/background-manage.component';
import { CasterTypeManageComponent } from './manage/caster-type/caster-type-manage/caster-type-manage.component';
import { ClassManageComponent } from './manage/class/class-manage/class-manage.component';
import { ConditionManageComponent } from './manage/condition/condition-manage/condition-manage.component';
import { DamageTypeManageComponent } from './manage/damage-type/damage-type-manage/damage-type-manage.component';
import { DeityManageComponent } from './manage/deity/deity-manage/deity-manage.component';
import { FeatureManageComponent } from './manage/feature/feature-manage/feature-manage.component';
import { ItemManageComponent } from './manage/item/item-manage/item-manage.component';
import { LanguageManageComponent } from './manage/language/language-manage/language-manage.component';
import { LevelManageComponent } from './manage/level/level-manage/level-manage.component';
import { MonsterManageComponent } from './manage/monster/monster-manage/monster-manage.component';
import { RaceManageComponent } from './manage/race/race-manage/race-manage.component';
import { SkillManageComponent } from './manage/skill/skill-manage/skill-manage.component';
import { SpellManageComponent } from './manage/spell/spell-manage/spell-manage.component';
import { ToolCategoryManageComponent } from './manage/tool-category/tool-category-manage/tool-category-manage.component';
import { WeaponPropertyManageComponent } from './manage/weapon-property/weapon-property-manage/weapon-property-manage.component';
import { DeityCategoryManageComponent } from './manage/deity/deity-category-manage/deity-category-manage.component';
import { AddRemoveAreaOfEffectComponent } from './manage/area-of-effect/add-remove-area-of-effect/add-remove-area-of-effect.component';
import { AreaOfEffectDetailsComponent } from './details/area-of-effect/area-of-effect-details/area-of-effect-details.component';
import { AddRemoveArmorTypeComponent } from './manage/armor-type/add-remove-armor-type/add-remove-armor-type.component';
import { AddRemoveBackgroundComponent } from './manage/background/add-remove-background/add-remove-background.component';
import { AddRemoveCasterTypeComponent } from './manage/caster-type/add-remove-caster-type/add-remove-caster-type.component';
import {AddRemoveConditionComponent} from './manage/condition/add-remove-condition/add-remove-condition.component';
import { AddRemoveDamageTypeComponent } from './manage/damage-type/add-remove-damage-type/add-remove-damage-type.component';
import { DamageTypeDetailsComponent } from './details/damage-type/damage-type-details/damage-type-details.component';
import { AddRemoveDeityComponent } from './manage/deity/add-remove-deity/add-remove-deity.component';
import { AddRemoveDeityCategoryComponent } from './manage/deity/add-remove-deity-category/add-remove-deity-category.component';
import { DeityDetailsComponent } from './details/deity/deity-details/deity-details.component';
import { DeityCategoryDetailsComponent } from './details/deity-category/deity-category-details/deity-category-details.component';
import { AddRemoveWeaponPropertyComponent } from './manage/weapon-property/add-remove-weapon-property/add-remove-weapon-property.component';
import { AddRemoveToolCategoryComponent } from './manage/tool-category/add-remove-tool-category/add-remove-tool-category.component';
import { AddRemoveSkillComponent } from './manage/skill/add-remove-skill/add-remove-skill.component';
import { ToolCategoryDetailsComponent } from './details/tool-category/tool-category-details/tool-category-details.component';
import { AddRemoveLanguageComponent } from './manage/language/add-remove-language/add-remove-language.component';
import { AddRemoveMonsterComponent } from './manage/monster/add-remove-monster/add-remove-monster.component';
import { AddRemoveItemSimpleComponent } from './manage/item/add-remove-item-simple/add-remove-item-simple.component';
import { EncounterSlideInComponent } from './gm-mode/encounter-slide-in/encounter-slide-in.component';
import { EncounterConfigureSlideInComponent } from './gm-mode/encounter-configure-slide-in/encounter-configure-slide-in.component';
import { AddMonstersComponent } from './manage/monster/add-monsters/add-monsters.component';
import { EncounterMonsterGroupConfigureSlideInComponent } from './gm-mode/encounter-monster-group-configure-slide-in/encounter-monster-group-configure-slide-in.component';
import { CampaignSettingsSlideInComponent } from './gm-mode/campaign-settings-slide-in/campaign-settings-slide-in.component';
import { EncounterSummaryComponent } from './gm-mode/encounter-summary/encounter-summary.component';
import { MonsterDetailsSlideInComponent } from './details/monster/monster-details-slide-in/monster-details-slide-in.component';
import { EncounterContextMenuComponent } from './gm-mode/encounter-context-menu/encounter-context-menu.component';
import { EncounterComponent } from './gm-mode/encounter/encounter.component';
import { EncounterMonsterGroupSurpriseSlideInComponent } from './gm-mode/encounter-monster-group-surprise-slide-in/encounter-monster-group-surprise-slide-in.component';
import { EncounterHeaderComponent } from './gm-mode/encounter/encounter-header/encounter-header.component';
import { EncounterInitiativeComponent } from './gm-mode/encounter/encounter-initiative/encounter-initiative.component';
import { EncounterInitiativeSlideInComponent } from './gm-mode/encounter/encounter-initiative-slide-in/encounter-initiative-slide-in.component';
import { EncounterInitiativeCardComponent } from './gm-mode/encounter/encounter-initiative-card/encounter-initiative-card.component';
import { EncounterHealthDetailsSlideInComponent } from './gm-mode/encounter-health-details-slide-in/encounter-health-details-slide-in.component';
import { EncounterColumnComponent } from './gm-mode/encounter-column/encounter-column.component';
import { ReorderInitiativeSlideInComponent } from './gm-mode/reorder-initiative-slide-in/reorder-initiative-slide-in.component';
import { CombatCreatureSpeedTypeSlideInComponent } from './gm-mode/combat-creature-speed-type-slide-in/combat-creature-speed-type-slide-in.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { BattleMonsterFeaturesComponent } from './gm-mode/battle-monster/battle-monster-features/battle-monster-features.component';
import { BattleMonsterActionsComponent } from './gm-mode/battle-monster/battle-monster-actions/battle-monster-actions.component';
import { BattleMonsterCharacteristicsComponent } from './gm-mode/battle-monster/battle-monster-characteristics/battle-monster-characteristics.component';
import { BattleMonsterFeatureCardComponent } from './gm-mode/battle-monster/battle-monster-feature-card/battle-monster-feature-card.component';
import { BattleMonsterFeatureDetailsSlideInComponent } from './gm-mode/battle-monster/battle-monster-feature-details-slide-in/battle-monster-feature-details-slide-in.component';
import { BattleMonsterFeatureDetailsComponent } from './gm-mode/battle-monster/battle-monster-feature-details/battle-monster-feature-details.component';
import { BattleMonsterFeatureLimitedUseSlideInComponent } from './gm-mode/battle-monster/battle-monster-feature-limited-use-slide-in/battle-monster-feature-limited-use-slide-in.component';
import { BattleMonsterFeatureUseRegainComponent } from './gm-mode/battle-monster/battle-monster-feature-use-regain/battle-monster-feature-use-regain.component';
import { BattleMonsterBasicComponent } from './gm-mode/battle-monster/battle-monster-basic/battle-monster-basic.component';
import { BattleMonsterActionCardComponent } from './gm-mode/battle-monster/battle-monster-action-card/battle-monster-action-card.component';
import { BattleMonsterActionDetailsSlideInComponent } from './gm-mode/battle-monster/battle-monster-action-details-slide-in/battle-monster-action-details-slide-in.component';
import { BattleMonsterActionLimitedUseSlideInComponent } from './gm-mode/battle-monster/battle-monster-action-limited-use-slide-in/battle-monster-action-limited-use-slide-in.component';
import { BattleMonsterActionDetailsComponent } from './gm-mode/battle-monster/battle-monster-action-details/battle-monster-action-details.component';
import { BattleMonsterActionUseRegainComponent } from './gm-mode/battle-monster/battle-monster-action-use-regain/battle-monster-action-use-regain.component';
import { BattleMonsterLegendaryPointsSlideInComponent } from './gm-mode/battle-monster/battle-monster-legendary-points-slide-in/battle-monster-legendary-points-slide-in.component';
import { CreatureSpellLimitedUseSlideInComponent } from './character/character-playing/creature-spell-limited-use-slide-in/creature-spell-limited-use-slide-in.component';
import * as Hammer from 'hammerjs';
import {HAMMER_GESTURE_CONFIG, HammerGestureConfig} from '@angular/platform-browser';

export class HammerConfig extends HammerGestureConfig {
  overrides = <any> {
    swipe: { direction: Hammer.DIRECTION_HORIZONTAL, threshold: 200 },
    pan: { direction: Hammer.DIRECTION_HORIZONTAL, threshold: 200 }
  };
}

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        FormsModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatSelectModule,
        MatMenuModule,
        MatSliderModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatCheckboxModule,
        MatDividerModule,
        MatRadioModule,
        MatCardModule,
        MatProgressBarModule,
        MatExpansionModule,
        MatInputModule,
        MatIconModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatTooltipModule,
        ScrollingModule,
        routing,
        DragDropModule,
        ColorSketchModule,
        MatSidenavModule,
        HeaderModule,
        NgxMatSelectSearchModule,
        MatSlideToggleModule
    ],
  declarations: [
    CharacterEditComponent,
    CharacterPlayingComponent,
    CharacterSlideInComponent,
    CharactersListComponent,
    DashboardComponent,
    DefaultDetailsComponent,
    DefaultPageComponent,
    ArmorTypeInfoComponent,
    ArmorTypeListComponent,
    BackgroundInfoComponent,
    BackgroundListComponent,
    BackgroundTraitListComponent,
    CasterTypeInfoComponent,
    CasterTypeListComponent,
    ClassInfoComponent,
    ClassListComponent,
    ConditionInfoComponent,
    ConditionListComponent,
    DamageTypeInfoComponent,
    DamageTypeListComponent,
    DamageModifierConfigurationsComponent,
    FeatureInfoComponent,
    FeatureListComponent,
    ItemInfoComponent,
    ItemListComponent,
    LanguageInfoComponent,
    LanguageListComponent,
    RaceInfoComponent,
    RaceListComponent,
    SkillInfoComponent,
    SkillListComponent,
    SpellInfoComponent,
    SpellListComponent,
    AddSpellsComponent,
    SpellConfigurationComponent,
    SingleSpellConfigurationComponent,
    SpellConfigurationListComponent,
    WeaponPropertyInfoComponent,
    WeaponPropertyListComponent,
    ViewEditComponent,
    AbilityScoreIncreasesComponent,
    WeaponInfoComponent,
    ArmorInfoComponent,
    GearInfoComponent,
    ToolInfoComponent,
    AmmoInfoComponent,
    MountInfoComponent,
    TreasureInfoComponent,
    PackInfoComponent,
    MagicalItemInfoComponent,
    ConnectingConditionsConfigurationComponent,
    AlignmentInfoComponent,
    AlignmentListComponent,
    AreaOfEffectInfoComponent,
    AreaOfEffectListComponent,
    DeityInfoComponent,
    DeityListComponent,
    DeityCategoryInfoComponent,
    DeityCategoryListComponent,
    LevelInfoComponent,
    LevelListComponent,
    ToolCategoryInfoComponent,
    ToolCategoryListComponent,
    CreatureConditionImmunityConfigurationsComponent,
    CreatureDamageModifierConfigurationsComponent,
    CreatureSenseConfigurationsComponent,
    CharacterEditAbilitiesComponent,
    CharacterEditAbilityComponent,
    CharacterEditBasicInfoComponent,
    CharacterEditChosenClassComponent,
    CharacterEditBackgroundComponent,
    CharacterEditCharacteristicsComponent,
    CharacterEditHealthComponent,
    CharacterEditHealthClassComponent,
    CharacterEditHealthClassLevelComponent,
    CharacterEditHealthHitDiceComponent,
    CharacterEditBackgroundTraitChoiceCategoryComponent,
    CreatureAbilitiesComponent,
    CharacterCharacteristicsComponent,
    CharacterCompanionsComponent,
    CreatureConditionsComponent,
    CreatureDamageModifiersComponent,
    CreatureEquipmentComponent,
    CreatureEquipmentGroupComponent,
    CharacterFeaturesComponent,
    CharacterNotesComponent,
    CreatureProficienciesComponent,
    CreatureSkillsComponent,
    CreatureSpellsComponent,
    CharacterPageOrderComponent,
    ConditionDetailsSlideInComponent,
    ConditionConfigurationComponent,
    SkillDetailsSlideInComponent,
    SkillConfigurationDetailsComponent,
    AbilitySaveConfigurationDetailsComponent,
    AbilitySaveDetailsComponent,
    AbilityScoreConfigurationDetailsComponent,
    AbilityScoreDetailsComponent,
    RollLogComponent,
    CharacterSettingsComponent,
    DamageModifierConfigurationDetailsComponent,
    DamageModifierDetailsComponent,
    NoteConfigurationDetailsComponent,
    SelectionListSlideInComponent,
    FeatureDetailsComponent,
    FeaturesSelectionListComponent,
    AddRemoveFeatureComponent,
    FeatureDetailsSlideInComponent,
    SpellDetailsComponent,
    SpellDetailsSlideInComponent,
    SpellSelectionListComponent,
    AddRemoveSpellComponent,
    CharacterSpellsDisplayComponent,
    CreatureSpellsCombinedDisplayComponent,
    SpellModifierConfigurationComponent,
    SpellAbilityConfigurationComponent,
    CreatureSpellSlotsComponent,
    CreatureSpellSlotsSlideInComponent,
    CreatureSpellSlotsConfigurationComponent,
    CreatureSpellSlotUseRegainComponent,
    CreatureSpellSlotConfigureComponent,
    CharacterSpellInfoSlideInComponent,
    CharacterSpellInfoSingleCharacteristicComponent,
    SpellTaggingConfigurationSlideInComponent,
    SpellTaggingConfigurationComponent,
    TagColorConfigurationSlideInComponent,
    PowerTaggingConfigurationSlideInComponent,
    ClassSpellInfoComponent,
    FeatureTaggingConfigurationSlideInComponent,
    FeatureTaggingConfigurationComponent,
    CharacterFeatureInfoSlideInComponent,
    CharacterFeatureUseRegainComponent,
    CreatureAbilityCardComponent,
    CreatureAbilitySaveCardComponent,
    CreatureSkillCardComponent,
    AcDetailsComponent,
    AcConfigurationComponent,
    CarryingDetailsComponent,
    CarryingConfigurationComponent,
    SingleCarryingDetailComponent,
    HealthDetailsComponent,
    HealthConfigurationDetailsComponent,
    HealthClassComponent,
    HealthClassLevelComponent,
    HealthClassHitDiceComponent,
    InitiativeDetailsComponent,
    InitiativeConfigurationComponent,
    LevelDetailsComponent,
    ProficiencyBonusDetailsComponent,
    ProficiencyBonusConfigurationComponent,
    SpeedDetailsComponent,
    SpeedConfigurationComponent,
    SingleSpeedDetailsComponent,
    CharacterBasicComponent,
    ConcentrationCheckSlideInComponent,
    ConcentrationCheckConfigurationSlideInComponent,
    ResurrectionDetailsComponent,
    ShortRestDetailsComponent,
    LongRestDetailsComponent,
    ValidateCharacterComponent,
    ValidateCharacterConfigurationComponent,
    AbilityScoreIncreaseConfigurationComponent,
    AbilityScoreIncreaseConfigurationSingleScoreComponent,
    FeatSelectionComponent,
    FeatureSelectionItemsComponent,
    CreatureWealthComponent,
    CreatureWealthConfigurationComponent,
    CreatureWealthConvertComponent,
    ItemDetailsSlideInComponent,
    WeaponDetailsComponent,
    ArmorDetailsComponent,
    GearDetailsComponent,
    ToolDetailsComponent,
    AmmoDetailsComponent,
    MountDetailsComponent,
    TreasureDetailsComponent,
    PackDetailsComponent,
    MagicalItemDetailsComponent,
    AddRemoveItemComponent,
    AddRemoveSlideInComponent,
    ItemDetailsComponent,
    BasicItemDetailsComponent,
    CommonActionComponent,
    CostDetailsComponent,
    EquipComponent,
    GainComponent,
    SellComponent,
    ShoppingCartSlideInComponent,
    ShoppingCartCartPageComponent,
    ShoppingCartCheckoutPageComponent,
    VehicleDetailsComponent,
    VehicleInfoComponent,
    CharacterEquipmentSettingsComponent,
    StartingEquipmentComponent,
    StartingEquipmentSelectionGroupComponent,
    StartingEquipmentFilterSelectionComponent,
    CharacterActionsComponent,
    ActionsSlideInComponent,
    ActionSlideInComponent,
    FavoriteActionsSlideInComponent,
    CharacterPlayingColumnComponent,
    FeatureConfigurationComponent,
    CharacteristicFeaturesSectionComponent,
    CharacteristicFeatureCardComponent,
    AddItemsComponent,
    SpellSelectionItemsComponent,
    AttackActionComponent,
    SubclassListComponent,
    SubRaceListComponent,
    CharacteristicSpellcastingModifierComponent,
    ImportsComponent,
    ImportItemComponent,
    CompareImportComponent,
    ArmorTypeDetailsComponent,
    CasterTypeDetailsComponent,
    LanguageDetailsComponent,
    WeaponPropertyDetailsComponent,
    ConditionDetailsComponent,
    SkillDetailsComponent,
    BackgroundDetailsComponent,
    CharacterClassDetailsComponent,
    RaceDetailsComponent,
    PlayerCharacterDetailsComponent,
    MonsterDetailsComponent,
    SubBackgroundListComponent,
    ImportCategoryComponent,
    LinkImportComponent,
    CharacteristicDetailsComponent,
    MagicalItemSpellConfigurationComponent,
    MagicalItemApplicableItemConfigurationComponent,
    MagicalItemTypeSelectionComponent,
    CreatureEquipmentChargesComponent,
    CharacterEquipmentAttunementComponent,
    ChargesComponent,
    SpellsComponent,
    MagicalItemDamageConfigurationComponent,
    MagicalItemSpellsComponent,
    MagicalItemApplicableSpellConfigurationComponent,
    MagicalItemSpellSelectionComponent,
    AddClassesComponent,
    AddRemoveClassComponent,
    MagicalItemAttunementClassConfigurationComponent,
    MagicalItemSpellSlideInComponent,
    MagicalItemTableConfigurationComponent,
    MagicalItemTableCellConfigurationComponent,
    AddAlignmentsComponent,
    AddRemoveAlignmentComponent,
    MagicalItemAttunementAlignmentConfigurationComponent,
    AlignmentDetailsComponent,
    AddRacesComponent,
    AddRemoveRaceComponent,
    MagicalItemAttunementRaceConfigurationComponent,
    MonsterListComponent,
    MonsterInfoComponent,
    MonsterActionSectionComponent,
    MonsterFeatureSectionComponent,
    MonsterFeatureCardComponent,
    MonsterActionCardComponent,
    MonsterActionConfigurationComponent,
    MonsterFeatureConfigurationComponent,
    MonsterSpellInfoComponent,
    MonsterSpellConfigurationListComponent,
    MonsterInnateSpellInfoComponent,
    SingleInnateSpellConfigurationComponent,
    MonsterItemsSectionComponent,
    MonsterItemConfigurationComponent,
    MonsterHpCalculationComponent,
    CharacterCompanionListSectionComponent,
    CharacterCompanionSlideInComponent,
    CharacterCompanionConfigureSlideInComponent,
    CompanionAbilityScoreConfigurationComponent,
    CompanionSkillCardComponent,
    CompanionProfSectionComponent,
    CompanionFeatureSlideInComponent,
    CompanionActionSlideInComponent,
    CompanionActionCardComponent,
    CompanionFeatureCardComponent,
    CompanionSpellCardComponent,
    CompanionSpellSlideInComponent,
    CompanionScoreModifierConfigurationComponent,
    ToolCheckComponent,
    CampaignsListComponent,
    CampaignInfoComponent,
    CampaignInviteComponent,
    JoinCampaignSlideInComponent,
    CampaignCharacterSlideInComponent,
    PrintCharacterComponent,
    CharacterBoxComponent,
    PrintCharacterProfComponent,
    PrintCharacterCheckboxComponent,
    PrintCharacterListItemComponent,
    PrintCharacterListSpellComponent,
    PrintCharacterSpellsSectionComponent,
    ImageSelectorSlideInComponent,
    QuickReferencesSlideInComponent,
    QuickReferenceItemComponent,
    QuickReferenceTableComponent,
    ArmorTypeManageComponent,
    AlignmentManageComponent,
    AreaOfEffectManageComponent,
    BackgroundManageComponent,
    CasterTypeManageComponent,
    ClassManageComponent,
    ConditionManageComponent,
    DamageTypeManageComponent,
    DeityManageComponent,
    FeatureManageComponent,
    ItemManageComponent,
    LanguageManageComponent,
    LevelManageComponent,
    MonsterManageComponent,
    RaceManageComponent,
    SkillManageComponent,
    SpellManageComponent,
    ToolCategoryManageComponent,
    WeaponPropertyManageComponent,
    DeityCategoryManageComponent,
    AddRemoveAreaOfEffectComponent,
    AreaOfEffectDetailsComponent,
    AddRemoveArmorTypeComponent,
    AddRemoveBackgroundComponent,
    AddRemoveCasterTypeComponent,
    AddRemoveConditionComponent,
    AddRemoveDamageTypeComponent,
    DamageTypeDetailsComponent,
    AddRemoveDeityComponent,
    AddRemoveDeityCategoryComponent,
    DeityDetailsComponent,
    DeityCategoryDetailsComponent,
    AddRemoveWeaponPropertyComponent,
    AddRemoveToolCategoryComponent,
    AddRemoveSkillComponent,
    ToolCategoryDetailsComponent,
    AddRemoveLanguageComponent,
    AddRemoveMonsterComponent,
    AddRemoveItemSimpleComponent,
    EncounterSlideInComponent,
    EncounterConfigureSlideInComponent,
    AddMonstersComponent,
    EncounterMonsterGroupConfigureSlideInComponent,
    CampaignSettingsSlideInComponent,
    EncounterSummaryComponent,
    MonsterDetailsSlideInComponent,
    EncounterContextMenuComponent,
    EncounterComponent,
    EncounterMonsterGroupSurpriseSlideInComponent,
    EncounterHeaderComponent,
    EncounterInitiativeComponent,
    EncounterInitiativeSlideInComponent,
    EncounterInitiativeCardComponent,
    EncounterHealthDetailsSlideInComponent,
    EncounterColumnComponent,
    ReorderInitiativeSlideInComponent,
    CombatCreatureSpeedTypeSlideInComponent,
    BattleMonsterFeaturesComponent,
    BattleMonsterActionsComponent,
    BattleMonsterCharacteristicsComponent,
    BattleMonsterFeatureCardComponent,
    BattleMonsterFeatureDetailsSlideInComponent,
    BattleMonsterFeatureDetailsComponent,
    BattleMonsterFeatureLimitedUseSlideInComponent,
    BattleMonsterFeatureUseRegainComponent,
    BattleMonsterBasicComponent,
    BattleMonsterActionCardComponent,
    BattleMonsterActionDetailsSlideInComponent,
    BattleMonsterActionLimitedUseSlideInComponent,
    BattleMonsterActionDetailsComponent,
    BattleMonsterActionUseRegainComponent,
    BattleMonsterLegendaryPointsSlideInComponent,
    CreatureSpellLimitedUseSlideInComponent
  ],
  exports: [],
  providers: [{
    provide: HAMMER_GESTURE_CONFIG,
    useClass: HammerConfig,
  }]
})
export class DashboardModule {
}
