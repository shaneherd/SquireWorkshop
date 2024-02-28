import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {PlayerCharacter} from '../../../../shared/models/creatures/characters/player-character';
import {CreatureConfigurationCollection} from '../../../../shared/models/creatures/configs/creature-configuration-collection';
import {Tag} from '../../../../shared/models/tag';
import {CreatureService} from '../../../../core/services/creatures/creature.service';
import * as _ from 'lodash';
import {TagList} from '../../../../shared/models/tag-list';
import {PowerTagList} from '../../../../shared/models/powers/power-tag-list';
import {TagPowers} from '../../../../shared/models/powers/tag-powers';
import {CreatureFeature} from '../../../../shared/models/creatures/creature-feature';
import {CreatureFeatureTagConfigurationCollection} from '../../../../shared/models/creatures/creature-feature-tag-configuration-collection';
import {CreatureFeatureTagConfiguration} from '../../../../shared/models/creatures/creature-feature-tag-configuration';
import {EVENTS} from '../../../../constants';
import {Subscription} from 'rxjs';
import {EventsService} from '../../../../core/services/events.service';

@Component({
  selector: 'app-feature-tagging-configuration-slide-in',
  templateUrl: './feature-tagging-configuration-slide-in.component.html',
  styleUrls: ['./feature-tagging-configuration-slide-in.component.scss']
})
export class FeatureTaggingConfigurationSlideInComponent implements OnInit, OnDestroy {
  @Input() playerCharacter: PlayerCharacter;
  @Input() collection: CreatureConfigurationCollection;
  @Output() save = new EventEmitter();
  @Output() close = new EventEmitter();

  eventSub: Subscription;
  tags: CreatureFeatureTagConfigurationCollection[] = [];

  viewingFeature: CreatureFeature = null;
  viewingTag: Tag = null;

  constructor(
    private creatureService: CreatureService,
    private eventsService: EventsService
  ) { }

  ngOnInit() {
    this.initializeTags();

    this.eventSub = this.eventsService.events.subscribe(event => {
      if (event === EVENTS.UpdateFeatureList) {
        this.updateFeaturesList();
      }
    });
  }

  ngOnDestroy() {
    this.eventSub.unsubscribe();
  }

  private initializeTags(): void {
    this.tags = [];

    const uniqueFeatures: CreatureFeature[] = this.getUniqueFeatures();
    this.playerCharacter.creatureFeatures.tags.forEach((tag: Tag) => {
      const configuration: CreatureFeatureTagConfigurationCollection = new CreatureFeatureTagConfigurationCollection();
      configuration.tag = _.cloneDeep(tag);

      const configurations: CreatureFeatureTagConfiguration[] = [];
      uniqueFeatures.forEach((creatureFeature: CreatureFeature) => {
        const featureConfiguration: CreatureFeatureTagConfiguration = new CreatureFeatureTagConfiguration();
        featureConfiguration.creatureFeature = _.cloneDeep(creatureFeature);
        featureConfiguration.checked = this.isChecked(creatureFeature, tag);
        configurations.push(featureConfiguration);
      });
      configuration.configurations = configurations;

      this.tags.push(configuration);
    });
  }

  private updateFeaturesList(): void {
    const uniqueFeatures: CreatureFeature[] = this.getUniqueFeatures();
    this.tags.forEach((config: CreatureFeatureTagConfigurationCollection) => {
      const configurations: CreatureFeatureTagConfiguration[] = [];
      uniqueFeatures.forEach((creatureFeature: CreatureFeature) => {
        const featureConfiguration: CreatureFeatureTagConfiguration = new CreatureFeatureTagConfiguration();
        featureConfiguration.creatureFeature = _.cloneDeep(creatureFeature);
        featureConfiguration.checked = this.isChecked(creatureFeature, config.tag);
        configurations.push(featureConfiguration);
      });
      config.configurations = configurations;
    });
  }

  private getUniqueFeatures(): CreatureFeature[] {
    const creatureFeatures: CreatureFeature[] = [];
    this.playerCharacter.creatureFeatures.features.forEach((creatureFeature: CreatureFeature) => {
      if (!this.inList(creatureFeature, creatureFeatures)) {
        creatureFeatures.push(creatureFeature);
      }
    });
    return creatureFeatures;
  }

  private inList(creatureFeature: CreatureFeature, creatureFeatures: CreatureFeature[]): boolean {
    for (let i = 0; i < creatureFeatures.length; i++) {
      if (creatureFeatures[i].feature.id === creatureFeature.feature.id) {
        return true;
      }
    }
    return false;
  }

  isChecked(creatureFeature: CreatureFeature, tag: Tag): boolean {
    for (let i = 0; i < creatureFeature.feature.tags.length; i++) {
      if (creatureFeature.feature.tags[i].id === tag.id) {
        return true;
      }
    }
    return false;
  }

  tagClick(tagCollection: CreatureFeatureTagConfigurationCollection): void {
    this.viewingTag = tagCollection.tag;
  }

  applyTag(): void {
    this.viewingTag = null;
  }

  closeTag(): void {
    this.viewingTag = null;
  }

  featureClick(creatureFeature: CreatureFeature): void {
    this.viewingFeature = creatureFeature;
  }

  closeFeatureDetails(): void {
    this.viewingFeature = null;
  }

  saveClick(): void {
    const tagList: TagList = new TagList();
    const powerTagList: PowerTagList = new PowerTagList();

    this.tags.forEach((tagConfigurationCollection: CreatureFeatureTagConfigurationCollection) => {
      tagList.tags.push(tagConfigurationCollection.tag);

      const tagPowers: TagPowers = new TagPowers();
      tagPowers.tagId = tagConfigurationCollection.tag.id;
      powerTagList.tagPowers.push(tagPowers);

      tagConfigurationCollection.configurations.forEach((configuration: CreatureFeatureTagConfiguration) => {
        if (configuration.checked) {
          tagPowers.powerIds.push(configuration.creatureFeature.feature.id);
        }
      });
    });

    this.creatureService.updateTags(this.playerCharacter, tagList).then(() => {
      this.playerCharacter.creatureFeatures.tags = tagList.tags;

      this.creatureService.updatePowerTags(this.playerCharacter, powerTagList).then(() => {
        this.eventsService.dispatchEvent(EVENTS.FeatureTagsUpdated);
        this.save.emit();
      });
    });
  }

  closeClick(): void {
    this.close.emit();
  }
}
