import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {CharacterValidationConfiguration} from '../validate-character.component';
import {FeatureMenuItem} from '../../../../selection-list/features-selection-list/features-selection-list.component';
import {PlayerCharacter} from '../../../../../shared/models/creatures/characters/player-character';
import {CreatureConfigurationCollection} from '../../../../../shared/models/creatures/configs/creature-configuration-collection';
import {FeatureListObject} from '../../../../../shared/models/powers/feature-list-object';
import {CreatureService} from '../../../../../core/services/creatures/creature.service';
import {Filters} from '../../../../../core/components/filters/filters';
import {FilterValue} from '../../../../../core/components/filters/filter-value';
import {DEFAULT_FILTER_VALUE, EVENTS} from '../../../../../constants';
import {FeatureFilterService} from '../../../../../core/services/powers/feature-filter.service';
import {FilterKey} from '../../../../../core/components/filters/filter-key.enum';
import {BarTagService} from '../../../../../core/services/bar-tag.service';
import {Subscription} from 'rxjs';
import {EventsService} from '../../../../../core/services/events.service';

@Component({
  selector: 'app-feat-selection',
  templateUrl: './feat-selection.component.html',
  styleUrls: ['./feat-selection.component.scss']
})
export class FeatSelectionComponent implements OnInit, OnDestroy {
  @Input() playerCharacter: PlayerCharacter;
  @Input() collection: CreatureConfigurationCollection;
  @Input() page: CharacterValidationConfiguration;
  @Input() pages: CharacterValidationConfiguration[];
  @Output() save = new EventEmitter();
  @Output() cancel = new EventEmitter();

  loading = false;
  feats: FeatureMenuItem[] = [];
  viewingFeature: FeatureMenuItem;
  defaultOption = DEFAULT_FILTER_VALUE;
  eventSub: Subscription;

  constructor(
    private featureFilterService: FeatureFilterService,
    private creatureService: CreatureService,
    private barTagService: BarTagService,
    private eventsService: EventsService
  ) { }

  ngOnInit() {
    this.initializeFeats();

    this.eventSub = this.eventsService.events.subscribe(event => {
      if (event === EVENTS.FeatureTagsUpdated) {
        this.updateFeatureTags();
      }
    });
  }

  ngOnDestroy() {
    this.eventSub.unsubscribe();
  }

  private updateFeatureTags(): void {
    this.feats.forEach((feat: FeatureMenuItem) => {
      feat.tags = this.barTagService.initializeTags(feat.feature.tags, this.playerCharacter.creatureFeatures.tags);
    });
  }

  private initializeFeats(): void {
    this.loading = true;
    this.creatureService.getMissingFeatures(this.playerCharacter, this.getFilters()).then((features: FeatureListObject[]) => {
      this.feats = this.convertListToMenuItems(features);
      this.loading = false;
    });
  }

  private getFilters(): Filters {
    const filters = this.featureFilterService.initializeFilters(null);
    filters.filterValues.forEach((filterValue: FilterValue) => {
      if (filterValue.key === FilterKey.FEATURE_CATEGORY) {
        filterValue.value = 'FEAT';
      }
    });
    return filters;
  }

  private convertListToMenuItems(features: FeatureListObject[]): FeatureMenuItem[] {
    const list: FeatureMenuItem[] = [];
    features.forEach((feature: FeatureListObject) => {
      if (!this.isSelectedInAnotherPage(feature)) {
        const menuItem = new FeatureMenuItem(feature);
        menuItem.tags = this.barTagService.initializeTags(feature.tags, this.playerCharacter.creatureFeatures.tags);
        menuItem.selected = this.page.feat != null && feature.id === this.page.feat.id;
        list.push(menuItem);
      }
    });
    return list;
  }

  private isSelectedInAnotherPage(feature: FeatureListObject): boolean {
    for (let i = 0; i < this.pages.length; i++) {
      if (this.page !== this.pages[i] && this.pages[i].feat != null && this.pages[i].feat.id === feature.id) {
        return true;
      }
    }
    return false;
  }

  featureClick(featureMenuItem: FeatureMenuItem): void {
    this.viewingFeature = featureMenuItem;
  }

  toggleSelected(feature: FeatureMenuItem): void {
    if (!feature.selected) {
      this.feats.forEach((menuItem: FeatureMenuItem) => {
        menuItem.selected = false;
      });
    }
    feature.selected = !feature.selected;
    this.viewingFeature = null;
  }

  addFeatureClose(): void {
    this.viewingFeature = null;
  }

  closeDetails(): void {
    this.cancel.emit();
  }

  saveClick(): void {
    this.page.feat = this.getSelectedFeat();
    this.save.emit();
  }

  private getSelectedFeat(): FeatureListObject {
    for (let i = 0; i < this.feats.length; i++) {
      const feat = this.feats[i];
      if (feat.selected) {
        return feat.feature;
      }
    }
    return null;
  }

}
