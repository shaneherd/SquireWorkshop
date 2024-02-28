import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {PlayerCharacter} from '../../../../shared/models/creatures/characters/player-character';
import {CreatureConfigurationCollection} from '../../../../shared/models/creatures/configs/creature-configuration-collection';
import {Tag} from '../../../../shared/models/tag';
import * as _ from 'lodash';
import {CreatureSpell} from '../../../../shared/models/creatures/creature-spell';
import {PowerModifier} from '../../../../shared/models/powers/power-modifier';
import {CreatureService} from '../../../../core/services/creatures/creature.service';
import {CreatureSpellTagConfigurationCollection} from '../../../../shared/models/creatures/creature-spell-tag-configuration-collection';
import {CreatureSpellTagConfiguration} from '../../../../shared/models/creatures/creature-spell-tag-configuration';
import {TagList} from '../../../../shared/models/tag-list';
import {PowerTagList} from '../../../../shared/models/powers/power-tag-list';
import {TagPowers} from '../../../../shared/models/powers/tag-powers';
import {EVENTS} from '../../../../constants';
import {Subscription} from 'rxjs';
import {EventsService} from '../../../../core/services/events.service';
import {Creature} from '../../../../shared/models/creatures/creature';

@Component({
  selector: 'app-spell-tagging-configuration-slide-in',
  templateUrl: './spell-tagging-configuration-slide-in.component.html',
  styleUrls: ['./spell-tagging-configuration-slide-in.component.scss']
})
export class SpellTaggingConfigurationSlideInComponent implements OnInit, OnDestroy {
  @Input() creature: Creature;
  @Input() collection: CreatureConfigurationCollection;
  @Input() attackModifiers: Map<string, PowerModifier>;
  @Input() saveModifiers: Map<string, PowerModifier>;
  @Output() save = new EventEmitter();
  @Output() close = new EventEmitter();

  eventSub: Subscription;
  tags: CreatureSpellTagConfigurationCollection[] = [];

  viewingSpell: CreatureSpell = null;
  attackModifier: PowerModifier = null;
  saveModifier: PowerModifier = null;
  viewingTag: Tag = null;

  constructor(
    private creatureService: CreatureService,
    private eventsService: EventsService
  ) { }

  ngOnInit() {
    this.initializeTags();

    this.eventSub = this.eventsService.events.subscribe(event => {
      if (event === EVENTS.AbilityScoreChange
        || event === EVENTS.SpellcastingAbilityChange
        || event === EVENTS.ModifiersUpdated) {
        if (this.viewingSpell != null) {
          this.spellClick(this.viewingSpell);
        }
      } else if (event === EVENTS.UpdateSpellList) {
        this.updateSpellsList();
      }
    });
  }

  ngOnDestroy() {
    this.eventSub.unsubscribe();
  }

  private initializeTags(): void {
    this.tags = [];

    const uniqueSpells: CreatureSpell[] = this.getUniqueSpells();
    this.creature.creatureSpellCasting.tags.forEach((tag: Tag) => {
      const configuration: CreatureSpellTagConfigurationCollection = new CreatureSpellTagConfigurationCollection();
      configuration.tag = _.cloneDeep(tag);

      const configurations: CreatureSpellTagConfiguration[] = [];
      uniqueSpells.forEach((creatureSpell: CreatureSpell) => {
        const spellConfiguration: CreatureSpellTagConfiguration = new CreatureSpellTagConfiguration();
        spellConfiguration.creatureSpell = _.cloneDeep(creatureSpell);
        spellConfiguration.checked = this.isChecked(creatureSpell, tag);
        configurations.push(spellConfiguration);
      });
      configuration.configurations = configurations;

      this.tags.push(configuration);
    });
  }

  private updateSpellsList(): void {
    const uniqueSpells: CreatureSpell[] = this.getUniqueSpells();
    this.tags.forEach((config: CreatureSpellTagConfigurationCollection) => {
      const configurations: CreatureSpellTagConfiguration[] = [];
      uniqueSpells.forEach((creatureSpell: CreatureSpell) => {
        const spellConfiguration: CreatureSpellTagConfiguration = new CreatureSpellTagConfiguration();
        spellConfiguration.creatureSpell = _.cloneDeep(creatureSpell);
        spellConfiguration.checked = this.isChecked(creatureSpell, config.tag);
        configurations.push(spellConfiguration);
      });
      config.configurations = configurations;
    });
  }

  private getUniqueSpells(): CreatureSpell[] {
    const creatureSpells: CreatureSpell[] = [];
    this.creature.creatureSpellCasting.spells.forEach((creatureSpell: CreatureSpell) => {
      if (!this.inList(creatureSpell, creatureSpells)) {
        creatureSpells.push(creatureSpell);
      }
    });
    return creatureSpells;
  }

  private inList(creatureSpell: CreatureSpell, creatureSpells: CreatureSpell[]): boolean {
    for (let i = 0; i < creatureSpells.length; i++) {
      if (creatureSpells[i].spell.id === creatureSpell.spell.id) {
        return true;
      }
    }
    return false;
  }

  isChecked(creatureSpell: CreatureSpell, tag: Tag): boolean {
    for (let i = 0; i < creatureSpell.spell.tags.length; i++) {
      if (creatureSpell.spell.tags[i].id === tag.id) {
        return true;
      }
    }
    return false;
  }

  tagClick(tagCollection: CreatureSpellTagConfigurationCollection): void {
    this.viewingTag = tagCollection.tag;
  }

  applyTag(): void {
    this.viewingTag = null;
  }

  closeTag(): void {
    this.viewingTag = null;
  }

  spellClick(creatureSpell: CreatureSpell): void {
    this.attackModifier = this.attackModifiers.get(creatureSpell.assignedCharacteristic);
    this.saveModifier = this.saveModifiers.get(creatureSpell.assignedCharacteristic);
    this.viewingSpell = creatureSpell;
  }

  closeSpellDetails(): void {
    this.viewingSpell = null;
  }

  saveClick(): void {
    const tagList: TagList = new TagList();
    const powerTagList: PowerTagList = new PowerTagList();

    this.tags.forEach((tagConfigurationCollection: CreatureSpellTagConfigurationCollection) => {
      tagList.tags.push(tagConfigurationCollection.tag);

      const tagPowers: TagPowers = new TagPowers();
      tagPowers.tagId = tagConfigurationCollection.tag.id;
      powerTagList.tagPowers.push(tagPowers);

      tagConfigurationCollection.configurations.forEach((configuration: CreatureSpellTagConfiguration) => {
        if (configuration.checked) {
          tagPowers.powerIds.push(configuration.creatureSpell.spell.id);
        }
      });
    });

    this.creatureService.updateTags(this.creature, tagList).then(() => {
      this.creature.creatureSpellCasting.tags = tagList.tags;

      this.creatureService.updatePowerTags(this.creature, powerTagList).then(() => {
        this.save.emit();
      });
    });
  }

  closeClick(): void {
    this.close.emit();
  }

}
