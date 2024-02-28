import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {EVENTS} from '../../../constants';
import {Subscription} from 'rxjs';
import {EventsService} from '../../../core/services/events.service';
import {ActivatedRoute} from '@angular/router';
import {EncounterPageType} from '../../../shared/models/creatures/characters/character-page-type.enum';
import {PageMenuAction} from '../../character/character-playing/character-playing.component';
import {TranslateService} from '@ngx-translate/core';
import {CombatCreature} from '../../../shared/models/combat-row';
import {PlayerCharacter} from '../../../shared/models/creatures/characters/player-character';
import {Creature} from '../../../shared/models/creatures/creature';
import {EncounterCreatureType} from '../../../shared/models/campaigns/encounters/encounter-creature-type.enum';
import {BattleMonster} from '../../../shared/models/creatures/battle-monsters/battle-monster';
import {CampaignSettings} from '../../../shared/models/campaigns/campaign-settings';

@Component({
  selector: 'app-encounter-column',
  templateUrl: './encounter-column.component.html',
  styleUrls: ['./encounter-column.component.scss']
})
export class EncounterColumnComponent implements OnInit, OnDestroy, OnChanges {
  @Input() columnIndex = 0;
  @Input() loading = false;
  @Input() combatCreature: CombatCreature;
  @Input() campaignSettings: CampaignSettings;
  @Output() flee = new EventEmitter();
  @Output() delay = new EventEmitter();

  eventSub: Subscription;
  queryParamsSub: Subscription;
  isPublic = false;
  isShared = false;
  isAuthor = true;

  pages: EncounterPageType[] = [];
  selectedPage: EncounterPageType;

  isBasic = false;
  isAbilities = false;
  isActions = false;
  isSpells = false;
  isSkills = false;
  isFeatures = false;
  isConditions = false;
  isProficiencies = false;
  isDamageModifiers = false;
  isCompanions = false;
  isEquipment = false;
  isCharacteristics = false;
  isNotes = false;
  menuActions: PageMenuAction[] = [];

  creature: Creature = null;
  playerCharacter: PlayerCharacter = null;
  battleMonster: BattleMonster = null;

  constructor(
    private route: ActivatedRoute,
    private translate: TranslateService,
    private eventsService: EventsService
  ) { }

  ngOnInit() {
    this.eventSub = this.eventsService.events.subscribe(event => {
      if (event === EVENTS.PageOrderUpdated) {
        this.initializePages();
      }
    });

    this.queryParamsSub = this.route.queryParams
      .subscribe((params: {public: string, shared: string}) => {
        this.isPublic = params.public != null && params.public === 'true';
        this.isShared = params.shared != null && params.shared === 'true';
        this.isAuthor = !this.isPublic && !this.isShared;
      });

    this.initializePages();
    this.initializeData();
  }

  ngOnDestroy() {
    this.eventSub.unsubscribe();
    this.queryParamsSub.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        if (propName === 'combatCreature') {
          this.initializeData();
        }
      }
    }
  }

  private initializeData(): void {
    this.creature = null;
    this.playerCharacter = null;
    this.battleMonster = null;
    this.updatePages();

    if (this.combatCreature != null) {
      setTimeout(() => {
        this.creature = this.combatCreature.battleCreature.creature;
        if (this.combatCreature.battleCreature.encounterCreatureType === EncounterCreatureType.CHARACTER) {
          this.playerCharacter = this.creature as PlayerCharacter;
        } else if (this.combatCreature.battleCreature.encounterCreatureType === EncounterCreatureType.MONSTER) {
          this.battleMonster = this.creature as BattleMonster;
        }
      });
    }
  }

  private initializePages(): void {
    const pages: EncounterPageType[] = [];

    pages.push(EncounterPageType.BASIC);
    pages.push(EncounterPageType.QUICK_ACTIONS);
    pages.push(EncounterPageType.ABILITIES);
    pages.push(EncounterPageType.EQUIPMENT);
    pages.push(EncounterPageType.SPELLS);
    pages.push(EncounterPageType.FEATURES);
    pages.push(EncounterPageType.SKILLS);
    pages.push(EncounterPageType.CONDITIONS);

    pages.push(EncounterPageType.DAMAGE_MODIFIERS);
    pages.push(EncounterPageType.PROFICIENCIES);
    pages.push(EncounterPageType.CHARACTERISTICS);
    pages.push(EncounterPageType.COMPANIONS);
    pages.push(EncounterPageType.NOTES);

    if (pages.length > this.columnIndex) {
      this.selectedPage = pages[this.columnIndex];
    } else if (pages.length > 0) {
      this.selectedPage = pages[pages.length - 1];
    }
    this.pages = pages;
    this.updatePages();
  }

  private updatePages(): void {
    this.isBasic = this.selectedPage === EncounterPageType.BASIC;
    this.isAbilities = this.selectedPage === EncounterPageType.ABILITIES;
    this.isActions = this.selectedPage === EncounterPageType.QUICK_ACTIONS;
    this.isSpells = this.selectedPage === EncounterPageType.SPELLS;
    this.isSkills = this.selectedPage === EncounterPageType.SKILLS;
    this.isFeatures = this.selectedPage === EncounterPageType.FEATURES;
    this.isConditions = this.selectedPage === EncounterPageType.CONDITIONS;
    this.isProficiencies = this.selectedPage === EncounterPageType.PROFICIENCIES;
    this.isDamageModifiers = this.selectedPage === EncounterPageType.DAMAGE_MODIFIERS;
    this.isCompanions = this.selectedPage === EncounterPageType.COMPANIONS;
    this.isEquipment = this.selectedPage === EncounterPageType.EQUIPMENT;
    this.isCharacteristics = this.selectedPage === EncounterPageType.CHARACTERISTICS;
    this.isNotes = this.selectedPage === EncounterPageType.NOTES;

    this.updatePageMenuActions();
  }

  private updatePageMenuActions(): void {
    const menuActions: PageMenuAction[] = [];
    const isCharacter = this.combatCreature != null && this.combatCreature.battleCreature.encounterCreatureType === EncounterCreatureType.CHARACTER;
    const isMonster = this.combatCreature != null && this.combatCreature.battleCreature.encounterCreatureType === EncounterCreatureType.MONSTER;
    if (this.isSpells) {
      if (!isCharacter) {
        menuActions.push(new PageMenuAction(this.translate.instant('Headers.AddSpells'), (EVENTS.MenuAction.AddSpells + this.columnIndex), 'fas fa-plus'));
      }
      if (isCharacter) {
        menuActions.push(new PageMenuAction(this.translate.instant('Headers.Tagging'), (EVENTS.MenuAction.SpellTagging + this.columnIndex), 'fas fa-tag'));
        menuActions.push(new PageMenuAction(this.translate.instant('Headers.Preparation'), (EVENTS.MenuAction.SpellPreparation + this.columnIndex), 'fas fa-chevron-circle-right'));
      }
      if (isMonster) {
        menuActions.push(new PageMenuAction(this.translate.instant('Headers.LimitedUse'), (EVENTS.MenuAction.SpellLimitedUse + this.columnIndex), 'fas fa-chevron-circle-right'));
      }
      menuActions.push(new PageMenuAction(this.translate.instant('Headers.Concentration'), (EVENTS.MenuAction.Concentration + this.columnIndex), 'fas fa-lightbulb'));
      menuActions.push(new PageMenuAction(this.translate.instant('Filters'), (EVENTS.MenuAction.SpellFilters + this.columnIndex), 'fas fa-filter'));
      menuActions.push(new PageMenuAction(this.translate.instant('Sorting'), (EVENTS.MenuAction.SpellSorting + this.columnIndex), 'fas fa-sort'));
      if (isCharacter) {
        menuActions.push(new PageMenuAction(this.translate.instant('Headers.Settings'), (EVENTS.MenuAction.SpellSettings + this.columnIndex), 'fas fa-cog'));
      }
    } else if (this.isFeatures) {
      // if (this.isAuthor && isCharacter) {
      //   menuActions.push(new PageMenuAction(this.translate.instant('Headers.AddFeatures'), (EVENTS.MenuAction.AddFeatures + this.columnIndex), 'fas fa-plus'));
      // }
      if (isCharacter) {
        menuActions.push(new PageMenuAction(this.translate.instant('Headers.Tagging'), (EVENTS.MenuAction.FeatureTagging + this.columnIndex), 'fas fa-tag'));
      }
      menuActions.push(new PageMenuAction(this.translate.instant('Headers.LimitedUse'), (EVENTS.MenuAction.FeatureDetails + this.columnIndex), 'fas fa-chevron-circle-right'));
      if (isCharacter) {
        menuActions.push(new PageMenuAction(this.translate.instant('Filters'), (EVENTS.MenuAction.FeatureFilters + this.columnIndex), 'fas fa-filter'));
        menuActions.push(new PageMenuAction(this.translate.instant('Sorting'), (EVENTS.MenuAction.FeatureSorting + this.columnIndex), 'fas fa-sort'));
        menuActions.push(new PageMenuAction(this.translate.instant('Headers.Settings'), (EVENTS.MenuAction.FeatureSettings + this.columnIndex), 'fas fa-cog'));
      }
    } else if (this.isConditions) {
      // menuActions.push(new PageMenuAction(this.translate.instant('Filters'), (EVENTS.MenuAction.ConditionFilters + this.columnIndex), 'fas fa-filter'));
      menuActions.push(new PageMenuAction(this.translate.instant('Sorting'), (EVENTS.MenuAction.ConditionSorting + this.columnIndex), 'fas fa-sort'));
    } else if (this.isNotes) {
      // menuActions.push(new PageMenuAction(this.translate.instant('Filters'), (EVENTS.MenuAction.NoteFilters + this.columnIndex), 'fas fa-filter'));
      // menuActions.push(new PageMenuAction(this.translate.instant('Sorting'), (EVENTS.MenuAction.NoteSorting + this.columnIndex), 'fas fa-sort'));
      menuActions.push(new PageMenuAction(this.translate.instant('AddNote'), (EVENTS.MenuAction.AddNote + this.columnIndex), 'fas fa-plus'));
    } else if (this.isSkills) {
      // menuActions.push(new PageMenuAction(this.translate.instant('Filters'), (EVENTS.MenuAction.SkillFilters + this.columnIndex), 'fas fa-filter'));
      menuActions.push(new PageMenuAction(this.translate.instant('Sorting'), (EVENTS.MenuAction.SkillSorting + this.columnIndex), 'fas fa-sort'));
      if (isCharacter) {
        menuActions.push(new PageMenuAction(this.translate.instant('Headers.Settings'), (EVENTS.MenuAction.SkillSettings + this.columnIndex), 'fas fa-cog'));
      }
    } else if (this.isCompanions) {
      if (this.isAuthor) {
        menuActions.push(new PageMenuAction(this.translate.instant('Headers.AddCompanion'), (EVENTS.MenuAction.AddCompanion + this.columnIndex), 'fas fa-plus'));
      }
      menuActions.push(new PageMenuAction(this.translate.instant('Filters'), (EVENTS.MenuAction.CompanionFilters + this.columnIndex), 'fas fa-filter'));
      menuActions.push(new PageMenuAction(this.translate.instant('Sorting'), (EVENTS.MenuAction.CompanionSorting + this.columnIndex), 'fas fa-sort'));
    } else if (this.isEquipment) {
      if (!isCharacter) {
        menuActions.push(new PageMenuAction(this.translate.instant('AddItems'), (EVENTS.MenuAction.AddItems + this.columnIndex), 'fas fa-plus'));
      }
      if (isCharacter) {
        menuActions.push(new PageMenuAction(this.translate.instant('Headers.Attunement'), (EVENTS.MenuAction.ItemAttunement + this.columnIndex), 'fas fa-link'));
      }
      menuActions.push(new PageMenuAction(this.translate.instant('Headers.Charges'), (EVENTS.MenuAction.ItemCharges + this.columnIndex), 'fas fa-bolt'));
      // menuActions.push(new PageMenuAction(this.translate.instant('Filters'), (EVENTS.MenuAction.ItemFilters + this.columnIndex), 'fas fa-filter'));
      // menuActions.push(new PageMenuAction(this.translate.instant('Sorting'), (EVENTS.MenuAction.ItemSorting + this.columnIndex), 'fas fa-sort'));
      if (isCharacter) {
        menuActions.push(new PageMenuAction(this.translate.instant('Headers.Settings'), (EVENTS.MenuAction.ItemSettings + this.columnIndex), 'fas fa-cog'));
      }
    } else if (this.isActions) {
      if (isCharacter) {
        menuActions.push(new PageMenuAction(this.translate.instant('ActionType.STANDARD'), (EVENTS.MenuAction.StandardActions + this.columnIndex), ''));
        menuActions.push(new PageMenuAction(this.translate.instant('ActionType.BONUS'), (EVENTS.MenuAction.BonusActions + this.columnIndex), ''));
        menuActions.push(new PageMenuAction(this.translate.instant('ActionType.REACTION'), (EVENTS.MenuAction.Reactions + this.columnIndex), ''));
        menuActions.push(new PageMenuAction(this.translate.instant('FavoriteActions'), (EVENTS.MenuAction.FavoriteActions + this.columnIndex), ''));
      } else if (isMonster) {
        const battleMonster = this.combatCreature.battleCreature.creature as BattleMonster;
        menuActions.push(new PageMenuAction(this.translate.instant('Headers.LimitedUse'), (EVENTS.MenuAction.ActionDetails + this.columnIndex), 'fas fa-chevron-circle-right'));
        if (battleMonster.maxLegendaryPoints > 0) {
          menuActions.push(new PageMenuAction(this.translate.instant('LegendaryPoints'), (EVENTS.MenuAction.LegendaryPoints + this.columnIndex), 'fas fa-chevron-circle-right'));
        }
      }
      // menuActions.push(new PageMenuAction(this.translate.instant('Headers.Settings'), (EVENTS.MenuAction.ActionSettings + this.columnIndex), 'fas fa-cog'));
    }
    this.menuActions = menuActions;
  }

  menuActionClick(menuAction: PageMenuAction): void {
    this.eventsService.dispatchEvent(menuAction.event);
  }

  pageChange(encounterPageType: EncounterPageType): void {
    this.selectedPage = encounterPageType;
    this.updatePages();
  }

  onFleeClick(): void {
    this.flee.emit();
  }

  onDelayClick(): void {
    this.delay.emit();
  }

}
