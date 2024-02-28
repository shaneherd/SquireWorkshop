import {Injectable} from '@angular/core';
import {SpellConfigurationCollection} from '../../../shared/models/spell-configuration-collection';
import {Characteristic} from '../../../shared/models/characteristics/characteristic';
import {SpellConfiguration} from '../../../shared/models/characteristics/spell-configuration';
import {
  InnateSpellConfigurationCollectionItem,
  SpellConfigurationCollectionItem
} from '../../../shared/models/spell-configuration-collection-item';
import {ListObject} from '../../../shared/models/list-object';
import {CharacterLevelService} from '../character-level.service';
import {DamageConfigurationCollection} from '../../../shared/models/damage-configuration-collection';
import * as _ from 'lodash';
import {DamageConfiguration} from '../../../shared/models/damage-configuration';
import {PowerService} from './power.service';
import {InnateSpellConfiguration} from '../../../shared/models/creatures/monsters/monster';

@Injectable({
  providedIn: 'root'
})
export class SpellConfigurationService {

  constructor(
    private characterLevelService: CharacterLevelService,
    private powerService: PowerService
  ) { }

  combineSpellConfigurations(collections: SpellConfigurationCollection[]): SpellConfigurationCollection {
    const combined = new SpellConfigurationCollection();
    collections.forEach((collection: SpellConfigurationCollection) => {
      if (combined.spellcastingAbility === '0') {
        combined.spellcastingAbility = collection.spellcastingAbility;
      }
      if (combined.casterType === '0') {
        combined.casterType = collection.casterType;
      }
      combined.levels = collection.levels;
      //todo - ? - collection.spellConfigurations
    });
    return combined;
  }

  initializeSpellConfigurations(characteristic: Characteristic, parent: Characteristic, includeInherited: boolean): Promise<SpellConfigurationCollection> {
    const spellConfigurationCollection = new SpellConfigurationCollection();
    if (characteristic.spellCastingAbility === '0' && parent != null) {
      spellConfigurationCollection.spellcastingAbility = parent.spellCastingAbility;
    } else {
      spellConfigurationCollection.spellcastingAbility = characteristic.spellCastingAbility;
    }
    if (spellConfigurationCollection.spellcastingAbility == null) {
      spellConfigurationCollection.spellcastingAbility = '0';
    }

    characteristic.spellConfigurations.forEach((spellConfiguration: SpellConfiguration) => {
      spellConfigurationCollection.spellConfigurations.push(this.getSpellConfigurationItem(spellConfiguration))
    });

    if (includeInherited) {
      this.updateInheritedConfigurations(spellConfigurationCollection, parent, true);
    }

    return this.characterLevelService.getLevels().then((levels: ListObject[]) => {
      const noLevel = new ListObject('0', '');
      levels = levels.slice(0);
      levels.unshift(noLevel);
      spellConfigurationCollection.levels = levels;
      return spellConfigurationCollection;
    });
  }

  addSpellConfigurations(spellConfigurationCollection: SpellConfigurationCollection, spells: ListObject[]): void {
    spells.forEach((spell: ListObject) => {
      const config = new SpellConfigurationCollectionItem();
      config.spell = spell;
      config.author = true;
      config.levelGained = new ListObject();
      spellConfigurationCollection.spellConfigurations.push(config);
    });

    this.sortConfigurations(spellConfigurationCollection);
  }

  addInnateSpellConfigurations(spellConfigurationCollection: SpellConfigurationCollection, spells: ListObject[]): void {
    spells.forEach((spell: ListObject) => {
      const config = new InnateSpellConfigurationCollectionItem();
      config.spell = spell;
      config.author = true;
      config.slot = 0;
      spellConfigurationCollection.innateSpellConfigurations.push(config);
    });

    this.sortConfigurations(spellConfigurationCollection);
  }

  sortConfigurations(spellConfigurationCollection: SpellConfigurationCollection): void {
    spellConfigurationCollection.spellConfigurations
      .sort(function(left: SpellConfigurationCollectionItem, right: SpellConfigurationCollectionItem) {
        const leftSpell = left.parent == null ? left.spell : left.parent.spell;
        const rightSpell = right.parent == null ? right.spell : right.parent.spell;
        return leftSpell.name.localeCompare(rightSpell.name);
      });
  }

  getSpellConfigurationItem(spellConfiguration: SpellConfiguration): SpellConfigurationCollectionItem {
    const config = new SpellConfigurationCollectionItem();
    config.spell = spellConfiguration.spell;
    config.levelGained = spellConfiguration.levelGained == null ? new ListObject('0', '') : spellConfiguration.levelGained;
    config.alwaysPrepared = spellConfiguration.alwaysPrepared;
    config.countTowardsPrepared = spellConfiguration.countTowardsPrepared;
    config.notes = spellConfiguration.notes;
    config.author = spellConfiguration.author;
    return config;
  }

  removeParentConfigurations(collection: SpellConfigurationCollection): void {
    const list: SpellConfigurationCollectionItem[] = collection.spellConfigurations;
    for (let i = 0; i < list.length; i++) {
      const config: SpellConfigurationCollectionItem = list[i];
      if (config.parent != null) {
        list.splice(i, 1);
        i--;
      }
    }
  }

  updateInheritedConfigurations(collection: SpellConfigurationCollection, parent: Characteristic, includeSpellConfigurations: boolean): void {
    this.removeParentConfigurations(collection);
    if (parent != null) {
      if (includeSpellConfigurations) {
        parent.spellConfigurations.forEach((spellConfiguration: SpellConfiguration) => {
          let config = this.getConfiguration(spellConfiguration.spell.id, collection);
          if (config == null) {
            config = new SpellConfigurationCollectionItem();
            collection.spellConfigurations.push(config);
          }
          config.parent = this.getSpellConfigurationItem(spellConfiguration);
          config.spell = config.parent.spell;
        });
      }
      if (collection.spellcastingAbility === '0') {
        collection.spellcastingAbility = parent.spellCastingAbility;
      }
    }
    this.sortConfigurations(collection);
  }

  private getConfiguration(spellId: string, collection: SpellConfigurationCollection): SpellConfigurationCollectionItem {
    for (let i = 0; i < collection.spellConfigurations.length; i++) {
      const config = collection.spellConfigurations[i];
      if (config.spell.id === spellId) {
        return config;
      }
    }
    return null;
  }

  setSpellConfigurations(spellConfigurationCollection: SpellConfigurationCollection, characteristic: Characteristic): void {
    characteristic.spellCastingAbility = spellConfigurationCollection.spellcastingAbility;
    const spellConfigurations: SpellConfiguration[] = [];
    spellConfigurationCollection.spellConfigurations.forEach((spellConfigurationCollectionItem: SpellConfigurationCollectionItem) => {
      if (spellConfigurationCollectionItem.parent == null) {
        const config = new SpellConfiguration();
        config.spell = spellConfigurationCollectionItem.spell;
        const levelId = spellConfigurationCollectionItem.levelGained == null ? null : spellConfigurationCollectionItem.levelGained.id;
        config.levelGained = this.getLevel(levelId, spellConfigurationCollection.levels);
        config.alwaysPrepared = spellConfigurationCollectionItem.alwaysPrepared;
        config.countTowardsPrepared = spellConfigurationCollectionItem.countTowardsPrepared;
        config.notes = spellConfigurationCollectionItem.notes;
        config.author = spellConfigurationCollectionItem.author;
        spellConfigurations.push(config);
      }
    });
    characteristic.spellConfigurations = spellConfigurations;
  }

  getSpellConfiguration(spellConfigurationCollectionItem: SpellConfigurationCollectionItem): SpellConfiguration {
    const config = new SpellConfiguration();
    config.spell = spellConfigurationCollectionItem.spell;
    const levelId = spellConfigurationCollectionItem.levelGained == null ? null : spellConfigurationCollectionItem.levelGained.id;
    config.levelGained = new ListObject(levelId, '');
    config.alwaysPrepared = spellConfigurationCollectionItem.alwaysPrepared;
    config.countTowardsPrepared = spellConfigurationCollectionItem.countTowardsPrepared;
    config.notes = spellConfigurationCollectionItem.notes;
    config.author = spellConfigurationCollectionItem.author;
    return config;
  }

  getInnateSpellConfiguration(spellConfigurationCollectionItem: InnateSpellConfigurationCollectionItem): InnateSpellConfiguration {
    const config = new InnateSpellConfiguration();
    config.spell = spellConfigurationCollectionItem.spell;
    config.limitedUse = spellConfigurationCollectionItem.limitedUse;
    config.slot = spellConfigurationCollectionItem.slot;
    config.author = spellConfigurationCollectionItem.author;
    return config;
  }

  private getLevel(id: string, levels: ListObject[]): ListObject {
    if (id == null || id === '0') {
      return null;
    }
    for (let i = 0; i < levels.length; i++) {
      const level: ListObject = levels[i];
      if (level.id === id) {
        return level;
      }
    }
    return null;
  }

  setAllSpellConfigs(characteristic: Characteristic): void {
    if (characteristic == null) {
      return;
    }
    characteristic.spellConfigurations = this.getAllSpellConfigurations(characteristic);
  }

  getAllSpellConfigurations(characteristic: Characteristic): SpellConfiguration[] {
    let configs: SpellConfiguration[] = [];
    if (characteristic.parent) {
      configs = this.getAllSpellConfigurations(characteristic.parent);
    }
    characteristic.spellConfigurations.forEach((config: SpellConfiguration) => {
      configs.push(config);
    });
    return configs;
  }

  getDamageForSelectedLevel(collection: DamageConfigurationCollection, spellLevel: number, selectedSlot: number): DamageConfigurationCollection {
    if (collection == null) {
      return null;
    }

    const config = _.cloneDeep(collection);
    if (selectedSlot > spellLevel) {
      if (config.extraDamage && config.numLevelsAboveBase > 0) {
        const numSteps = (selectedSlot - spellLevel) / config.numLevelsAboveBase;
        for (let i = 0; i < numSteps; i++) {
          config.extraDamageConfigurations.forEach((damage: DamageConfiguration) => {
            config.damageConfigurations.push(damage);
          });
        }

        config.damageConfigurations = this.powerService.combineDamages(config.damageConfigurations);
      }
    }

    config.extraDamage = false;
    return config;
  }
}
