import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SpellConfigurationCollection} from '../../../../shared/models/spell-configuration-collection';
import {
  InnateSpellConfigurationCollectionItem,
  SpellConfigurationCollectionItem
} from '../../../../shared/models/spell-configuration-collection-item';
import {SpellService} from '../../../../core/services/powers/spell.service';
import {TranslateService} from '@ngx-translate/core';
import {SpellConfigurationService} from '../../../../core/services/powers/spell-configuration.service';
import {ListObject} from '../../../../shared/models/list-object';
import {MonsterService} from '../../../../core/services/creatures/monster.service';
import {Monster} from '../../../../shared/models/creatures/monsters/monster';

@Component({
  selector: 'app-monster-spell-configuration-list',
  templateUrl: './monster-spell-configuration-list.component.html',
  styleUrls: ['./monster-spell-configuration-list.component.scss']
})
export class MonsterSpellConfigurationListComponent implements OnInit {
  @Input() monster: Monster;
  @Input() spellConfigurationCollection: SpellConfigurationCollection;
  @Input() editing: boolean;
  @Input() isPublic = false;
  @Input() isShared = false;
  @Input() innate = false;

  @Output() configListUpdated = new EventEmitter();

  addingSpells = false;
  dontAutoGain: string;
  configuringItem: SpellConfigurationCollectionItem = null;
  configuringInnateItem: InnateSpellConfigurationCollectionItem = null;

  constructor(
    private spellService: SpellService,
    private translate: TranslateService,
    private monsterService: MonsterService,
    private spellConfigurationService: SpellConfigurationService
  ) { }

  ngOnInit() {
    this.dontAutoGain = this.translate.instant('Navigation.Manage.Spells.DontAutoGain');
  }

  getSpellName(config: SpellConfigurationCollectionItem): string {
    return config.parent == null ? config.spell.name : config.parent.spell.name;
  }

  isDisabled(config: SpellConfigurationCollectionItem): boolean {
    return config.parent != null;
  }

  spellClick(config: SpellConfigurationCollectionItem): void {
    if (this.configuringItem == null && !this.addingSpells) {
      this.configuringItem = config;
    }
  }

  innateSpellClick(config: InnateSpellConfigurationCollectionItem): void {
    if (this.configuringInnateItem == null && !this.addingSpells) {
      this.configuringInnateItem = config;
    }
  }

  addSpells(): void {
    if (this.configuringItem == null && !this.editing) {
      this.addingSpells = true;
    }
  }

  cancelAddSpells(): void {
    this.addingSpells = false;
  }

  continueAddSpells(selectedSpells: ListObject[]): void {
    if (this.innate) {
      this.monsterService.addInnateSpells(this.monster, selectedSpells).then(() => {
        this.spellConfigurationService.addInnateSpellConfigurations(this.spellConfigurationCollection, selectedSpells);
        this.addingSpells = false;
        this.configListUpdated.emit();
      });
    } else {
      this.monsterService.addSpells(this.monster, selectedSpells).then(() => {
        this.spellConfigurationService.addSpellConfigurations(this.spellConfigurationCollection, selectedSpells);
        this.addingSpells = false;
        this.configListUpdated.emit();
      });
    }
  }

  updateSpellConfiguration(config: SpellConfigurationCollectionItem): void {
    const spellConfiguration = this.spellConfigurationService.getSpellConfiguration(config);
    this.monsterService.updateSpellConfiguration(this.monster, spellConfiguration).then(() => {
      this.configuringItem = null;
      this.configListUpdated.emit();
    });
  }

  updateInnateSpellConfiguration(config: InnateSpellConfigurationCollectionItem): void {
    const spellConfiguration = this.spellConfigurationService.getInnateSpellConfiguration(config);
    this.monsterService.updateInnateSpellConfiguration(this.monster, spellConfiguration).then(() => {
      this.configuringInnateItem = null;
      this.configListUpdated.emit();
    });
  }

  deleteSpell(config: SpellConfigurationCollectionItem): void {
    const index = this.spellConfigurationCollection.spellConfigurations.indexOf(config);
    if (index > -1) {
      this.spellConfigurationCollection.spellConfigurations.splice(index, 1);
      this.monsterService.deleteSpell(this.monster, config.spell.id).then(() => {
        this.configuringItem = null;
        this.configListUpdated.emit();
      });
    }
  }

  deleteInnateSpell(config: InnateSpellConfigurationCollectionItem): void {
    const index = this.spellConfigurationCollection.innateSpellConfigurations.indexOf(config);
    if (index > -1) {
      this.spellConfigurationCollection.innateSpellConfigurations.splice(index, 1);
      this.monsterService.deleteInnateSpell(this.monster, config.spell.id).then(() => {
        this.configuringInnateItem = null;
        this.configListUpdated.emit();
      });
    }
  }

  cancelConfiguration(): void {
    this.configuringItem = null;
    this.configuringInnateItem = null;
  }
}
