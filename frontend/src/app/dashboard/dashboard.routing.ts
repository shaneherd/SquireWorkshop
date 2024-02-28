import {RouterModule, Routes} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import {DefaultPageComponent} from './default-page/default-page.component';
import {DashboardComponent} from './dashboard.component';
import {AuthGuard} from '../core/guards/auth.guard';
import {DefaultDetailsComponent} from './default-details/default-details.component';
import {ContextMenuComponent} from '../shared/components/context-menu/context-menu.component';
import {CharacterContextMenuComponent} from '../shared/components/character-context-menu/character-context-menu.component';
import {PendingChangesGuard} from '../core/guards/pending-changes.guard';
import {ArmorTypeInfoComponent} from './manage/armor-type/armor-type-info/armor-type-info.component';
import {ArmorTypeListComponent} from './manage/armor-type/armor-type-list/armor-type-list.component';
import {DamageTypeInfoComponent} from './manage/damage-type/damage-type-info/damage-type-info.component';
import {DamageTypeListComponent} from './manage/damage-type/damage-type-list/damage-type-list.component';
import {BackgroundInfoComponent} from './manage/background/background-info/background-info.component';
import {BackgroundListComponent} from './manage/background/background-list/background-list.component';
import {CasterTypeInfoComponent} from './manage/caster-type/caster-type-info/caster-type-info.component';
import {CasterTypeListComponent} from './manage/caster-type/caster-type-list/caster-type-list.component';
import {ConditionInfoComponent} from './manage/condition/condition-info/condition-info.component';
import {ConditionListComponent} from './manage/condition/condition-list/condition-list.component';
import {ClassInfoComponent} from './manage/class/class-info/class-info.component';
import {ClassListComponent} from './manage/class/class-list/class-list.component';
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
import {CharactersListComponent} from './character/characters-list/characters-list.component';
import {ToolCategoryInfoComponent} from './manage/tool-category/tool-category-info/tool-category-info.component';
import {ToolCategoryListComponent} from './manage/tool-category/tool-category-list/tool-category-list.component';
import {LevelInfoComponent} from './manage/level/level-info/level-info.component';
import {LevelListComponent} from './manage/level/level-list/level-list.component';
import {DeityInfoComponent} from './manage/deity/deity-info/deity-info.component';
import {DeityListComponent} from './manage/deity/deity-list/deity-list.component';
import {AreaOfEffectInfoComponent} from './manage/area-of-effect/area-of-effect-info/area-of-effect-info.component';
import {AreaOfEffectListComponent} from './manage/area-of-effect/area-of-effect-list/area-of-effect-list.component';
import {AlignmentInfoComponent} from './manage/alignment/alignment-info/alignment-info.component';
import {AlignmentListComponent} from './manage/alignment/alignment-list/alignment-list.component';
import {DeityCategoryInfoComponent} from './manage/deity/deity-category-info/deity-category-info.component';
import {DeityCategoryListComponent} from './manage/deity/deity-category-list/deity-category-list.component';
import {CharacterEditComponent} from './character/character-edit/character-edit.component';
import {CharacterPlayingComponent} from './character/character-playing/character-playing.component';
import {SubclassListComponent} from './manage/class/subclass-list/subclass-list.component';
import {SubRaceListComponent} from './manage/race/sub-race-list/sub-race-list.component';
import {ChangePasswordComponent} from '../core/header/change-password/change-password.component';
import {ChangeEmailComponent} from '../core/header/change-email/change-email.component';
import {UserSettingsComponent} from '../core/header/user-settings/user-settings.component';
import {ImportsComponent} from './imports/imports.component';
import {SubBackgroundListComponent} from './manage/background/sub-background-list/sub-background-list.component';
import {MyStuffContextMenuComponent} from '../shared/components/my-stuff-context-menu/my-stuff-context-menu.component';
import {PublicContextMenuComponent} from '../shared/components/public-context-menu/public-context-menu.component';
import {SharedWithMeContextMenuComponent} from '../shared/components/shared-with-me-context-menu/shared-with-me-context-menu.component';
import {MonsterInfoComponent} from './manage/monster/monster-info/monster-info.component';
import {MonsterListComponent} from './manage/monster/monster-list/monster-list.component';
import {CampaignsListComponent} from './gm-mode/campaigns-list/campaigns-list.component';
import {CampaignInfoComponent} from './gm-mode/campaign-info/campaign-info.component';
import {ArmorTypeManageComponent} from './manage/armor-type/armor-type-manage/armor-type-manage.component';
import {BackgroundManageComponent} from './manage/background/background-manage/background-manage.component';
import {CasterTypeManageComponent} from './manage/caster-type/caster-type-manage/caster-type-manage.component';
import {ClassManageComponent} from './manage/class/class-manage/class-manage.component';
import {ConditionManageComponent} from './manage/condition/condition-manage/condition-manage.component';
import {DamageTypeManageComponent} from './manage/damage-type/damage-type-manage/damage-type-manage.component';
import {FeatureManageComponent} from './manage/feature/feature-manage/feature-manage.component';
import {ItemManageComponent} from './manage/item/item-manage/item-manage.component';
import {LanguageManageComponent} from './manage/language/language-manage/language-manage.component';
import {MonsterManageComponent} from './manage/monster/monster-manage/monster-manage.component';
import {RaceManageComponent} from './manage/race/race-manage/race-manage.component';
import {SkillManageComponent} from './manage/skill/skill-manage/skill-manage.component';
import {SpellManageComponent} from './manage/spell/spell-manage/spell-manage.component';
import {WeaponPropertyManageComponent} from './manage/weapon-property/weapon-property-manage/weapon-property-manage.component';
import {AlignmentManageComponent} from './manage/alignment/alignment-manage/alignment-manage.component';
import {AreaOfEffectManageComponent} from './manage/area-of-effect/area-of-effect-manage/area-of-effect-manage.component';
import {DeityManageComponent} from './manage/deity/deity-manage/deity-manage.component';
import {LevelManageComponent} from './manage/level/level-manage/level-manage.component';
import {ToolCategoryManageComponent} from './manage/tool-category/tool-category-manage/tool-category-manage.component';
import {DeityCategoryManageComponent} from './manage/deity/deity-category-manage/deity-category-manage.component';
import {EncounterContextMenuComponent} from './gm-mode/encounter-context-menu/encounter-context-menu.component';
import {EncounterComponent} from './gm-mode/encounter/encounter.component';

export const routes: Routes = [
  {
    path: '', children: [
      {
        path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard], children: [
          {path: '', component: MyStuffContextMenuComponent, outlet: 'side-nav'},
          {path: '', component: DefaultPageComponent, outlet: 'middle-nav'},
          {path: 'default', component: MyStuffContextMenuComponent, outlet: 'side-nav'},
          {path: 'default', component: DefaultPageComponent, outlet: 'middle-nav'},

          {path: 'myStuff', component: MyStuffContextMenuComponent, outlet: 'side-nav'},
          {path: 'public', component: PublicContextMenuComponent, outlet: 'side-nav'},
          {path: 'home', component: ContextMenuComponent, outlet: 'side-nav'},
          {path: 'shared', component: SharedWithMeContextMenuComponent, outlet: 'side-nav'},

          {path: 'changePassword', component: ChangePasswordComponent, outlet: 'middle-nav'},
          {path: 'changeEmail', component: ChangeEmailComponent, outlet: 'middle-nav'},
          {path: 'userSettings', component: UserSettingsComponent, outlet: 'middle-nav'},
          {path: 'import', component: ImportsComponent, outlet: 'middle-nav', canDeactivate: [PendingChangesGuard]},
          {path: 'import', component: ContextMenuComponent, outlet: 'side-nav'},

          {path: 'armorTypes/:id', component: ArmorTypeInfoComponent, outlet: 'middle-nav', canDeactivate: [PendingChangesGuard]},
          {path: 'armorTypes/:id', component: ArmorTypeListComponent, outlet: 'side-nav'},
          {path: 'armorTypes', component: ArmorTypeListComponent, outlet: 'side-nav'},
          {path: 'armorTypesManage', component: ArmorTypeManageComponent, outlet: 'middle-nav'},

          {path: 'backgrounds/:id', component: BackgroundInfoComponent, outlet: 'middle-nav', canDeactivate: [PendingChangesGuard]},
          {path: 'backgrounds/:id/:childId', component: BackgroundInfoComponent, outlet: 'middle-nav', canDeactivate: [PendingChangesGuard]},
          {path: 'backgrounds', component: BackgroundListComponent, outlet: 'side-nav'},
          {path: 'backgrounds/:id', component: BackgroundListComponent, outlet: 'side-nav'},
          {path: 'backgrounds/:id/:childId', component: SubBackgroundListComponent, outlet: 'side-nav'},
          {path: 'backgroundsManage', component: BackgroundManageComponent, outlet: 'middle-nav'},

          {path: 'casterTypes/:id', component: CasterTypeInfoComponent, outlet: 'middle-nav', canDeactivate: [PendingChangesGuard]},
          {path: 'casterTypes/:id', component: CasterTypeListComponent, outlet: 'side-nav'},
          {path: 'casterTypes', component: CasterTypeListComponent, outlet: 'side-nav'},
          {path: 'casterTypesManage', component: CasterTypeManageComponent, outlet: 'middle-nav'},

          {path: 'classes/:id', component: ClassInfoComponent, outlet: 'middle-nav', canDeactivate: [PendingChangesGuard]},
          {path: 'classes/:id/:childId', component: ClassInfoComponent, outlet: 'middle-nav', canDeactivate: [PendingChangesGuard]},
          {path: 'classes', component: ClassListComponent, outlet: 'side-nav'},
          {path: 'classes/:id', component: ClassListComponent, outlet: 'side-nav'},
          {path: 'classes/:id/:childId', component: SubclassListComponent, outlet: 'side-nav'},
          {path: 'classesManage', component: ClassManageComponent, outlet: 'middle-nav'},

          {path: 'conditions/:id', component: ConditionInfoComponent, outlet: 'middle-nav', canDeactivate: [PendingChangesGuard]},
          {path: 'conditions/:id', component: ConditionListComponent, outlet: 'side-nav'},
          {path: 'conditions', component: ConditionListComponent, outlet: 'side-nav'},
          {path: 'conditionsManage', component: ConditionManageComponent, outlet: 'middle-nav'},

          {path: 'damageTypes/:id', component: DamageTypeInfoComponent, outlet: 'middle-nav', canDeactivate: [PendingChangesGuard]},
          {path: 'damageTypes/:id', component: DamageTypeListComponent, outlet: 'side-nav'},
          {path: 'damageTypes', component: DamageTypeListComponent, outlet: 'side-nav'},
          {path: 'damageTypesManage', component: DamageTypeManageComponent, outlet: 'middle-nav'},

          {path: 'features/:id', component: FeatureInfoComponent, outlet: 'middle-nav', canDeactivate: [PendingChangesGuard]},
          {path: 'features/:id', component: FeatureListComponent, outlet: 'side-nav'},
          {path: 'features', component: FeatureListComponent, outlet: 'side-nav'},
          {path: 'featuresManage', component: FeatureManageComponent, outlet: 'middle-nav'},

          {path: 'items/:id', component: ItemInfoComponent, outlet: 'middle-nav', canDeactivate: [PendingChangesGuard]},
          {path: 'items/:id', component: ItemListComponent, outlet: 'side-nav'},
          {path: 'items', component: ItemListComponent, outlet: 'side-nav'},
          {path: 'itemsManage', component: ItemManageComponent, outlet: 'middle-nav'},

          {path: 'languages/:id', component: LanguageInfoComponent, outlet: 'middle-nav', canDeactivate: [PendingChangesGuard]},
          {path: 'languages/:id', component: LanguageListComponent, outlet: 'side-nav'},
          {path: 'languages', component: LanguageListComponent, outlet: 'side-nav'},
          {path: 'languagesManage', component: LanguageManageComponent, outlet: 'middle-nav'},

          {path: 'monsters/:id', component: MonsterInfoComponent, outlet: 'middle-nav', canDeactivate: [PendingChangesGuard]},
          {path: 'monsters/:id', component: MonsterListComponent, outlet: 'side-nav'},
          {path: 'monsters', component: MonsterListComponent, outlet: 'side-nav'},
          {path: 'monstersManage', component: MonsterManageComponent, outlet: 'middle-nav'},

          {path: 'races/:id', component: RaceInfoComponent, outlet: 'middle-nav', canDeactivate: [PendingChangesGuard]},
          {path: 'races/:id/:childId', component: RaceInfoComponent, outlet: 'middle-nav', canDeactivate: [PendingChangesGuard]},
          {path: 'races', component: RaceListComponent, outlet: 'side-nav'},
          {path: 'races/:id', component: RaceListComponent, outlet: 'side-nav'},
          {path: 'races/:id/:childId', component: SubRaceListComponent, outlet: 'side-nav'},
          {path: 'racesManage', component: RaceManageComponent, outlet: 'middle-nav'},

          {path: 'skills/:id', component: SkillInfoComponent, outlet: 'middle-nav', canDeactivate: [PendingChangesGuard]},
          {path: 'skills/:id', component: SkillListComponent, outlet: 'side-nav'},
          {path: 'skills', component: SkillListComponent, outlet: 'side-nav'},
          {path: 'skillsManage', component: SkillManageComponent, outlet: 'middle-nav'},

          {path: 'spells/:id', component: SpellInfoComponent, outlet: 'middle-nav', canDeactivate: [PendingChangesGuard]},
          {path: 'spells/:id', component: SpellListComponent, outlet: 'side-nav'},
          {path: 'spells', component: SpellListComponent, outlet: 'side-nav'},
          {path: 'spellsManage', component: SpellManageComponent, outlet: 'middle-nav'},

          {path: 'weaponProperties/:id', component: WeaponPropertyInfoComponent, outlet: 'middle-nav', canDeactivate: [PendingChangesGuard]},
          {path: 'weaponProperties/:id', component: WeaponPropertyListComponent, outlet: 'side-nav'},
          {path: 'weaponProperties', component: WeaponPropertyListComponent, outlet: 'side-nav'},
          {path: 'weaponPropertiesManage', component: WeaponPropertyManageComponent, outlet: 'middle-nav'},

          {path: 'alignments/:id', component: AlignmentInfoComponent, outlet: 'middle-nav', canDeactivate: [PendingChangesGuard]},
          {path: 'alignments/:id', component: AlignmentListComponent, outlet: 'side-nav'},
          {path: 'alignments', component: AlignmentListComponent, outlet: 'side-nav'},
          {path: 'alignmentsManage', component: AlignmentManageComponent, outlet: 'middle-nav'},

          {path: 'areaOfEffects/:id', component: AreaOfEffectInfoComponent, outlet: 'middle-nav', canDeactivate: [PendingChangesGuard]},
          {path: 'areaOfEffects/:id', component: AreaOfEffectListComponent, outlet: 'side-nav'},
          {path: 'areaOfEffects', component: AreaOfEffectListComponent, outlet: 'side-nav'},
          {path: 'areaOfEffectsManage', component: AreaOfEffectManageComponent, outlet: 'middle-nav'},

          {path: 'deities/:id', component: DeityInfoComponent, outlet: 'middle-nav', canDeactivate: [PendingChangesGuard]},
          {path: 'deities/:id', component: DeityListComponent, outlet: 'side-nav'},
          {path: 'deities', component: DeityListComponent, outlet: 'side-nav'},
          {path: 'deitiesManage', component: DeityManageComponent, outlet: 'middle-nav'},

          {path: 'deityCategories/:id', component: DeityCategoryInfoComponent, outlet: 'middle-nav', canDeactivate: [PendingChangesGuard]},
          {path: 'deityCategories/:id', component: DeityCategoryListComponent, outlet: 'side-nav'},
          {path: 'deityCategories', component: DeityCategoryListComponent, outlet: 'side-nav'},
          {path: 'deityCategoriesManage', component: DeityCategoryManageComponent, outlet: 'middle-nav'},

          {path: 'levels/:id', component: LevelInfoComponent, outlet: 'middle-nav', canDeactivate: [PendingChangesGuard]},
          {path: 'levels/:id', component: LevelListComponent, outlet: 'side-nav'},
          {path: 'levels', component: LevelListComponent, outlet: 'side-nav'},
          {path: 'levelsManage', component: LevelManageComponent, outlet: 'middle-nav'},

          {path: 'toolCategories/:id', component: ToolCategoryInfoComponent, outlet: 'middle-nav', canDeactivate: [PendingChangesGuard]},
          {path: 'toolCategories/:id', component: ToolCategoryListComponent, outlet: 'side-nav'},
          {path: 'toolCategories', component: ToolCategoryListComponent, outlet: 'side-nav'},
          {path: 'toolCategoriesManage', component: ToolCategoryManageComponent, outlet: 'middle-nav'},

          {path: 'gmMode', component: DefaultDetailsComponent, outlet: 'side-nav'},
          {path: 'quickReferences', component: DefaultDetailsComponent, outlet: 'side-nav'},

          {path: 'characters', component: CharactersListComponent, outlet: 'side-nav'},
          {path: 'characters/:id', component: CharacterContextMenuComponent, outlet: 'side-nav'},
          {path: 'characters/:id', component: CharacterPlayingComponent, outlet: 'middle-nav'},
          {path: 'editCharacters/:id', component: CharacterEditComponent, outlet: 'middle-nav'},
          {path: 'editCharacters/:id', component: CharacterContextMenuComponent, outlet: 'side-nav'},

          {path: 'campaigns', component: CampaignsListComponent, outlet: 'side-nav'},
          {path: 'campaigns/:id', component: CampaignsListComponent, outlet: 'side-nav'},
          {path: 'campaigns/:id', component: CampaignInfoComponent, outlet: 'middle-nav'},

          {path: 'encounters/:id', component: EncounterContextMenuComponent, outlet: 'side-nav'},
          {path: 'encounters/:id', component: EncounterComponent, outlet: 'middle-nav'},
        ]
      }
    ]
  }
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);
