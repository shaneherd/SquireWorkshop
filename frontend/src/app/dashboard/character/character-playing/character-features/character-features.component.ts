import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {PlayerCharacter} from '../../../../shared/models/creatures/characters/player-character';
import {CreatureConfigurationCollection} from '../../../../shared/models/creatures/configs/creature-configuration-collection';
import {CharacterService} from '../../../../core/services/creatures/character.service';
import {Filters} from '../../../../core/components/filters/filters';
import {Sorts} from '../../../../core/components/sorts/sorts';
import {FilterType} from '../../../../core/components/filters/filter-type.enum';
import {SortType} from '../../../../core/components/sorts/sort-type.enum';
import {CreatureService} from '../../../../core/services/creatures/creature.service';
import {FilterSorts} from '../../../../shared/models/filter-sorts';
import {EVENTS} from '../../../../constants';
import {EventsService} from '../../../../core/services/events.service';
import {CreatureFeature} from '../../../../shared/models/creatures/creature-feature';
import {FilterDataOptionKey} from '../../../../core/components/filters/filter-data-option-key.enum';
import {Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';

export class ApplicableFeature {
  creatureFeature: CreatureFeature;
  canActivate = false;
}

@Component({
  selector: 'app-character-features',
  templateUrl: './character-features.component.html',
  styleUrls: ['./character-features.component.scss']
})
export class CharacterFeaturesComponent implements OnInit, OnDestroy {
  @Input() playerCharacter: PlayerCharacter;
  @Input() collection: CreatureConfigurationCollection;
  @Input() columnIndex: number;
  @Input() fromEncounter = false;

  eventSub: Subscription;
  queryParamsSub: Subscription;
  isPublic = false;
  isShared = false;
  applicableFeatures: ApplicableFeature[] = [];
  filterType = FilterType.FEATURE;
  filters: Filters;
  filterOptions = new Map<FilterDataOptionKey, boolean>();
  sortType = SortType.FEATURE;
  sorts: Sorts;
  clickDisabled = false;
  addingFeature = false;
  viewingFeature: CreatureFeature = null;
  viewingInfo = false;
  viewingTags = false;
  viewingSettings = false;

  constructor(
    private route: ActivatedRoute,
    private creatureService: CreatureService,
    private characterService: CharacterService,
    private eventsService: EventsService
  ) { }

  ngOnInit() {
    this.eventSub = this.eventsService.events.subscribe(event => {
      if (event === EVENTS.FetchFeaturesList) {
        this.fetchFeatures();
      } else if (event === (EVENTS.MenuAction.AddFeatures + this.columnIndex)) {
        this.addFeature();
      } else if (event === (EVENTS.MenuAction.FeatureTagging + this.columnIndex)) {
        this.tagClick();
      } else if (event === (EVENTS.MenuAction.FeatureDetails + this.columnIndex)) {
        this.infoClick();
      } else if (event === (EVENTS.MenuAction.FeatureSettings + this.columnIndex)) {
        this.settingsClick();
      }
    });

    this.queryParamsSub = this.route.queryParams
      .subscribe((params: {public: string, shared: string}) => {
        this.isPublic = params.public != null && params.public === 'true';
        this.isShared = params.shared != null && params.shared === 'true';
      });

    this.initializeValues();
  }

  ngOnDestroy() {
    this.eventSub.unsubscribe();
    this.queryParamsSub.unsubscribe();
  }

  private initializeValues(): void {
    this.filters = this.creatureService.getFilters(this.playerCharacter, FilterType.FEATURE);
    this.filterOptions.set(FilterDataOptionKey.ACTIVE_APPLICABLE, true);
    this.filterOptions.set(FilterDataOptionKey.PASSIVE_APPLICABLE, true);
    this.sorts = this.creatureService.getSorts(this.playerCharacter, SortType.FEATURE);
    this.characterService.setLimitedUseCalculatedMax(this.playerCharacter.creatureFeatures.features, this.playerCharacter, this.collection);
    this.initializeApplicableFeatures();
  }

  addFeature(): void {
    if (!this.clickDisabled && !this.isPublic && !this.isShared) {
      this.addingFeature = true;
      this.updateClickDisabled();
    }
  }

  featureClick(feature: CreatureFeature): void {
    if (!this.clickDisabled) {
      this.viewingFeature = feature;
      this.updateClickDisabled();
    }
  }

  addSelectedFeatures(): void {
    this.addingFeature = false;
    this.eventsService.dispatchEvent(EVENTS.FetchFeaturesList);
    this.updateClickDisabled();
  }

  private updateClickDisabled(): void {
    this.clickDisabled = this.addingFeature || this.viewingFeature != null || this.viewingTags || this.viewingInfo || this.viewingSettings;
  }

  featuresListClose(): void {
    this.addingFeature = false;
    this.updateClickDisabled();
  }

  closeDetails(): void {
    this.viewingFeature = null;
    this.updateClickDisabled();
  }

  useFeature(creatureFeature: CreatureFeature): void {
    this.viewingFeature = null;
    this.updateClickDisabled();
  }

  removeFeature(creatureFeature: CreatureFeature): void {
    this.viewingFeature = null;
    this.updateClickDisabled();
  }

  applyFilters(filters: Filters): void {
    this.creatureService.updateFilters(this.playerCharacter, FilterType.FEATURE, filters).then(() => {
      this.filters = filters;
      this.eventsService.dispatchEvent(EVENTS.FetchFeaturesList);
    });
  }

  applySort(sorts: Sorts): void {
    this.creatureService.updateSorts(this.playerCharacter, SortType.FEATURE, sorts).then(() => {
      this.sorts = sorts;
      this.eventsService.dispatchEvent(EVENTS.FetchFeaturesList);
    });
  }

  private fetchFeatures(): void {
    this.filters = this.creatureService.getFilters(this.playerCharacter, FilterType.FEATURE);
    this.sorts = this.creatureService.getSorts(this.playerCharacter, SortType.FEATURE);
    const filterSorts = new FilterSorts(this.filters, this.sorts);
    this.creatureService.getFeatures(this.playerCharacter, filterSorts).then((features: CreatureFeature[]) => {
      this.playerCharacter.creatureFeatures.features = features;
      this.characterService.setLimitedUseCalculatedMax(features, this.playerCharacter, this.collection);
      this.initializeApplicableFeatures();
      this.eventsService.dispatchEvent(EVENTS.UpdateFeatureList);
    });
  }

  private initializeApplicableFeatures(): void {
    this.applicableFeatures = [];
    this.playerCharacter.creatureFeatures.features.forEach((creatureFeature: CreatureFeature) => {
      if (!creatureFeature.hidden) {
        const applicableFeature = new ApplicableFeature();
        applicableFeature.creatureFeature = creatureFeature;
        applicableFeature.canActivate = this.canActivate(creatureFeature);
        this.applicableFeatures.push(applicableFeature);
      }
    });
  }

  private canActivate(creatureFeature: CreatureFeature): boolean {
    const characterLevel = this.characterService.getCreatureFeatureCharacterLevel(this.playerCharacter, creatureFeature, this.collection);
    const config = this.characterService.getCreaturePowerModifiers(creatureFeature, this.playerCharacter, characterLevel, this.collection);
    return config != null && config.modifierConfigurations.length > 0;
  }

  private infoClick(): void {
    this.viewingInfo = true;
    this.updateClickDisabled();
  }

  saveInfo(): void {
    this.viewingInfo = false;
    this.updateClickDisabled();
  }

  closeInfo(): void {
    this.viewingInfo = false;
    this.updateClickDisabled();
  }

  private settingsClick(): void {
    this.viewingSettings = true;
    this.updateClickDisabled();
  }

  saveSettings(): void {
    this.viewingSettings = false;
    this.updateClickDisabled();
  }

  closeSettings(): void {
    this.viewingSettings = false;
    this.updateClickDisabled();
  }

  private tagClick(): void {
    this.viewingTags = true;
    this.updateClickDisabled();
  }

  saveTags(): void {
    this.viewingTags = false;
    this.eventsService.dispatchEvent(EVENTS.FetchFeaturesList);
    this.updateClickDisabled();
  }

  closeTags(): void {
    this.viewingTags = false;
    this.updateClickDisabled();
  }
}
