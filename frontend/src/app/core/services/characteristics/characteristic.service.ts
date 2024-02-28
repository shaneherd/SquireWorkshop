import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Characteristic} from '../../../shared/models/characteristics/characteristic';
import {ListObject} from '../../../shared/models/list-object';
import {CharacteristicType} from '../../../shared/models/characteristics/characteristic-type.enum';
import * as _ from 'lodash';
import {DamageModifierCollection} from '../../../shared/models/damage-modifier-collection';
import {DamageModifier} from '../../../shared/models/characteristics/damage-modifier';
import {DamageModifierCollectionItem} from '../../../shared/models/damage-modifier-collection-item';
import {DamageModifierType} from '../../../shared/models/characteristics/damage-modifier-type.enum';
import {DamageType} from '../../../shared/models/attributes/damage-type';
import {ProficiencyCollection} from '../../../shared/models/proficiency-collection';
import {SpellConfigurationCollection} from '../../../shared/models/spell-configuration-collection';
import {CharacteristicConfigurationCollection} from '../../../shared/models/characteristics/characteristic-configuration-collection';
import {TranslateService} from '@ngx-translate/core';
import {DamageTypeService} from '../attributes/damage-type.service';
import {ProficienciesService} from '../proficiency.service';
import {ConditionImmunityConfigurationCollection} from '../../../shared/models/condition-immunity-configuration-collection';
import {ConditionService} from '../attributes/condition.service';
import {ConditionImmunityConfigurationCollectionItem} from '../../../shared/models/condition-immunity-configuration-collection-item';
import {SenseConfigurationCollection} from '../../../shared/models/sense-configuration-collection';
import {SenseValue} from '../../../shared/models/sense-value';
import {SenseConfigurationCollectionItem} from '../../../shared/models/sense-configuration-collection-item';
import {Sense} from '../../../shared/models/sense.enum';
import {StartingEquipmentConfigurationCollection} from '../../../shared/models/startingEquipment/starting-equipment-configuration-collection';
import {MiscModifierConfigurationCollection} from '../../../shared/models/misc-modifier-configuration-collection';
import {AttributeService} from '../attributes/attribute.service';
import {MiscModifierConfigurationCollectionItem} from '../../../shared/models/misc-modifier-configuration-collection-item';
import {Modifier} from '../../../shared/models/modifier';
import {Attribute} from '../../../shared/models/attributes/attribute';
import {StartingEquipment} from '../../../shared/models/startingEquipment/starting-equipment';
import {StartingEquipmentItemGroup} from '../../../shared/models/startingEquipment/starting-equipment-item-group';
import {StartingEquipmentItemGroupOption} from '../../../shared/models/startingEquipment/starting-equipment-item-group-option';
import {StartingEquipmentItemGroupOptionItem} from '../../../shared/models/startingEquipment/starting-equipment-item-group-option-item';
import {InUseService} from '../../../dashboard/view-edit/view-edit.component';
import {Feature} from '../../../shared/models/powers/feature';
import {InUse} from '../../../shared/models/inUse/in-use';
import {PowerList} from '../../../shared/models/powers/power-list';
import {SpellConfiguration} from '../../../shared/models/characteristics/spell-configuration';
import {SpellConfigurationList} from '../../../shared/models/powers/spell-configuration-list';
import {BackgroundTrait} from '../../../shared/models/characteristics/background-trait';
import {environment} from '../../../../environments/environment';
import {ListSource} from '../../../shared/models/list-source.enum';
import {PublishRequest} from '../../../shared/models/publish-request';
import {PublishDetails} from '../../../shared/models/publish-details';
import {VersionInfo} from '../../../shared/models/version-info';
import {SpellConfigurationService} from '../powers/spell-configuration.service';
import {ManageService} from '../../../shared/components/manage-list/manage-list.component';

class ItemByTypeCollection {
  CLASS: ListObject[] = [];
  RACE: ListObject[] = [];
  BACKGROUND: ListObject[] = [];
}

@Injectable({
  providedIn: 'root'
})
export class CharacteristicService implements InUseService, ManageService {
  private itemsByType = new ItemByTypeCollection();
  private publicItemsByType = new ItemByTypeCollection();
  private privateItemsByType = new ItemByTypeCollection();
  private characteristicSpellConfigurations = new Map<string, SpellConfiguration[]>();

  constructor(
    private http: HttpClient,
    private damageTypeService: DamageTypeService,
    private conditionService: ConditionService,
    private proficienciesService: ProficienciesService,
    private spellConfigurationService: SpellConfigurationService,
    private translate: TranslateService,
    private attributeService: AttributeService
  ) {
  }

  clearItemsByType(characteristicType: CharacteristicType, listSource: ListSource): void {
    switch (listSource) {
      case ListSource.MY_STUFF:
        this.itemsByType[characteristicType] = [];
        break;
      case ListSource.PUBLIC_CONTENT:
        this.publicItemsByType[characteristicType] = [];
        break;
      case ListSource.PRIVATE_CONTENT:
        this.privateItemsByType[characteristicType] = [];
        break;
    }
  }

  createCharacteristic(characteristic: Characteristic): Promise<string> {
    const options = {
      responseType: 'text' as 'json'
    };
    return this.http.put<string>(environment.backendUrl + '/characteristics', characteristic, options).toPromise();
  }

  getPublishDetails(characteristic: Characteristic): Promise<PublishDetails> {
    return this.http.get<PublishDetails>(`${environment.backendUrl}/characteristics/${characteristic.id}/published`).toPromise();
  }

  getVersionInfo(characteristicId: string): Promise<VersionInfo> {
    return this.http.get<VersionInfo>(`${environment.backendUrl}/characteristics/${characteristicId}/version`).toPromise();
  }

  publishCharacteristic(characteristic: Characteristic, publishRequest: PublishRequest): Promise<any> {
    return this.publish(characteristic.id, publishRequest);
  }

  publish(id: string, publishRequest: PublishRequest): Promise<any> {
    return this.http.put<any>(`${environment.backendUrl}/characteristics/${id}`, publishRequest).toPromise();
  }

  addToMyStuff(characteristic: Characteristic): Promise<string> {
    const options = {
      responseType: 'text' as 'json'
    };
    return this.http.put<string>(`${environment.backendUrl}/characteristics/${characteristic.id}/myStuff`, characteristic, options).toPromise();
  }

  getRaces(includeChildren: boolean = true, authorOnly: boolean = false, listSource: ListSource = ListSource.MY_STUFF): Promise<ListObject[]> {
    this.clearItemsByType(CharacteristicType.RACE, listSource);
    return this.getCharacteristicsByCharacteristicType(CharacteristicType.RACE, includeChildren, authorOnly, listSource);
  }

  getClasses(includeChildren: boolean = true, authorOnly: boolean = false, listSource: ListSource = ListSource.MY_STUFF): Promise<ListObject[]> {
    this.clearItemsByType(CharacteristicType.CLASS, listSource);
    return this.getCharacteristicsByCharacteristicType(CharacteristicType.CLASS, includeChildren, authorOnly, listSource);
  }

  getBackgrounds(includeChildren: boolean = true, authorOnly: boolean = false, listSource: ListSource = ListSource.MY_STUFF): Promise<ListObject[]> {
    this.clearItemsByType(CharacteristicType.BACKGROUND, listSource);
    return this.getCharacteristicsByCharacteristicType(CharacteristicType.BACKGROUND, includeChildren, authorOnly, listSource);
  }

  getCharacteristicsByCharacteristicType(characteristicType: CharacteristicType, includeChildren: boolean = true, authorOnly: boolean = false, listSource: ListSource = ListSource.MY_STUFF): Promise<ListObject[]> {
    return this.http.get<ListObject[]>(`${environment.backendUrl}/characteristics/type/${characteristicType}?includeChildren=${includeChildren}&authorOnly=${authorOnly}&source=${listSource}`).toPromise()
      .then((items: ListObject[]) => {
        switch (listSource) {
          case ListSource.MY_STUFF:
            this.itemsByType[characteristicType] = items;
            break;
          case ListSource.PUBLIC_CONTENT:
            this.publicItemsByType[characteristicType] = items;
            break;
          case ListSource.PRIVATE_CONTENT:
            this.privateItemsByType[characteristicType] = items;
            break;
        }
        return items;
      });
  }

  getCharacteristic(id: string): Promise<Characteristic> {
    return this.http.get<Characteristic>(environment.backendUrl + '/characteristics/' + id).toPromise();
  }

  getChildrenCharacteristicIds(parentId: string): Promise<string[]> {
    return this.http.get<string[]>(environment.backendUrl + '/characteristics/' + parentId + '/children').toPromise();
  }

  getChildrenCharacteristics(parentId: string): Promise<ListObject[]> {
    return this.http.get<ListObject[]>(environment.backendUrl + '/characteristics/' + parentId + '/children/list').toPromise();
  }

  getParent(childId: string): Promise<Characteristic> {
    return this.http.get<Characteristic>(`${environment.backendUrl}/characteristics/${childId}/parent`).toPromise();
  }

  updateCharacteristic(characteristic: Characteristic): Promise<any> {
    return this.http.post<any>(environment.backendUrl + '/characteristics/' + characteristic.id, characteristic).toPromise();
  }

  getFeatures(id: string, includeChildren: boolean): Promise<Feature[]> {
    return this.http.get<Feature[]>(`${environment.backendUrl}/characteristics/${id}/features?includeChildren=${includeChildren}`)
      .toPromise().then((features: Feature[]) => {
        features.forEach((feature: Feature) => {
          feature.type = 'Feature';
        });
        return features;
      });
  }

  inUse(id: string): Promise<InUse[]> {
    return this.http.get<InUse[]>(`${environment.backendUrl}/characteristics/${id}/in-use`).toPromise();
  }

  delete(id: string): Promise<any> {
    return this.http.delete<any>(`${environment.backendUrl}/characteristics/${id}`).toPromise();
  }

  deleteCharacteristic(characteristic: Characteristic): Promise<any> {
    return this.delete(characteristic.id);
  }

  duplicateCharacteristic(characteristic: Characteristic, name: string): Promise<string> {
    const body = new URLSearchParams();
    body.set('name', name);
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
      responseType: 'text' as 'json'
    };
    return this.http.post<any>(environment.backendUrl + '/characteristics/' + characteristic.id + '/duplicate', body.toString(), options).toPromise();
  }

  addSpells(characteristic: Characteristic, spells: ListObject[]): Promise<SpellConfiguration[]> {
    const powerList = new PowerList();
    powerList.powers = spells;
    return this.http.put<SpellConfiguration[]>(`${environment.backendUrl}/characteristics/${characteristic.id}/spells`, powerList).toPromise();
  }

  addSpellConfigurations(characteristic: Characteristic, spellConfigurations: SpellConfiguration[]): Promise<any> {
    const spellConfigurationList = new SpellConfigurationList();
    spellConfigurationList.configurations = spellConfigurations;
    return this.http.put<any>(`${environment.backendUrl}/characteristics/${characteristic.id}/spells/configurations`, spellConfigurationList).toPromise().then(() => {
      this.characteristicSpellConfigurations.delete(characteristic.id);
    });
  }

  getBackgroundTraits(characteristic: Characteristic): Promise<BackgroundTrait[]> {
    return this.http.get<BackgroundTrait[]>(`${environment.backendUrl}/characteristics/${characteristic.id}/traits`).toPromise();
  }

  getSpellConfigurations(characteristicId: string): Promise<SpellConfiguration[]> {
    const spellConfigurations = this.characteristicSpellConfigurations.get(characteristicId);
    if (spellConfigurations != null && spellConfigurations.length > 0) {
      return Promise.resolve(spellConfigurations);
    }
    return this.http.get<SpellConfiguration[]>(`${environment.backendUrl}/characteristics/${characteristicId}/spells`).toPromise().then((configurations: SpellConfiguration[]) => {
      this.characteristicSpellConfigurations.set(characteristicId, configurations);
      return configurations;
    });
  }

  updateSpellConfiguration(characteristic: Characteristic, spellConfiguration: SpellConfiguration): Promise<any> {
    return this.http.post<any>(`${environment.backendUrl}/characteristics/${characteristic.id}/spells`, spellConfiguration).toPromise().then(() => {
      this.characteristicSpellConfigurations.delete(characteristic.id);
    });
  }

  deleteSpell(characteristic: Characteristic, spellId: string): Promise<any> {
    return this.http.delete<any>(`${environment.backendUrl}/characteristics/${characteristic.id}/spells/${spellId}`).toPromise().then(() => {
      this.characteristicSpellConfigurations.delete(characteristic.id);
    });
  }

  /*************************************************************************************/

  populateParentList(characteristic: Characteristic): Promise<ListObject[]> {
    return this.getCharacteristicsByCharacteristicType(characteristic.characteristicType)
      .then((items: ListObject[]) => {
        if (characteristic.id === '0') {
          return this.getParentList(items, characteristic, null)
        } else {
          return this.getChildrenCharacteristicIds(characteristic.id).then((childrenIds: string[]) => {
            return this.getParentList(items, characteristic, childrenIds)
          }).catch(() => {
            return this.getErrorList();
          });
        }
      }).catch(() => {
        return this.getErrorList();
      });
  }

  private getErrorList(): ListObject[] {
    const none = this.translate.instant('None');
    const list: ListObject[] = [];
    list.push(new ListObject('0', none));
    return list;
  }

  private getParentList(items: ListObject[], characteristic: Characteristic, childrenIds: string[]): ListObject[] {
    const none = this.translate.instant('None');
    const list: ListObject[] = [];
    list.push(new ListObject('0', none));
    items.forEach((item: ListObject) => {
      if (item.id !== characteristic.id && (childrenIds == null || !this.isChild(item, childrenIds))) {
        list.push(item);
      }
    });
    return list;
  }

  private isChild(item: ListObject, childrenIds: string[]): boolean {
    for (let i = 0; i < childrenIds.length; i++) {
      if (childrenIds[i] === item.id) {
        return true;
      }
    }
    return false;
  }

  setFromCollections(characteristic: Characteristic, collection: CharacteristicConfigurationCollection): void {
    this.proficienciesService.setProficiencies(collection.proficiencyCollection, characteristic);
    this.spellConfigurationService.setSpellConfigurations(collection. spellConfigurationCollection, characteristic);
    this.setDamageModifiers(collection.damageModifierCollection, characteristic);
    this.setStartingEquipment(collection.startingEquipmentCollection, characteristic);
    this.setConditionImmunities(collection.conditionImmunityConfigurationCollection, characteristic);
    this.setSenses(collection.senseConfigurationCollection, characteristic);
    this.setMisc(collection.miscModifierCollection, characteristic);
  }

  parentChange(parent: Characteristic, collection: CharacteristicConfigurationCollection, includeSpellConfigurations: boolean): void {
    this.setAll(parent);
    this.proficienciesService.updateParentProfs(collection.proficiencyCollection, parent);
    this.spellConfigurationService.updateInheritedConfigurations(collection.spellConfigurationCollection, parent, includeSpellConfigurations);
    this.updateParentDamageModifiers(collection.damageModifierCollection, parent);
    this.updateParentStartingEquipment(collection.startingEquipmentCollection, parent);
    this.updateParentConditionImmunities(collection.conditionImmunityConfigurationCollection, parent);
    this.updateParentSenses(collection.senseConfigurationCollection, parent);
    this.updateParentMisc(collection.miscModifierCollection, parent);
  }

  setAll(characteristic: Characteristic): void {
    if (characteristic == null) {
      return;
    }
    this.proficienciesService.setAllProfs(characteristic);
    this.spellConfigurationService.setAllSpellConfigs(characteristic);
    this.setAllDamageModifiers(characteristic);
    this.setAllStartingEquipment(characteristic);
    this.setAllConditionImmunities(characteristic);
    this.setAllSenses(characteristic);
    this.setAllMisc(characteristic);
  }

  initializeConfigurationCollection(characteristic: Characteristic, includeInherited = true, listSource: ListSource = ListSource.MY_STUFF): Promise<CharacteristicConfigurationCollection> {
    const collection = new CharacteristicConfigurationCollection();
    const promises = [];
    promises.push(this.initializeProfs(characteristic, collection, listSource));
    promises.push(this.initializeSpells(characteristic, collection, includeInherited));
    promises.push(this.initializeDamageModifiers(characteristic, collection));
    promises.push(this.initializeConditionImmunities(characteristic, collection));
    promises.push(this.initializeMiscModifiers(characteristic, collection));

    this.initializeStartingEquipment(characteristic, collection);
    this.initializeSenses(characteristic, collection);

    return Promise.all(promises).then(function() {
      return collection;
    });
  }

  private initializeProfs(characteristic: Characteristic, collection: CharacteristicConfigurationCollection, listSource: ListSource):
    Promise<ProficiencyCollection> {
    return this.proficienciesService.initializeProfs(characteristic, characteristic.parent, listSource)
      .then((proficiencyCollection: ProficiencyCollection) => {
        collection.proficiencyCollection = proficiencyCollection;
        return proficiencyCollection;
      });
  }

  initializeSpells(characteristic: Characteristic, collection: CharacteristicConfigurationCollection, includeInherited: boolean):
    Promise<SpellConfigurationCollection> {
    return this.spellConfigurationService.initializeSpellConfigurations(characteristic, characteristic.parent, includeInherited)
      .then((spellConfigurationCollection: SpellConfigurationCollection) => {
        collection.spellConfigurationCollection = spellConfigurationCollection;
        return spellConfigurationCollection;
      });
  }

  initializeDamageModifiers(characteristic: Characteristic, collection: CharacteristicConfigurationCollection):
    Promise<DamageModifierCollection> {
    return this.initializeDamageModifierConfigurations(characteristic, characteristic.parent)
      .then((damageModifierCollection: DamageModifierCollection) => {
        collection.damageModifierCollection = damageModifierCollection;
        return damageModifierCollection;
      });
  }

  initializeStartingEquipment(characteristic: Characteristic, collection: CharacteristicConfigurationCollection):
    StartingEquipmentConfigurationCollection {
    const configurations = this.initializeStartingEquipmentConfigurations(characteristic, characteristic.parent);
    collection.startingEquipmentCollection = configurations;
    return configurations;
  }

  initializeConditionImmunities(characteristic: Characteristic, collection: CharacteristicConfigurationCollection):
    Promise<ConditionImmunityConfigurationCollection> {
    return this.initializeConditionImmunitiesConfigurations(characteristic, characteristic.parent)
      .then((conditionImmunityConfigurationCollection: ConditionImmunityConfigurationCollection) => {
        collection.conditionImmunityConfigurationCollection = conditionImmunityConfigurationCollection;
        return conditionImmunityConfigurationCollection;
      });
  }

  initializeMiscModifiers(characteristic: Characteristic, collection: CharacteristicConfigurationCollection):
    Promise<MiscModifierConfigurationCollection> {
    return this.initializeMiscConfigurations(characteristic, characteristic.parent)
      .then((miscModifierConfigurationCollection: MiscModifierConfigurationCollection) => {
        collection.miscModifierCollection = miscModifierConfigurationCollection;
        return miscModifierConfigurationCollection;
      });
  }

  initializeSenses(characteristic: Characteristic, collection: CharacteristicConfigurationCollection): SenseConfigurationCollection {
    const configurations = this.initializeSensesConfigurations(characteristic, characteristic.parent);
    collection.senseConfigurationCollection = configurations;
    return configurations;
  }

  createCopyOfCollection(collection: CharacteristicConfigurationCollection): CharacteristicConfigurationCollection {
    return _.cloneDeep(collection);
  }

  /******************************* Damage Modifiers *************************************/

//  combineDamageModifierCollections(collections: DamageModifierCollection[]): Promise<DamageModifierCollection> {
//    const combined: DamageModifierCollection = new DamageModifierCollection();
//    return this.damageTypeService.getDamageTypes().then((damageTypes: ListObject[]) => {
//      damageTypes.forEach((damageType: ListObject) => {
//        const item = new DamageModifierCollectionItem();
//        item.damageType = damageType;
//        item.damageModifierType = this.getCombinedDamageModifierType(damageType, collections);
//        item.inheritedDamageModifierType = DamageModifierType.NORMAL;
//        combined.damageModifiers.push(item);
//      });
//      return combined;
//    });
//  }

//  private getCombinedDamageModifierType(damageType: ListObject, collections: DamageModifierCollection[]):
//    DamageModifierType {
//    if (collections == null || collections.length === 0) {
//      return DamageModifierType.NORMAL;
//    }
//
//    let damageModifierType: DamageModifierType = DamageModifierType.NORMAL;
//    for (let i = 0; i < collections.length; i++) {
//      const collection: DamageModifierCollection = collections[i];
//      const newDamageModifierType: DamageModifierType = this.getDamageModifierType(damageType, collection);
//      if (newDamageModifierType !== DamageModifierType.NORMAL) {
//        switch (newDamageModifierType) {
//          case DamageModifierType.IMMUNE:
//            damageModifierType = newDamageModifierType;
//            break;
//          case DamageModifierType.RESISTANT:
//            if (damageModifierType === DamageModifierType.VULNERABLE) {
//              damageModifierType = DamageModifierType.NORMAL;
//            } else if (damageModifierType === DamageModifierType.NORMAL) {
//              damageModifierType = newDamageModifierType;
//            }
//            break;
//          case DamageModifierType.VULNERABLE:
//            if (damageModifierType === DamageModifierType.RESISTANT) {
//              damageModifierType = DamageModifierType.NORMAL;
//            } else if (damageModifierType === DamageModifierType.NORMAL) {
//              damageModifierType = newDamageModifierType;
//            }
//            break;
//        }
//      }
//    }
//
//    return damageModifierType;
//  }

//  private getDamageModifierType(damageType: ListObject, collection: DamageModifierCollection): DamageModifierType {
//    for (let i = 0; i < collection.damageModifiers.length; i++) {
//      const modifier = collection.damageModifiers[i];
//      if (modifier.damageType.id === damageType.id) {
//        if (modifier.inheritedDamageModifierType !== DamageModifierType.NORMAL) {
//          return modifier.inheritedDamageModifierType;
//        }
//        return modifier.damageModifierType;
//      }
//    }
//    return DamageModifierType.NORMAL;
//  }

  initializeDamageModifierConfigurations(characteristic: Characteristic, parent: Characteristic): Promise<DamageModifierCollection> {
    const damageModifierCollection = new DamageModifierCollection();
    return this.damageTypeService.getDamageTypes().then((damageTypes: ListObject[]) => {
      damageTypes.forEach((damageType: ListObject) => {
        const item = new DamageModifierCollectionItem();
        item.damageType = damageType;
        item.damageModifierType = this.getDamageModifierType(damageType, characteristic);
        item.inheritedDamageModifierType = this.getDamageModifierType(damageType, parent);
        damageModifierCollection.damageModifiers.push(item);
      });
      return damageModifierCollection;
    });
  }

  private getDamageModifierType(damageType: ListObject, characteristic: Characteristic): DamageModifierType {
    if (characteristic == null) {
      return DamageModifierType.NORMAL;
    }
    const damageModifiers: DamageModifier[] = characteristic.damageModifiers;
    for (let i = 0; i < damageModifiers.length; i++) {
      const damageModifier: DamageModifier = damageModifiers[i];
      if (damageModifier.damageType.id === damageType.id) {
        return damageModifier.damageModifierType;
      }
    }
    return DamageModifierType.NORMAL;
  }

  setAllDamageModifiers(characteristic: Characteristic): void {
    if (characteristic == null) {
      return;
    }
    characteristic.damageModifiers = this.getAllDamageModifiers(characteristic);
  }

  getAllDamageModifiers(characteristic: Characteristic): DamageModifier[] {
    let modifiers: DamageModifier[] = [];
    if (characteristic.parent) {
      modifiers = this.getAllDamageModifiers(characteristic.parent);
    }
    characteristic.damageModifiers.forEach((config: DamageModifier) => {
      modifiers.push(config);
    });
    return modifiers;
  }

  updateParentDamageModifiers(collection: DamageModifierCollection, parent: Characteristic): void {
    collection.damageModifiers.forEach((item: DamageModifierCollectionItem) => {
      item.inheritedDamageModifierType = this.getDamageModifierType(item.damageType, parent);
    });
  }

  setDamageModifiers(collection: DamageModifierCollection, characteristic: Characteristic): void {
    const damageModifiers: DamageModifier[] = [];
    collection.damageModifiers.forEach((damageModifierCollectionItem: DamageModifierCollectionItem) => {
      if (damageModifierCollectionItem.damageModifierType !== DamageModifierType.NORMAL) {
        const damageModifier = new DamageModifier();
        damageModifier.damageType = new DamageType();
        damageModifier.damageType.id = damageModifierCollectionItem.damageType.id;
        damageModifier.damageType.name = damageModifierCollectionItem.damageType.name;
        damageModifier.damageModifierType = damageModifierCollectionItem.damageModifierType;
        damageModifiers.push(damageModifier);
      }
    });
    characteristic.damageModifiers = damageModifiers;
  }

  /******************************* Starting Equipment *************************************/

  getStartingEquipment(characteristic: Characteristic, includeParents = true): Promise<StartingEquipment[]> {
    return this.http.get<StartingEquipment[]>(`${environment.backendUrl}/characteristics/${characteristic.id}/startingEquipment?includeParents=${includeParents}`).toPromise();
  }

  initializeStartingEquipmentConfigurations(characteristic: Characteristic, parent: Characteristic):
    StartingEquipmentConfigurationCollection {
    const collection = new StartingEquipmentConfigurationCollection();
    const groupMap = new Map<number, StartingEquipmentItemGroup>();

    if (parent != null) {
      this.initializeStartingEquipmentGroup(parent.startingEquipment, groupMap, parent);
    }
    this.initializeStartingEquipmentGroup(characteristic.startingEquipment, groupMap, null);

    collection.groups = Array.from(groupMap.values());
    collection.groups.sort((left: StartingEquipmentItemGroup, right: StartingEquipmentItemGroup) => {
      return left.groupNumber - right.groupNumber;
    });

    collection.groups.forEach((group: StartingEquipmentItemGroup) => {
      group.options.sort((left: StartingEquipmentItemGroupOption, right: StartingEquipmentItemGroupOption) => {
        return left.optionNumber - right.optionNumber;
      });

      this.updateOptionLabels(group);
    });
    return collection;
  }

  initializeStartingEquipmentGroup(groups: StartingEquipment[],  groupMap = new Map<number, StartingEquipmentItemGroup>(), inheritedFrom: Characteristic): void {
    groups.forEach((startingEquipment: StartingEquipment) => {
      const groupNumber = startingEquipment.itemGroup;
      let itemGroup = groupMap.get(groupNumber);
      if (itemGroup == null) {
        itemGroup = new StartingEquipmentItemGroup();
        itemGroup.groupNumber = groupNumber;
        itemGroup.inheritedFrom = inheritedFrom;
        groupMap.set(groupNumber, itemGroup);
      }

      const itemOption = startingEquipment.itemOption;
      let option = this.getOption(itemOption, itemGroup);
      if (option == null) {
        option = new StartingEquipmentItemGroupOption();
        option.optionNumber = itemOption;
        option.inheritedFrom = inheritedFrom;
        itemGroup.options.push(option);
      }

      const optionItem = new StartingEquipmentItemGroupOptionItem(startingEquipment);
      optionItem.inheritedFrom = inheritedFrom;
      option.items.push(optionItem);
    });
  }

  private getOption(optionNumber: number, group: StartingEquipmentItemGroup): StartingEquipmentItemGroupOption {
    for (let i = 0; i < group.options.length; i++) {
      const option = group.options[i];
      if (option.optionNumber === optionNumber) {
        return option;
      }
    }
    return null;
  }

  updateOptionLabels(group: StartingEquipmentItemGroup): void {
    group.options.forEach((option: StartingEquipmentItemGroupOption) => {
      //97 = a
      option.label = String.fromCharCode(96 + option.optionNumber).toUpperCase();
    });
  }

  setAllStartingEquipment(characteristic: Characteristic): void {
    if (characteristic == null) {
      return;
    }
    characteristic.startingEquipment = this.getAllStartingEquipment(characteristic);
  }

  getAllStartingEquipment(characteristic: Characteristic): StartingEquipment[] {
    let startingEquipment: StartingEquipment[] = [];
    if (characteristic.parent) {
      startingEquipment = this.getAllStartingEquipment(characteristic.parent);
    }
    characteristic.startingEquipment.forEach((item: StartingEquipment) => {
      startingEquipment.push(item);
    });
    return startingEquipment;
  }

  private removeInheritedStartingEquipmentItems(groups: StartingEquipmentItemGroup[]): void {
    groups.forEach((group: StartingEquipmentItemGroup) => {
      for (let i = 0; i < group.options.length; i++) {
        const option = group.options[i];

        for (let j = 0; j < option.items.length; j++) {
          const item = option.items[j];
          if (item.inheritedFrom != null) {
            option.items.splice(j, 1);
            j--;
          }
        }
      }
    });
  }

  private removeInheritedStartingEquipmentOptions(groups: StartingEquipmentItemGroup[]): void {
    groups.forEach((group: StartingEquipmentItemGroup) => {
      for (let i = 0; i < group.options.length; i++) {
        const option = group.options[i];
        if (option.inheritedFrom != null) {
          if (option.items.length > 0) {
            option.inheritedFrom = null;
          } else {
            group.options.splice(i, 1);
            i--;
          }
        }
      }
    });
  }

  private removeInheritedStartingEquipmentGroups(groups: StartingEquipmentItemGroup[]): void {
    for (let i = 0; i < groups.length; i++) {
      const group = groups[i];

      if (group.inheritedFrom != null) {
        if (group.options.length > 0) {
          group.inheritedFrom = null;
        } else {
          groups.splice(i, 1);
          i--;
        }
      }
    }
  }

  removeParentStartingEquipment(collection: StartingEquipmentConfigurationCollection): void {
    this.removeInheritedStartingEquipmentItems(collection.groups);
    this.removeInheritedStartingEquipmentOptions(collection.groups);
    this.removeInheritedStartingEquipmentGroups(collection.groups);
  }

  updateParentStartingEquipment(collection: StartingEquipmentConfigurationCollection, parent: Characteristic): void {
    this.removeParentStartingEquipment(collection);
    if (parent != null) {
      const groupMap = new Map<number, StartingEquipmentItemGroup>();
      this.initializeStartingEquipmentGroup(parent.startingEquipment, groupMap, null);
      let newGroups = Array.from(groupMap.values());
      newGroups = newGroups.concat(collection.groups);
      collection.groups = newGroups;
    }
    this.updateGroupNumbers(collection.groups);
  }

  updateGroupNumbers(groups: StartingEquipmentItemGroup[]): number {
    let startingNumber = 1;
    for (let i = 0; i < groups.length; i++) {
      const group = groups[i];
      group.groupNumber = startingNumber;
      startingNumber++;
    }
    return startingNumber;
  }

  setStartingEquipment(collection: StartingEquipmentConfigurationCollection, characteristic: Characteristic): void {
    const startingEquipment: StartingEquipment[] = [];
    collection.groups.forEach((group: StartingEquipmentItemGroup) => {
      group.options.forEach((option: StartingEquipmentItemGroupOption) => {
        option.items.forEach((item: StartingEquipmentItemGroupOptionItem) => {
          if (item.inheritedFrom == null) {
            const equipmentItem = new StartingEquipment();
            equipmentItem.itemGroup = group.groupNumber;
            equipmentItem.itemOption = option.optionNumber;
            equipmentItem.startingEquipmentType = item.startingEquipmentType;
            if (item.item != null) {
              equipmentItem.item = new ListObject(item.item.id, item.item.name);
            }
            equipmentItem.filters = item.filters;
            equipmentItem.quantity = item.quantity;
            startingEquipment.push(equipmentItem);
          }
        });
      });
    });

    characteristic.startingEquipment = startingEquipment;
  }

  /******************************* ConditionImmunities *************************************/

//  private combineConditionImmunities(collections: ConditionImmunityConfigurationCollection[]): ConditionImmunityConfigurationCollection {
//    const combined = new ConditionImmunityConfigurationCollection();
//    collections.forEach((collection: ConditionImmunityConfigurationCollection) => {
//      collection.conditionImmunities.forEach((condition: ConditionImmunityConfigurationCollectionItem) => {
//        if (this.getConditionCollectionItem(condition.condition, combined) == null) {
//          combined.conditionImmunities.push(condition);
//        }
//      });
//    });
//    return combined;
//  }

//  private getConditionCollectionItem(condition: ListObject, collection: ConditionImmunityConfigurationCollection):
//    ConditionImmunityConfigurationCollectionItem {
//    for (let i = 0; i < collection.conditionImmunities.length; i++) {
//      if (collection.conditionImmunities[i].condition.id === condition.id) {
//        return collection.conditionImmunities[i];
//      }
//    }
//    return null;
//  }

  initializeConditionImmunitiesConfigurations(characteristic: Characteristic, parent: Characteristic):
    Promise<ConditionImmunityConfigurationCollection> {
    const collection = new ConditionImmunityConfigurationCollection();
    return this.conditionService.getConditions().then((conditions: ListObject[]) => {
      conditions.forEach((condition: ListObject) => {
        const item: ConditionImmunityConfigurationCollectionItem = new ConditionImmunityConfigurationCollectionItem();
        item.condition = condition;
        item.immune = this.isImmune(condition, characteristic.conditionImmunities);
        item.inheritedImmune = parent != null && this.isImmune(condition, parent.conditionImmunities);
        collection.conditionImmunities.push(item);
      });
      return collection;
    });
  }

  private isImmune(condition: ListObject, immunities: ListObject[]): boolean {
    if (immunities == null) {
      return false;
    }

    for (let i = 0; i < immunities.length; i++) {
      const immunity: ListObject = immunities[i];
      if (immunity.id === condition.id) {
        return true;
      }
    }
    return false;
  }

  setAllConditionImmunities(characteristic: Characteristic): void {
    if (characteristic == null) {
      return;
    }
    characteristic.conditionImmunities = this.getAllConditionImmunities(characteristic);
  }

  getAllConditionImmunities(characteristic: Characteristic): ListObject[] {
    let immunities: ListObject[] = [];
    if (characteristic.parent) {
      immunities = this.getAllConditionImmunities(characteristic.parent);
    }
    characteristic.conditionImmunities.forEach((conditionImmunity: ListObject) => {
      immunities.push(conditionImmunity);
    });
    return immunities;
  }

  updateParentConditionImmunities(collection: ConditionImmunityConfigurationCollection, parent: Characteristic): void {
    collection.conditionImmunities.forEach((item: ConditionImmunityConfigurationCollectionItem) => {
      item.inheritedImmune = this.isImmune(item.condition, parent == null ? null : parent.conditionImmunities);
    });
  }

  setConditionImmunities(collection: ConditionImmunityConfigurationCollection, characteristic: Characteristic): void {
    const conditionImmunities: ListObject[] = [];
    collection.conditionImmunities.forEach((item: ConditionImmunityConfigurationCollectionItem) => {
      if (item.immune) {
        conditionImmunities.push(item.condition);
      }
    });
    characteristic.conditionImmunities = conditionImmunities;
  }

  /******************************* Senses *************************************/

//  private combineSenses(collections: SenseConfigurationCollection[]): SenseConfigurationCollection {
//    const combined: SenseConfigurationCollection = new SenseConfigurationCollection();
//    const senses: Sense[] = this.getSenses();
//    senses.forEach((sense: Sense) => {
//      const current = new SenseConfigurationCollectionItem();
//      collections.forEach((collection: SenseConfigurationCollection) => {
//        const range: number = this.getCollectionSenseRange(sense, collection);
//        if (range > current.range) {
//          current.range = range;
//        }
//      });
//    });
//    return combined;
//  }

  initializeSensesConfigurations(characteristic: Characteristic, parent: Characteristic): SenseConfigurationCollection {
    const collection = new SenseConfigurationCollection();
    const senses: Sense[] = this.getSenses();
    senses.forEach((sense: Sense) => {
      const item = new SenseConfigurationCollectionItem();
      item.sense = sense;
      item.range = this.getRange(sense, characteristic.senses);
      item.inheritedRange = parent == null ? 0 : this.getRange(sense, parent.senses);
      collection.senses.push(item);
    });
    return collection;
  }

  private getSenses(): Sense[] {
    const senses: Sense[] = [];
    senses.push(Sense.DARKVISION);
    senses.push(Sense.BLINDSIGHT);
    senses.push(Sense.TELEPATHY);
    senses.push(Sense.TREMORSENSE);
    senses.push(Sense.TRUESIGHT);
    return senses;
  }

  private getCollectionSenseRange(sense: Sense, collection: SenseConfigurationCollection): number {
    for (let i = 0; i < collection.senses.length; i++) {
      const current: SenseConfigurationCollectionItem = collection.senses[i];
      if (current.sense === sense) {
        return current.range + current.inheritedRange;
      }
    }
    return 0;
  }

  private getRange(sense: Sense, senses: SenseValue[]): number {
    if (senses == null) {
      return 0;
    }

    for (let i = 0; i < senses.length; i++) {
      const senseValue: SenseValue = senses[i];
      if (senseValue.sense === sense) {
        return senseValue.range;
      }
    }
    return 0;
  }

  setAllSenses(characteristic: Characteristic): void {
    if (characteristic == null) {
      return;
    }
    characteristic.senses = this.getAllSenses(characteristic);
  }

  getAllSenses(characteristic: Characteristic): SenseValue[] {
    let senses: SenseValue[] = [];
    if (characteristic.parent) {
      senses = this.getAllSenses(characteristic.parent);
    }
    characteristic.senses.forEach((senseValue: SenseValue) => {
      const current = this.getSenseValue(senseValue.sense, senses);
      if (current == null) {
        senses.push(senseValue);
      } else {
        current.range += senseValue.range;
      }
    });
    return senses;
  }

  private getSenseValue(sense: Sense, senses: SenseValue[]): SenseValue {
    for (let i = 0; i < senses.length; i++) {
      const senseValue: SenseValue = senses[i];
      if (senseValue.sense === sense) {
        return senseValue;
      }
    }
    return null;
  }

  updateParentSenses(collection: SenseConfigurationCollection, parent: Characteristic): void {
    collection.senses.forEach((item: SenseConfigurationCollectionItem) => {
      item.inheritedRange = this.getRange(item.sense, parent == null ? null : parent.senses);
    });
  }

  setSenses(collection: SenseConfigurationCollection, characteristic: Characteristic): void {
    const senses: SenseValue[] = [];
    collection.senses.forEach((item: SenseConfigurationCollectionItem) => {
      if (item.range > 0) {
        const senseValue: SenseValue = new SenseValue();
        senseValue.sense = item.sense;
        senseValue.range = item.range;
        senses.push(senseValue);
      }
    });
    characteristic.senses = senses;
  }


  /******************************* Misc Configuration *************************************/

  initializeMiscConfigurations(characteristic: Characteristic, parent: Characteristic): Promise<MiscModifierConfigurationCollection> {
    const collection = new MiscModifierConfigurationCollection();
    return this.attributeService.getMisc().then((miscAttributes: ListObject[]) => {
      miscAttributes.forEach((misc: ListObject) => {
        const item = new MiscModifierConfigurationCollectionItem();
        item.item = misc;
        item.value = this.getModifierValue(misc, characteristic.miscModifiers);
        item.inheritedValue = parent == null ? 0 : this.getModifierValue(misc, parent.miscModifiers);
        collection.modifiers.push(item);
      });
      return collection;
    });
  }

  private getModifierValue(modifier: ListObject, modifiers: Modifier[]): number {
    if (modifiers == null) {
      return 0;
    }

    for (let i = 0; i < modifiers.length; i++) {
      const listModifier: Modifier = modifiers[i];
      if (listModifier.attribute.id === modifier.id) {
        return listModifier.value;
      }
    }
    return 0;
  }

  setAllMisc(characteristic: Characteristic): void {
    if (characteristic == null) {
      return;
    }
    characteristic.miscModifiers = this.getAllMisc(characteristic);
  }

  getAllMisc(characteristic: Characteristic): Modifier[] {
    let modifiers: Modifier[] = [];
    if (characteristic.parent) {
      modifiers = this.getAllMisc(characteristic.parent);
    }
    characteristic.miscModifiers.forEach((modifier: Modifier) => {
      const current = this.getMiscValue(modifier.attribute, modifiers);
      if (current == null) {
        modifiers.push(modifier);
      } else {
        current.value += modifier.value;
      }
    });
    return modifiers;
  }

  private getMiscValue(misc: ListObject, modifiers: Modifier[]): Modifier {
    if (modifiers != null) {
      for (let i = 0; i < modifiers.length; i++) {
        const current: Modifier = modifiers[i];
        if (current.attribute.id === misc.id) {
          return current;
        }
      }
    }
    return null;
  }

  updateParentMisc(collection: MiscModifierConfigurationCollection, parent: Characteristic): void {
    collection.modifiers.forEach((item: MiscModifierConfigurationCollectionItem) => {
      const modifier = this.getMiscValue(item.item, parent == null ? null : parent.miscModifiers);
      if (modifier != null) {
        item.value = modifier.value;
      }
    });
  }

  setMisc(collection: MiscModifierConfigurationCollection, characteristic: Characteristic): void {
    const modifiers: Modifier[] = [];
    collection.modifiers.forEach((item: MiscModifierConfigurationCollectionItem) => {
      if (item.value !== 0) {
        const modifier: Modifier = new Modifier();
        modifier.attribute = new Attribute();
        modifier.attribute.id = item.item.id;
        modifier.value = item.value;
        modifiers.push(modifier);
      }
    });
    characteristic.miscModifiers = modifiers;
  }
}
