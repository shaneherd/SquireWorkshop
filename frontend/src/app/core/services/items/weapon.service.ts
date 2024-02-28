import {Injectable} from '@angular/core';
import {DamageConfigurationCollection} from '../../../shared/models/damage-configuration-collection';
import {DamageConfiguration} from '../../../shared/models/damage-configuration';
import {Weapon} from '../../../shared/models/items/weapon';
import {WeaponPropertyConfigurationCollection} from '../../../shared/models/items/weapon-property-configuration-collection';
import {WeaponPropertyConfiguration} from '../../../shared/models/items/weapon-property-configuration';
import {WeaponPropertyService} from '../attributes/weapon-property.service';
import {ListObject} from '../../../shared/models/list-object';
import {WeaponProperty} from '../../../shared/models/attributes/weapon-property';
import {Ability} from '../../../shared/models/attributes/ability.model';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class WeaponService {

  constructor(
    private weaponPropertyService: WeaponPropertyService
  ) { }

  /****************************** Property Configurations *****************************/

  createCopyOfPropertyConfigurationCollection(collection: WeaponPropertyConfigurationCollection): WeaponPropertyConfigurationCollection {
    return _.cloneDeep(collection);
  }

  initializePropertyConfigurations(weapon: Weapon): Promise<WeaponPropertyConfigurationCollection> {
    if (weapon.properties == null) {
      weapon.properties = [];
    }
    const collection = new WeaponPropertyConfigurationCollection();
    return this.weaponPropertyService.getWeaponProperties().then((properties: ListObject[]) => {
      properties.forEach((property: ListObject) => {
        const config: WeaponPropertyConfiguration = new WeaponPropertyConfiguration();
        config.property = property;
        config.checked = this.isPropertyChecked(weapon, property);
        collection.configurations.push(config);
      });
      return collection;
    });
  }

  isPropertyChecked(weapon: Weapon, property: ListObject): boolean {
    for (let i = 0; i < weapon.properties.length; i++) {
      if (weapon.properties[i].id === property.id) {
        return true;
      }
    }
    return false;
  }

  setPropertyConfigurations(weapon: Weapon, collection: WeaponPropertyConfigurationCollection): void {
    const properties: WeaponProperty[] = [];
    collection.configurations.forEach((config: WeaponPropertyConfiguration) => {
      if (config.checked) {
        const property: WeaponProperty = new WeaponProperty();
        property.id = config.property.id;
        property.name = config.property.name;
        properties.push(property);
      }
    });
    weapon.properties = properties;
  }

  /****************************** Damage Configurations *****************************/

  createCopyOfDamageConfigurationCollection(collection: DamageConfigurationCollection): DamageConfigurationCollection {
    return _.cloneDeep(collection);
  }

  createCopyOfDamageConfiguration(config: DamageConfiguration): DamageConfiguration {
    return _.cloneDeep(config);
  }

  initializeDamageConfigurations(weapon: Weapon): DamageConfigurationCollection {
    const collection = new DamageConfigurationCollection();
    if (weapon.damages == null) {
      weapon.damages = [];
    }
    if (weapon.versatileDamages == null) {
      weapon.versatileDamages = [];
    }
    collection.damageConfigurations = this.getCollectionDamageConfigurations(weapon.damages.slice(0));
    collection.extraDamageConfigurations = this.getCollectionDamageConfigurations(weapon.versatileDamages.slice(0));
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

  setDamageConfigurations(weapon: Weapon, collection: DamageConfigurationCollection): void {
    weapon.damages = this.getFinialDamageConfigurations(collection.damageConfigurations, false);
    weapon.versatileDamages = this.getFinialDamageConfigurations(collection.extraDamageConfigurations, true);
  }

  getFinialDamageConfigurations(configs: DamageConfiguration[], versatile: boolean): DamageConfiguration[] {
    const list: DamageConfiguration[] = [];
    configs.forEach((config: DamageConfiguration) => {
      const damageConfig: DamageConfiguration = this.createCopyOfDamageConfiguration(config);
      if (damageConfig.values.abilityModifier.id === '0') {
        damageConfig.values.abilityModifier = null;
      }
      damageConfig.versatile = versatile;
      list.push(damageConfig);
    });
    return list;
  }
}
