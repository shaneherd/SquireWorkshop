import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Tag} from '../../../../shared/models/tag';
import {PowerTagList} from '../../../../shared/models/powers/power-tag-list';
import {TagConfiguration} from '../../../../shared/models/creatures/tag-configuration';
import {Creature} from '../../../../shared/models/creatures/creature';
import {CreatureService} from '../../../../core/services/creatures/creature.service';
import {PowerTags} from '../../../../shared/models/powers/power-tags';
import {MatCheckboxChange} from '@angular/material/checkbox';

@Component({
  selector: 'app-power-tagging-configuration-slide-in',
  templateUrl: './power-tagging-configuration-slide-in.component.html',
  styleUrls: ['./power-tagging-configuration-slide-in.component.scss']
})
export class PowerTaggingConfigurationSlideInComponent implements OnInit {
  @Input() creature: Creature;
  @Input() powerId: string;
  @Input() tags: Tag[] = [];
  @Input() selectedTags: Tag[] = [];
  @Output() save = new EventEmitter();
  @Output() close = new EventEmitter();

  tagConfigurations: TagConfiguration[] = [];

  constructor(
    private creatureService: CreatureService
  ) { }

  ngOnInit() {
    this.initializeTags();
  }

  private initializeTags(): void {
    this.tagConfigurations = [];

    this.tags.forEach((tag: Tag) => {
      const configuration = new TagConfiguration();
      configuration.tag = tag;
      configuration.checked = this.isSelected(tag);
      this.tagConfigurations.push(configuration);
    });
  }

  private isSelected(tag: Tag): boolean {
    for (let i = 0; i < this.selectedTags.length; i++) {
      if (this.selectedTags[i].id === tag.id) {
        return true;
      }
    }
    return false;
  }

  closeClick(): void {
    this.close.emit();
  }

  checkChange(event: MatCheckboxChange, configuration: TagConfiguration): void {
    configuration.checked = event.checked;
  }

  saveClick(): void {
    const powerTagList: PowerTagList = new PowerTagList();
    const powerTag: PowerTags = new PowerTags();
    powerTag.powerId = this.powerId;
    powerTagList.powerTags.push(powerTag);

    this.tagConfigurations.forEach((configuration: TagConfiguration) => {
      if (configuration.checked) {
        powerTag.tags.push(configuration.tag);
      }
    });

    this.creatureService.updatePowerTags(this.creature, powerTagList).then(() => {
      this.save.emit(powerTag.tags);
    });
  }
}
