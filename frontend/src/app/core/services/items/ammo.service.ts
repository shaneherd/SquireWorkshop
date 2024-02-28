import {Injectable} from '@angular/core';
import {DamageConfigurationCollection} from '../../../shared/models/damage-configuration-collection';
import {Ammo} from '../../../shared/models/items/ammo';
import {DamageConfiguration} from '../../../shared/models/damage-configuration';
import {Ability} from '../../../shared/models/attributes/ability.model';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class AmmoService {

  constructor() { }

  /****************************** Damage Configurations *****************************/

  createCopyOfDamageConfigurationCollection(collection: DamageConfigurationCollection): DamageConfigurationCollection {
    return _.cloneDeep(collection);
  }

  createCopyOfDamageConfiguration(config: DamageConfiguration): DamageConfiguration {
    return _.cloneDeep(config);
  }

  initializeDamageConfigurations(ammo: Ammo): DamageConfigurationCollection {
    const collection = new DamageConfigurationCollection();
    if (ammo.damages == null) {
      ammo.damages = [];
    }
    collection.damageConfigurations = this.getCollectionDamageConfigurations(ammo.damages.slice(0));
    return collection;
  }

  getCollectionDamageConfigurations(configs: DamageConfiguration[]): DamageConfiguration[] {
    const list = configs.slice(0);
    list.forEach((config: DamageConfiguration) => {
      if (config.values.abilityModifier == null) {
        config.values.abilityModifier = new Ability();
      }
    });
    return list;
  }

  setDamageConfigurations(ammo: Ammo, collection: DamageConfigurationCollection): void {
    ammo.damages = this.getFinialDamageConfigurations(collection.damageConfigurations);
  }

  getFinialDamageConfigurations(configs: DamageConfiguration[]): DamageConfiguration[] {
    const list: DamageConfiguration[] = [];
    configs.forEach((config: DamageConfiguration) => {
      const damageConfig: DamageConfiguration = this.createCopyOfDamageConfiguration(config);
      if (damageConfig.values.abilityModifier.id === '0') {
        damageConfig.values.abilityModifier = null;
      }
      list.push(damageConfig);
    });
    return list;
  }
}
