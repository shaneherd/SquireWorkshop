import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {MenuItemComponent} from './components/menu-item/menu-item.component';
import {TranslateModule} from '@ngx-translate/core';
import {NgxLocalizedNumbers} from 'ngx-localized-numbers';
import {UserMenuComponent} from './components/user-menu/user-menu.component';
import {AngularSvgIconModule} from 'angular-svg-icon';
import {SlideInHeaderComponent} from './components/slide-in-header/slide-in-header.component';
import {SlideInComponent} from './components/slide-in/slide-in.component';
import {ContextMenuComponent} from './components/context-menu/context-menu.component';
import {CharacterContextMenuComponent} from './components/character-context-menu/character-context-menu.component';
import {ListMenuComponent} from './components/list-menu/list-menu.component';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {
  MatButtonToggleModule,
  MatCheckboxModule,
  MatExpansionModule,
  MatIconModule,
  MatInputModule,
  MatProgressBarModule,
  MatSelectModule,
  MatTooltipModule
} from '@angular/material';
import {ProficiencyListComponent} from './components/proficiency-list/proficiency-list.component';
import {ProficiencyPanelsComponent} from './components/proficiency-panels/proficiency-panels.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ModifierListComponent} from './components/modifier-list/modifier-list.component';
import {DiceCollectionComponent} from './components/dice-collection/dice-collection.component';
import {InputNumberDirective} from './directives/input-number.directive';
import {DropDownComponent} from './components/drop-down/drop-down.component';
import {DamageRowComponent} from './components/damage-row/damage-row.component';
import {DamageConfigurationComponent} from './components/damage-configuration/damage-configuration.component';
import {PowerModifierConfigurationComponent} from './components/power-modifier-configuration/power-modifier-configuration.component';
import {PowerModifierConfigurationSectionComponent} from './components/power-modifier-configuration-section/power-modifier-configuration-section.component';
import {PowerDamageConfigurationSectionComponent} from './components/power-damage-configuration-section/power-damage-configuration-section.component';
import {CostConfigurationComponent} from './components/cost-configuration/cost-configuration.component';
import {WeightConfigurationComponent} from './components/weight-configuration/weight-configuration.component';
import {IsContainerConfigurationComponent} from './components/is-container-configuration/is-container-configuration.component';
import {IsEquippableConfigurationComponent} from './components/is-equippable-configuration/is-equippable-configuration.component';
import {IsExpendableConfigurationComponent} from './components/is-expendable-configuration/is-expendable-configuration.component';
import {DescriptionConfigurationComponent} from './components/description-configuration/description-configuration.component';
import {DamageConfigurationDisplayComponent} from './components/damage-configuration-display/damage-configuration-display.component';
import {DamageConfigurationSectionComponent} from './components/damage-configuration-section/damage-configuration-section.component';
import {AreaOfEffectSelectionComponent} from './components/area-of-effect-selection/area-of-effect-selection.component';
import {ConditionImmunityConfigurationsComponent} from './components/condition-immunity-configurations/condition-immunity-configurations.component';
import {SensesConfigurationComponent} from './components/senses-configuration/senses-configuration.component';
import {StartingEquipmentConfigurationComponent} from './components/starting-equipment-configuration/starting-equipment-configuration.component';
import {StartingEquipmentConfigurationSectionComponent} from './components/starting-equipment-configuration-section/starting-equipment-configuration-section.component';
import {StartingEquipmentConfigurationRowComponent} from './components/starting-equipment-configuration-row/starting-equipment-configuration-row.component';
import {StartingEquipmentConfigurationGroupRowComponent} from './components/starting-equipment-configuration-group-row/starting-equipment-configuration-group-row.component';
import {StartingEquipmentGroupComponent} from './components/starting-equipment-group/starting-equipment-group.component';
import {NgxMatSelectSearchModule} from 'ngx-mat-select-search';
import {LimitedUseConfigurationComponent} from './components/limited-use-configuration/limited-use-configuration.component';
import {SingleLimitedUseRowComponent} from './components/single-limited-use-row/single-limited-use-row.component';
import {RollInputComponent} from './components/roll-input/roll-input.component';
import {CreatureProficiencyListComponent} from './components/creature-proficiency-list/creature-proficiency-list.component';
import {CreatureProficiencyComponent} from './components/creature-proficiency/creature-proficiency.component';
import {CreatureChoicePromptComponent} from './components/creature-choice-prompt/creature-choice-prompt.component';
import {CreatureChoiceListComponent} from './components/creature-choice-list/creature-choice-list.component';
import {CreatureChoiceQuantityComponent} from './components/creature-choice-quantity/creature-choice-quantity.component';
import {ProficiencyConfigurationComponent} from './components/proficiency-configuration/proficiency-configuration.component';
import {AdvantageConfigurationComponent} from './components/advantage-configuration/advantage-configuration.component';
import {AdvantageDisplayComponent} from './components/advantage-display/advantage-display.component';
import {ProficiencyDisplayComponent} from './components/proficiency-display/proficiency-display.component';
import {CriticalDisplayComponent} from './components/critical-display/critical-display.component';
import {PowerDamageDisplayComponent} from './components/power-damage-display/power-damage-display.component';
import {PowerModifierDisplayComponent} from './components/power-modifier-display/power-modifier-display.component';
import {SpellCardComponent} from './components/spell-card/spell-card.component';
import {MatCardModule} from '@angular/material/card';
import {FilteringSortingComponent} from './components/filtering-sorting/filtering-sorting.component';
import {TagComponent} from './components/tag/tag.component';
import {TagColorConfigurationComponent} from './components/tag-color-configuration/tag-color-configuration.component';
import {TagDetailsComponent} from './components/tag-details/tag-details.component';
import {TagDetailComponent} from './components/tag-detail/tag-detail.component';
import {FeatureCardComponent} from './components/feature-card/feature-card.component';
import {HitDiceUseDisplayComponent} from './components/hit-dice-use-display/hit-dice-use-display.component';
import {HitDiceUseDisplayRollResultComponent} from './components/hit-dice-use-display-roll-result/hit-dice-use-display-roll-result.component';
import {DeathSaveResultsComponent} from './components/death-save-results/death-save-results.component';
import {CalculatorButtonComponent} from './components/calculator-button/calculator-button.component';
import {HealthSettingsComponent} from './components/settings/health-settings/health-settings.component';
import { EquipmentSettingsComponent } from './components/settings/equipment-settings/equipment-settings.component';
import { SpellcastingSettingsComponent } from './components/settings/spellcasting-settings/spellcasting-settings.component';
import { SpeedSettingsComponent } from './components/settings/speed-settings/speed-settings.component';
import { SpeedSettingComponent } from './components/settings/speed-setting/speed-setting.component';
import { SettingComponent } from './components/settings/setting/setting.component';
import { FeatureSettingsComponent } from './components/settings/feature-settings/feature-settings.component';
import { SkillSettingsComponent } from './components/settings/skill-settings/skill-settings.component';
import {CharacterValidationSettingsComponent} from './components/settings/character-validation-settings/character-validation-settings.component';
import { CreatureWealthItemComponent } from './components/creature-wealth-item/creature-wealth-item.component';
import { CreatureItemCardComponent } from './components/creature-item-card/creature-item-card.component';
import { CreatureWealthCardComponent } from './components/creature-wealth-card/creature-wealth-card.component';
import { CardBadgesComponent } from './components/card-badges/card-badges.component';
import {MatDividerModule} from '@angular/material/divider';
import { CardBadgeComponent } from './components/card-badge/card-badge.component';
import { CreatureListItemComponent } from './components/creature-list-item/creature-list-item.component';
import { QuantityTagComponent } from './components/tags/quantity-tag/quantity-tag.component';
import { AdjustmentCardComponent } from './components/adjustment-card/adjustment-card.component';
import { QuantityDisplayComponent } from './components/displays/quantity-display/quantity-display.component';
import { TypeDisplayComponent } from './components/displays/type-display/type-display.component';
import { ContainerDisplayComponent } from './components/displays/container-display/container-display.component';
import { EquippableDisplayComponent } from './components/displays/equippable-display/equippable-display.component';
import { CostDisplayComponent } from './components/displays/cost-display/cost-display.component';
import {WeightDisplayComponent} from './components/displays/weight-display/weight-display.component';
import { ExpendableDisplayComponent } from './components/displays/expendable-display/expendable-display.component';
import {DescriptionDisplayComponent} from './components/displays/description-display/description-display.component';
import { ItemTypeDisplayComponent } from './components/displays/item-type-display/item-type-display.component';
import { SpeedDisplayComponent } from './components/displays/speed-display/speed-display.component';
import { CarryingCapacityDisplayComponent } from './components/displays/carrying-capacity-display/carrying-capacity-display.component';
import { ItemProficiencyDisplayComponent } from './components/displays/item-proficiency-display/item-proficiency-display.component';
import { PropertiesDisplayComponent } from './components/displays/properties-display/properties-display.component';
import { AttunedTagComponent } from './components/tags/attuned-tag/attuned-tag.component';
import { SilveredTagComponent } from './components/tags/silvered-tag/silvered-tag.component';
import { PoisonedTagComponent } from './components/tags/poisoned-tag/poisoned-tag.component';
import {CursedTagComponent} from './components/tags/cursed-tag/cursed-tag.component';
import { AttackDamageDisplayComponent } from './components/displays/attack-damage-display/attack-damage-display.component';
import { WeaponPropertiesDisplayComponent } from './components/displays/weapon-properties-display/weapon-properties-display.component';
import { BasicDisplayComponent } from './components/displays/basic-display/basic-display.component';
import { AcDisplayComponent } from './components/displays/ac-display/ac-display.component';
import { SplitButtonComponent } from './components/button/split-button/split-button.component';
import { ButtonActionComponent } from './components/button/button-action/button-action.component';
import { ButtonActionGroupComponent } from './components/button/button-action-group/button-action-group.component';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import { ButtonComponent } from './components/button/squire-button/button.component';
import { SliderInputComponent } from './components/slider-input/slider-input.component';
import {MatSliderModule} from '@angular/material/slider';
import { AdjustmentCardRowComponent } from './components/adjustment-card-row/adjustment-card-row.component';
import { PagerComponent } from './components/pager/pager.component';
import { StartingEquipmentOptionComponent } from './components/starting-equipment-option/starting-equipment-option.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import { DetailsComponent } from './components/details/details.component';
import { MiscSettingsComponent } from './components/settings/misc-settings/misc-settings.component';
import { SpellcastingSettingsSlideInComponent } from './components/settings/spellcasting-settings-slide-in/spellcasting-settings-slide-in.component';
import { FeatureSettingsSlideInComponent } from './components/settings/feature-settings-slide-in/feature-settings-slide-in.component';
import { QuickActionSettingsSlideInComponent } from './components/settings/quick-action-settings-slide-in/quick-action-settings-slide-in.component';
import { SkillSettingsSlideInComponent } from './components/settings/skill-settings-slide-in/skill-settings-slide-in.component';
import { QuickActionSettingsComponent } from './components/settings/quick-action-settings/quick-action-settings.component';
import { TieredProgressBarComponent } from './components/tiered-progress-bar/tiered-progress-bar.component';
import { LabelValueComponent } from './components/label-value/label-value.component';
import { TagBarComponent } from './components/tag-bar/tag-bar.component';
import { MagicalItemSpellCardComponent } from './components/magical-item-spell-card/magical-item-spell-card.component';
import { CreatureListSpellComponent } from './components/creature-list-spell/creature-list-spell.component';
import { MagicItemTableComponent } from './components/magic-item-table/magic-item-table.component';
import {MatTableModule} from '@angular/material/table';
import { PublicContextMenuComponent } from './components/public-context-menu/public-context-menu.component';
import { MyStuffContextMenuComponent } from './components/my-stuff-context-menu/my-stuff-context-menu.component';
import { ShareConfigurationComponent } from './components/share-configuration/share-configuration.component';
import { SharedWithMeContextMenuComponent } from './components/shared-with-me-context-menu/shared-with-me-context-menu.component';
import { ProficiencyListDisplayComponent } from './components/proficiency-list-display/proficiency-list-display.component';
import { MonsterSearchComponent } from './components/monster-search/monster-search.component';
import { SearchableListComponent } from './components/searchable-list/searchable-list.component';
import { HealthCalculatorComponent } from './components/health-calculator/health-calculator.component';
import { ManageListComponent } from './components/manage-list/manage-list.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    ScrollingModule,
    MatProgressBarModule,
    MatExpansionModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatCardModule,
    MatDividerModule,
    MatInputModule,
    MatIconModule,
    MatTooltipModule,
    MatSelectModule,
    MatSliderModule,
    MatTableModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMatSelectSearchModule,
    MatSidenavModule
  ],
  declarations: [
    MenuItemComponent,
    UserMenuComponent,
    SlideInHeaderComponent,
    SlideInComponent,
    DetailsComponent,
    ContextMenuComponent,
    CharacterContextMenuComponent,
    ListMenuComponent,
    ProficiencyListComponent,
    ProficiencyPanelsComponent,
    ModifierListComponent,
    DiceCollectionComponent,
    InputNumberDirective,
    DropDownComponent,
    DamageRowComponent,
    DamageConfigurationComponent,
    PowerModifierConfigurationComponent,
    PowerModifierConfigurationSectionComponent,
    PowerDamageConfigurationSectionComponent,
    CostConfigurationComponent,
    WeightConfigurationComponent,
    IsContainerConfigurationComponent,
    IsEquippableConfigurationComponent,
    IsExpendableConfigurationComponent,
    DescriptionConfigurationComponent,
    DamageConfigurationDisplayComponent,
    DamageConfigurationSectionComponent,
    AreaOfEffectSelectionComponent,
    ConditionImmunityConfigurationsComponent,
    SensesConfigurationComponent,
    StartingEquipmentConfigurationComponent,
    StartingEquipmentConfigurationSectionComponent,
    StartingEquipmentConfigurationRowComponent,
    StartingEquipmentConfigurationGroupRowComponent,
    StartingEquipmentGroupComponent,
    LimitedUseConfigurationComponent,
    SingleLimitedUseRowComponent,
    RollInputComponent,
    CreatureProficiencyListComponent,
    CreatureProficiencyComponent,
    CreatureChoicePromptComponent,
    CreatureChoiceListComponent,
    CreatureChoiceQuantityComponent,
    ProficiencyConfigurationComponent,
    ProficiencyDisplayComponent,
    AdvantageConfigurationComponent,
    AdvantageDisplayComponent,
    CriticalDisplayComponent,
    PowerDamageDisplayComponent,
    PowerModifierDisplayComponent,
    SpellCardComponent,
    FilteringSortingComponent,
    TagComponent,
    TagColorConfigurationComponent,
    TagDetailsComponent,
    TagDetailComponent,
    FeatureCardComponent,
    HitDiceUseDisplayComponent,
    HitDiceUseDisplayRollResultComponent,
    DeathSaveResultsComponent,
    CalculatorButtonComponent,
    HealthSettingsComponent,
    EquipmentSettingsComponent,
    SpellcastingSettingsComponent,
    SpeedSettingsComponent,
    SpeedSettingComponent,
    SettingComponent,
    FeatureSettingsComponent,
    SkillSettingsComponent,
    CharacterValidationSettingsComponent,
    CreatureWealthItemComponent,
    CreatureItemCardComponent,
    CreatureWealthCardComponent,
    CardBadgesComponent,
    CardBadgeComponent,
    CreatureListItemComponent,
    QuantityTagComponent,
    AdjustmentCardComponent,
    QuantityDisplayComponent,
    TypeDisplayComponent,
    ContainerDisplayComponent,
    EquippableDisplayComponent,
    CostDisplayComponent,
    WeightDisplayComponent,
    ExpendableDisplayComponent,
    DescriptionDisplayComponent,
    ItemTypeDisplayComponent,
    SpeedDisplayComponent,
    CarryingCapacityDisplayComponent,
    ItemProficiencyDisplayComponent,
    PropertiesDisplayComponent,
    AttunedTagComponent,
    SilveredTagComponent,
    PoisonedTagComponent,
    CursedTagComponent,
    AttackDamageDisplayComponent,
    WeaponPropertiesDisplayComponent,
    BasicDisplayComponent,
    AcDisplayComponent,
    SplitButtonComponent,
    ButtonActionComponent,
    ButtonActionGroupComponent,
    ButtonComponent,
    SliderInputComponent,
    AdjustmentCardRowComponent,
    PagerComponent,
    StartingEquipmentOptionComponent,
    MiscSettingsComponent,
    SpellcastingSettingsSlideInComponent,
    FeatureSettingsSlideInComponent,
    QuickActionSettingsSlideInComponent,
    SkillSettingsSlideInComponent,
    QuickActionSettingsComponent,
    TieredProgressBarComponent,
    LabelValueComponent,
    TagBarComponent,
    MagicalItemSpellCardComponent,
    CreatureListSpellComponent,
    MagicItemTableComponent,
    TagBarComponent,
    PublicContextMenuComponent,
    MyStuffContextMenuComponent,
    ShareConfigurationComponent,
    SharedWithMeContextMenuComponent,
    ProficiencyListDisplayComponent,
    MonsterSearchComponent,
    SearchableListComponent,
    HealthCalculatorComponent,
    ManageListComponent
  ],
    exports: [
        ContextMenuComponent,
        PublicContextMenuComponent,
        MyStuffContextMenuComponent,
        MenuItemComponent,
        UserMenuComponent,
        TranslateModule,
        AngularSvgIconModule,
        NgxLocalizedNumbers,
        SlideInHeaderComponent,
        SlideInComponent,
        DetailsComponent,
        CharacterContextMenuComponent,
        ListMenuComponent,
        ProficiencyListComponent,
        ProficiencyListDisplayComponent,
        ProficiencyPanelsComponent,
        ModifierListComponent,
        DiceCollectionComponent,
        InputNumberDirective,
        DropDownComponent,
        DamageConfigurationComponent,
        PowerDamageConfigurationSectionComponent,
        PowerModifierConfigurationComponent,
        PowerModifierConfigurationSectionComponent,
        IsExpendableConfigurationComponent,
        IsEquippableConfigurationComponent,
        IsContainerConfigurationComponent,
        CostConfigurationComponent,
        WeightConfigurationComponent,
        DescriptionConfigurationComponent,
        DamageConfigurationDisplayComponent,
        DamageConfigurationSectionComponent,
        AreaOfEffectSelectionComponent,
        SensesConfigurationComponent,
        ConditionImmunityConfigurationsComponent,
        StartingEquipmentConfigurationComponent,
        StartingEquipmentConfigurationRowComponent,
        StartingEquipmentConfigurationGroupRowComponent,
        StartingEquipmentConfigurationSectionComponent,
        LimitedUseConfigurationComponent,
        SingleLimitedUseRowComponent,
        RollInputComponent,
        CreatureProficiencyListComponent,
        CreatureProficiencyComponent,
        CreatureChoicePromptComponent,
        CreatureChoiceListComponent,
        CreatureChoiceQuantityComponent,
        ProficiencyConfigurationComponent,
        ProficiencyDisplayComponent,
        AdvantageConfigurationComponent,
        AdvantageDisplayComponent,
        CriticalDisplayComponent,
        PowerDamageDisplayComponent,
        PowerModifierDisplayComponent,
        SpellCardComponent,
        FeatureCardComponent,
        FilteringSortingComponent,
        TagComponent,
        TagColorConfigurationComponent,
        TagDetailsComponent,
        TagDetailComponent,
        FeatureCardComponent,
        HitDiceUseDisplayComponent,
        DeathSaveResultsComponent,
        CalculatorButtonComponent,
        HealthSettingsComponent,
        EquipmentSettingsComponent,
        SpeedSettingsComponent,
        SpeedSettingComponent,
        SettingComponent,
        SpellcastingSettingsComponent,
        FeatureSettingsComponent,
        SkillSettingsComponent,
        CharacterValidationSettingsComponent,
        CreatureWealthItemComponent,
        CreatureItemCardComponent,
        CreatureListItemComponent,
        CreatureWealthCardComponent,
        QuantityTagComponent,
        AdjustmentCardComponent,
        QuantityDisplayComponent,
        TypeDisplayComponent,
        ContainerDisplayComponent,
        CostDisplayComponent,
        EquippableDisplayComponent,
        WeightDisplayComponent,
        ExpendableDisplayComponent,
        DescriptionDisplayComponent,
        ItemTypeDisplayComponent,
        SpeedDisplayComponent,
        CarryingCapacityDisplayComponent,
        ItemProficiencyDisplayComponent,
        PropertiesDisplayComponent,
        AttackDamageDisplayComponent,
        WeaponPropertiesDisplayComponent,
        BasicDisplayComponent,
        AcDisplayComponent,
        SplitButtonComponent,
        ButtonComponent,
        SliderInputComponent,
        AdjustmentCardRowComponent,
        PagerComponent,
        MiscSettingsComponent,
        SpellcastingSettingsSlideInComponent,
        FeatureSettingsSlideInComponent,
        QuickActionSettingsComponent,
        QuickActionSettingsSlideInComponent,
        SkillSettingsSlideInComponent,
        TieredProgressBarComponent,
        LabelValueComponent,
        TagBarComponent,
        ShareConfigurationComponent,
        MagicalItemSpellCardComponent,
        MagicItemTableComponent,
        SearchableListComponent,
        MonsterSearchComponent,
        HealthCalculatorComponent,
        ManageListComponent
    ],
  providers: []
})
export class SharedModule {
}
