import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {PlayerCharacter} from '../../../../shared/models/creatures/characters/player-character';
import {CreatureConfigurationCollection} from '../../../../shared/models/creatures/configs/creature-configuration-collection';
import {CharacterPageType} from '../../../../shared/models/creatures/characters/character-page-type.enum';
import {EVENTS} from '../../../../constants';
import {PageMenuAction} from '../character-playing.component';
import {TranslateService} from '@ngx-translate/core';
import {CharacterPage} from '../../../../shared/models/creatures/characters/character-page';
import {EventsService} from '../../../../core/services/events.service';
import {Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-character-playing-column',
  templateUrl: './character-playing-column.component.html',
  styleUrls: ['./character-playing-column.component.scss']
})
export class CharacterPlayingColumnComponent implements OnInit, OnDestroy, OnChanges {
  @Input() columnIndex = 0;
  @Input() playerCharacter: PlayerCharacter;
  @Input() collection: CreatureConfigurationCollection;
  @Output() pageChange = new EventEmitter<CharacterPageType>();

  eventSub: Subscription;
  queryParamsSub: Subscription;
  pages: CharacterPageType[] = [];
  selectedPage: CharacterPageType;
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

  isPublic = false;
  isShared = false;
  isAuthor = true;

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
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        if (propName === 'columnIndex') {
          this.updateSelectedPage();
        }
      }
    }
  }

  ngOnDestroy() {
    this.eventSub.unsubscribe();
    this.queryParamsSub.unsubscribe();
  }

  onPageChange(characterPageType: CharacterPageType): void {
    this.selectedPage = characterPageType;
    this.updatePages();
    this.pageChange.emit(characterPageType);
  }

  private initializePages(): void {
    const pages: CharacterPageType[] = [];
    this.playerCharacter.characterSettings.pages.forEach((page: CharacterPage) => {
      if (page.visible) {
        pages.push(page.characterPageType);
      }
    });
    this.pages = pages;
    this.updateSelectedPage();
  }

  private updateSelectedPage(): void {
    if (this.pages.length > this.columnIndex) {
      this.selectedPage = this.pages[this.columnIndex];
    } else if (this.pages.length > 0) {
      this.selectedPage = this.pages[this.pages.length - 1];
    }
    this.updatePages();
  }

  private updatePages(): void {
    this.isBasic = this.selectedPage === CharacterPageType.BASIC;
    this.isAbilities = this.selectedPage === CharacterPageType.ABILITIES;
    this.isActions = this.selectedPage === CharacterPageType.QUICK_ACTIONS;
    this.isSpells = this.selectedPage === CharacterPageType.SPELLS;
    this.isSkills = this.selectedPage === CharacterPageType.SKILLS;
    this.isFeatures = this.selectedPage === CharacterPageType.FEATURES;
    this.isConditions = this.selectedPage === CharacterPageType.CONDITIONS;
    this.isProficiencies = this.selectedPage === CharacterPageType.PROFICIENCIES;
    this.isDamageModifiers = this.selectedPage === CharacterPageType.DAMAGE_MODIFIERS;
    this.isCompanions = this.selectedPage === CharacterPageType.COMPANIONS;
    this.isEquipment = this.selectedPage === CharacterPageType.EQUIPMENT;
    this.isCharacteristics = this.selectedPage === CharacterPageType.CHARACTERISTICS;
    this.isNotes = this.selectedPage === CharacterPageType.NOTES;

    this.updatePageMenuActions();
  }

  private updatePageMenuActions(): void {
    const menuActions: PageMenuAction[] = [];
    if (this.isSpells) {
      if (this.isAuthor) {
        menuActions.push(new PageMenuAction(this.translate.instant('Headers.AddSpells'), (EVENTS.MenuAction.AddSpells + this.columnIndex), 'fas fa-plus'));
      }
      menuActions.push(new PageMenuAction(this.translate.instant('Headers.Tagging'), (EVENTS.MenuAction.SpellTagging + this.columnIndex), 'fas fa-tag'));
      menuActions.push(new PageMenuAction(this.translate.instant('Headers.Preparation'), (EVENTS.MenuAction.SpellPreparation + this.columnIndex), 'fas fa-chevron-circle-right'));
      menuActions.push(new PageMenuAction(this.translate.instant('Headers.Concentration'), (EVENTS.MenuAction.Concentration + this.columnIndex), 'fas fa-lightbulb'));
      menuActions.push(new PageMenuAction(this.translate.instant('Filters'), (EVENTS.MenuAction.SpellFilters + this.columnIndex), 'fas fa-filter'));
      menuActions.push(new PageMenuAction(this.translate.instant('Sorting'), (EVENTS.MenuAction.SpellSorting + this.columnIndex), 'fas fa-sort'));
      menuActions.push(new PageMenuAction(this.translate.instant('Headers.Settings'), (EVENTS.MenuAction.SpellSettings + this.columnIndex), 'fas fa-cog'));
    } else if (this.isFeatures) {
      if (this.isAuthor) {
        menuActions.push(new PageMenuAction(this.translate.instant('Headers.AddFeatures'), (EVENTS.MenuAction.AddFeatures + this.columnIndex), 'fas fa-plus'));
      }
      menuActions.push(new PageMenuAction(this.translate.instant('Headers.Tagging'), (EVENTS.MenuAction.FeatureTagging + this.columnIndex), 'fas fa-tag'));
      menuActions.push(new PageMenuAction(this.translate.instant('Headers.LimitedUse'), (EVENTS.MenuAction.FeatureDetails + this.columnIndex), 'fas fa-chevron-circle-right'));
      menuActions.push(new PageMenuAction(this.translate.instant('Filters'), (EVENTS.MenuAction.FeatureFilters + this.columnIndex), 'fas fa-filter'));
      menuActions.push(new PageMenuAction(this.translate.instant('Sorting'), (EVENTS.MenuAction.FeatureSorting + this.columnIndex), 'fas fa-sort'));
      menuActions.push(new PageMenuAction(this.translate.instant('Headers.Settings'), (EVENTS.MenuAction.FeatureSettings + this.columnIndex), 'fas fa-cog'));
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
      menuActions.push(new PageMenuAction(this.translate.instant('Headers.Settings'), (EVENTS.MenuAction.SkillSettings + this.columnIndex), 'fas fa-cog'));
    } else if (this.isCompanions) {
      if (this.isAuthor) {
        menuActions.push(new PageMenuAction(this.translate.instant('Headers.AddCompanion'), (EVENTS.MenuAction.AddCompanion + this.columnIndex), 'fas fa-plus'));
      }
      menuActions.push(new PageMenuAction(this.translate.instant('Filters'), (EVENTS.MenuAction.CompanionFilters + this.columnIndex), 'fas fa-filter'));
      menuActions.push(new PageMenuAction(this.translate.instant('Sorting'), (EVENTS.MenuAction.CompanionSorting + this.columnIndex), 'fas fa-sort'));
    } else if (this.isEquipment) {
      if (this.isAuthor) {
        menuActions.push(new PageMenuAction(this.translate.instant('AddItems'), (EVENTS.MenuAction.AddItems + this.columnIndex), 'fas fa-plus'));
      }
      menuActions.push(new PageMenuAction(this.translate.instant('Headers.Attunement'), (EVENTS.MenuAction.ItemAttunement + this.columnIndex), 'fas fa-link'));
      menuActions.push(new PageMenuAction(this.translate.instant('Headers.Charges'), (EVENTS.MenuAction.ItemCharges + this.columnIndex), 'fas fa-bolt'));
      // menuActions.push(new PageMenuAction(this.translate.instant('Filters'), (EVENTS.MenuAction.ItemFilters + this.columnIndex), 'fas fa-filter'));
      // menuActions.push(new PageMenuAction(this.translate.instant('Sorting'), (EVENTS.MenuAction.ItemSorting + this.columnIndex), 'fas fa-sort'));
      menuActions.push(new PageMenuAction(this.translate.instant('Headers.Settings'), (EVENTS.MenuAction.ItemSettings + this.columnIndex), 'fas fa-cog'));
    } else if (this.isActions) {
      menuActions.push(new PageMenuAction(this.translate.instant('ActionType.STANDARD'), (EVENTS.MenuAction.StandardActions + this.columnIndex), ''));
      menuActions.push(new PageMenuAction(this.translate.instant('ActionType.BONUS'), (EVENTS.MenuAction.BonusActions + this.columnIndex), ''));
      menuActions.push(new PageMenuAction(this.translate.instant('ActionType.REACTION'), (EVENTS.MenuAction.Reactions + this.columnIndex), ''));
      menuActions.push(new PageMenuAction(this.translate.instant('FavoriteActions'), (EVENTS.MenuAction.FavoriteActions + this.columnIndex), ''));
      // menuActions.push(new PageMenuAction(this.translate.instant('Headers.Settings'), (EVENTS.MenuAction.ActionSettings + this.columnIndex), 'fas fa-cog'));
    }
    this.menuActions = menuActions;
  }

  menuActionClick(menuAction: PageMenuAction): void {
    this.eventsService.dispatchEvent(menuAction.event);
  }

}
