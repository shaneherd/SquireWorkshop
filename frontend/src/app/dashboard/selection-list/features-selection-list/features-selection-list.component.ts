import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FeatureListObject} from '../../../shared/models/powers/feature-list-object';
import {PlayerCharacter} from '../../../shared/models/creatures/characters/player-character';
import {TranslateService} from '@ngx-translate/core';
import {FilterDialogData} from '../../../core/components/filters/filter-dialog-data';
import {Filters} from '../../../core/components/filters/filters';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {FeatureFilterDialogComponent} from '../../../core/components/filters/feature-filter-dialog/feature-filter-dialog.component';
import {CreatureService} from '../../../core/services/creatures/creature.service';
import {CharacterService} from '../../../core/services/creatures/character.service';
import {CreatureConfigurationCollection} from '../../../shared/models/creatures/configs/creature-configuration-collection';
import {BarTagService} from '../../../core/services/bar-tag.service';
import {EVENTS} from '../../../constants';
import {EventsService} from '../../../core/services/events.service';
import {Subscription} from 'rxjs';
import {BarTagConfiguration} from '../../../shared/models/bar-tag-configuration';
import {SpellMenuItem} from '../spell-selection-list/spell-selection-list.component';

export class FeatureMenuItem {
  feature: FeatureListObject;
  selected = false;
  tags: BarTagConfiguration[] = [];

  constructor(feature: FeatureListObject, selected: boolean = false) {
    this.feature = feature;
    this.selected = selected;
  }
}

@Component({
  selector: 'app-features-selection-list',
  templateUrl: './features-selection-list.component.html',
  styleUrls: ['./features-selection-list.component.scss']
})
export class FeaturesSelectionListComponent implements OnInit, OnDestroy {
  @Input() playerCharacter: PlayerCharacter;
  @Input() collection: CreatureConfigurationCollection;
  @Output() save = new EventEmitter();
  @Output() close = new EventEmitter();

  headerName = '';
  loading = false;
  features = new Map<string, FeatureMenuItem>();
  filteredFeatures: FeatureMenuItem[] = [];
  filters: Filters;
  viewingFeature: FeatureMenuItem = null;
  eventSub: Subscription;
  selectedCount = 0;

  constructor(
    private dialog: MatDialog,
    private translate: TranslateService,
    private creatureService: CreatureService,
    private characterService: CharacterService,
    private barTagService: BarTagService,
    private eventsService: EventsService
  ) { }

  ngOnInit() {
    this.filters = new Filters();
    this.headerName = this.translate.instant('AddFeatures');
    this.initializeFeatures();

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
    this.features.forEach((menuItem: FeatureMenuItem) => {
      menuItem.tags = this.barTagService.initializeTags(menuItem.feature.tags, this.playerCharacter.creatureFeatures.tags);
    });
  }

  private initializeFeatures(): void {
    this.loading = true;
    this.creatureService.getMissingFeatures(this.playerCharacter, this.filters).then((features: FeatureListObject[]) => {
      this.setFeatures(features);
      this.filteredFeatures = this.getFullFeaturesList();
      this.loading = false;
    });
  }

  private setFeatures(features: FeatureListObject[]): void {
    this.features.clear();
    features.forEach((feature: FeatureListObject) => {
      const menuItem = new FeatureMenuItem(feature);
      menuItem.tags = this.barTagService.initializeTags(feature.tags, this.playerCharacter.creatureFeatures.tags);
      this.features.set(feature.id, menuItem);
    });
  }

  private getFullFeaturesList(): FeatureMenuItem[] {
    const list: FeatureMenuItem[] = [];
    this.features.forEach((feature: FeatureMenuItem, key: string) => {
      list.push(feature);
    });
    return list;
  }

  filter(): void {
    const self = this;
    const data = new FilterDialogData();
    data.filters = this.filters;
    data.tags = this.playerCharacter.creatureFeatures.tags;
    data.apply = (filters: Filters) => {
      self.applyFilters(filters);
    };
    data.clear = () => {
      self.applyFilters(new Filters());
    };

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = data;
    this.dialog.open(FeatureFilterDialogComponent, dialogConfig);
  }

  private applyFilters(filters: Filters): void {
    this.filters = filters;
    this.creatureService.getMissingFeatures(this.playerCharacter, this.filters).then((features: FeatureListObject[]) => {
       this.filteredFeatures = this.getFilteredFeatures(features);
    });
  }

  private getFilteredFeatures(features: FeatureListObject[]): FeatureMenuItem[] {
    const filtered: FeatureMenuItem[] = [];
    features.forEach((feature: FeatureListObject) => {
      filtered.push(this.features.get(feature.id));
    });
    return filtered;
  }

  search(searchValue: string): void {
    if (searchValue.length === 0) {
      this.filteredFeatures = this.getFullFeaturesList(); //todo - this clears out the filters
    } else {
       const filtered: FeatureMenuItem[] = [];
       const search = searchValue.toLowerCase();
       this.features.forEach((featureMenuItem: FeatureMenuItem) => {
         if (featureMenuItem.feature.name.toLowerCase().indexOf(search) > -1) {
           filtered.push(featureMenuItem);
         }
       });
       this.filteredFeatures = filtered;
    }
  }

  featureClick(item: FeatureMenuItem): void {
    this.viewingFeature = item;
  }

  toggleSelected(feature: FeatureMenuItem): void {
    feature.selected = !feature.selected;
    this.viewingFeature = null;
    if (feature.selected) {
      this.selectedCount++;
    } else {
      this.selectedCount--;
    }
  }

  checkChange(feature: FeatureMenuItem): void {
    if (feature.selected) {
      this.selectedCount++;
    } else {
      this.selectedCount--;
    }
  }

  closeDetails(): void {
    this.viewingFeature = null;
  }

  selectAll(): void {
    if (this.selectedCount > 0) {
      this.features.forEach((featureMenuItem: FeatureMenuItem) => {
        featureMenuItem.selected = false;
      });
      this.selectedCount = 0;
    } else {
      this.filteredFeatures.forEach((featureMenuItem: FeatureMenuItem) => {
        if (!featureMenuItem.selected) {
          featureMenuItem.selected = true;
          this.selectedCount++;
        }
      });
    }
  }

  addSelected(): void {
    this.loading = true;
    const selectedFeatures: FeatureListObject[] = this.getSelectedFeatures();
    if (selectedFeatures.length > 0) {
      this.characterService.addFeatures(this.playerCharacter, selectedFeatures, this.collection).then(() => {
        this.loading = false;
        this.save.emit();
      });
    } else {
      this.loading = false;
      this.close.emit();
    }
  }

  private getSelectedFeatures(): FeatureListObject[] {
    const selectedFeatures: FeatureListObject[] = [];
    this.features.forEach((feature: FeatureMenuItem, key: string) => {
      if (feature.selected) {
        selectedFeatures.push(feature.feature);
      }
    });
    return selectedFeatures;
  }

  closeClick(): void {
    this.close.emit();
  }
}
