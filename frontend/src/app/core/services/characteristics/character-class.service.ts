import {Injectable} from '@angular/core';
import {CharacterClass} from '../../../shared/models/characteristics/character-class';
import {BehaviorSubject} from 'rxjs/index';
import {MenuService} from '../../../shared/components/list-menu/list-menu.component';
import {MenuItem} from '../../../shared/models/menuItem.model';
import {ListObject} from '../../../shared/models/list-object';
import {CharacteristicType} from '../../../shared/models/characteristics/characteristic-type.enum';
import {Characteristic} from '../../../shared/models/characteristics/characteristic';
import {CharacteristicService} from './characteristic.service';
import {ProficiencyCollection} from '../../../shared/models/proficiency-collection';
import {ListProficiency} from '../../../shared/models/list-proficiency';
import {Proficiency, ProficiencyListObject} from '../../../shared/models/proficiency';
import {AbilityScoreIncreaseCollection} from '../../../shared/models/characteristics/ability-score-increase-collection';
import {AbilityScoreIncreaseCollectionItem} from '../../../shared/models/characteristics/ability-score-increase-collection-item';
import * as _ from 'lodash';
import {Filters} from '../../components/filters/filters';
import {ListSource} from '../../../shared/models/list-source.enum';

@Injectable({
  providedIn: 'root'
})
export class CharacterClassService implements MenuService {
  private items: MenuItem[] = [];
  menuItems: BehaviorSubject<MenuItem[]> = new BehaviorSubject<MenuItem[]>(this.items);
  private classes: ListObject[] = [];
  private publicClasses: ListObject[] = [];
  private privateClasses: ListObject[] = [];

  constructor(
    private characteristicService: CharacteristicService
  ) {
  }

  private resetCache(listSource: ListSource): void {
    switch (listSource) {
      case ListSource.MY_STUFF:
        this.classes = [];
        break;
      case ListSource.PUBLIC_CONTENT:
        this.publicClasses = [];
        break;
      case ListSource.PRIVATE_CONTENT:
        this.privateClasses = [];
        break;
    }
  }

  private getCached(listSource: ListSource): ListObject[] {
    switch (listSource) {
      case ListSource.MY_STUFF:
        return this.classes;
      case ListSource.PUBLIC_CONTENT:
        return this.publicClasses;
      case ListSource.PRIVATE_CONTENT:
        return this.privateClasses;
    }
  }

  private updateCache(list: ListObject[], listSource: ListSource): void {
    switch (listSource) {
      case ListSource.MY_STUFF:
        this.classes = list;
        break;
      case ListSource.PUBLIC_CONTENT:
        this.publicClasses = list;
        break;
      case ListSource.PRIVATE_CONTENT:
        this.privateClasses = list;
        break;
    }
  }

  updateMenuItems(id: string, listSource: ListSource = ListSource.MY_STUFF, filters: Filters = null): void {
    this.resetCache(listSource);
    this.getClasses(false, false, listSource).then((characterClasses: ListObject[]) => {
      const menuItems: MenuItem[] = [];
      characterClasses.forEach((characterClass: ListObject) => {
        menuItems.push(new MenuItem(characterClass.id, characterClass.name, '', '', false));
      });
      this.items = menuItems;

      if (id != null) {
        for (let i = 0; i < this.items.length; i++) {
          const menuItem = this.items[i];
          menuItem.selected = menuItem.id === id;
        }
      }
      this.menuItems.next(this.items);
    });
  }

  createClass(characterClass: CharacterClass): Promise<string> {
    characterClass.characteristicType = CharacteristicType.CLASS;
    return this.characteristicService.createCharacteristic(characterClass);
  }

  getClasses(includeChildren: boolean = false, authorOnly: boolean = false, listSource: ListSource = ListSource.MY_STUFF): Promise<ListObject[]> {
    return this.characteristicService.getClasses(includeChildren, authorOnly, listSource).then((classes: ListObject[]) => {
      this.updateCache(classes, listSource);
      return classes;
    });
  }

  getList(listSource: ListSource, filters: Filters, clearCache: boolean): Promise<ListObject[]> {
    if (clearCache) {
      this.resetCache(listSource);
    }
    return this.getClasses(false, false, listSource);
  }

  getClass(id: string): Promise<Characteristic> {
    return this.characteristicService.getCharacteristic(id);
  }

  updateClass(characterClass: CharacterClass): Promise<any> {
    return this.characteristicService.updateCharacteristic(characterClass);
  }

  deleteClass(characterClass: CharacterClass): Promise<any> {
    return this.characteristicService.deleteCharacteristic(characterClass);
  }

  duplicateClass(characterClass: CharacterClass, name: string): Promise<string> {
    return this.characteristicService.duplicateCharacteristic(characterClass, name);
  }

  initializeSecondaryProfs(characterClass: CharacterClass, collection: ProficiencyCollection): void {
    const parent: CharacterClass = characterClass.parent == null ? null : characterClass.parent as CharacterClass;
    this.initializeSecondarySavingThrowProfs(collection, characterClass, parent);
    this.initializeSecondaryArmorProfs(collection, characterClass, parent);
    this.initializeSecondaryLanguageProfs(collection, characterClass, parent);
    this.initializeSecondarySkillProfs(collection, characterClass, parent);
    this.initializeSecondaryToolProfs(collection, characterClass, parent);
    this.initializeSecondaryWeaponProfs(collection, characterClass, parent);

    collection.numSecondarySkills = characterClass.numSecondarySkills;
    collection.numSecondaryTools = characterClass.numSecondaryTools;
    collection.parentNumSecondarySkills = parent == null ? 0 : parent.numSecondarySkills;
    collection.parentNumSecondaryTools = parent == null ? 0 : parent.numSecondaryTools;
  }

  initializeSecondarySavingThrowProfs(proficiencies: ProficiencyCollection, characterClass: CharacterClass, parent: CharacterClass): void {
    proficiencies.savingThrowProficiencies.forEach((prof: ListProficiency) => {
      prof.secondaryProficient = this.isSecondaryProficient(prof.item, characterClass.savingThrowSecondaryProfs);
      prof.inheritedSecondaryProficient = parent != null && this.isSecondaryProficient(prof.item, parent.savingThrowSecondaryProfs);
    });
  }

  initializeSecondaryArmorProfs(proficiencies: ProficiencyCollection, characterClass: CharacterClass, parent: CharacterClass): void {
    proficiencies.armorProficiencies.forEach((prof: ListProficiency) => {
      prof.secondaryProficient = this.isSecondaryProficient(prof.item, characterClass.armorTypeSecondaryProfs);
      prof.inheritedSecondaryProficient = parent != null && this.isSecondaryProficient(prof.item, parent.armorTypeSecondaryProfs);

      prof.childrenProficiencies.forEach((childProf: ListProficiency) => {
        childProf.secondaryProficient = this.isSecondaryProficient(childProf.item, characterClass.armorSecondaryProfs);
        childProf.inheritedSecondaryProficient = parent != null &&
          this.isSecondaryProficient(childProf.item, parent.armorSecondaryProfs);
      });
    });
  }

  initializeSecondaryLanguageProfs(proficiencies: ProficiencyCollection, characterClass: CharacterClass, parent: CharacterClass): void {
    proficiencies.languageProficiencies.forEach((prof: ListProficiency) => {
      prof.secondaryProficient = this.isSecondaryProficient(prof.item, characterClass.languageSecondaryProfs);
      prof.inheritedSecondaryProficient = parent != null && this.isSecondaryProficient(prof.item, parent.languageSecondaryProfs);
    });
  }

  initializeSecondarySkillProfs(proficiencies: ProficiencyCollection, characterClass: CharacterClass, parent: CharacterClass): void {
    proficiencies.skillProficiencies.forEach((prof: ListProficiency) => {
      prof.secondaryProficient = this.isSecondaryProficient(prof.item, characterClass.skillSecondaryProfs);
      prof.inheritedSecondaryProficient = parent != null && this.isSecondaryProficient(prof.item, parent.skillSecondaryProfs);
    });

    proficiencies.skillChoiceProficiencies.forEach((prof: ListProficiency) => {
      prof.secondaryProficient = this.isSecondaryProficient(prof.item, characterClass.skillSecondaryChoiceProfs);
      prof.inheritedSecondaryProficient = parent != null && this.isSecondaryProficient(prof.item, parent.skillSecondaryChoiceProfs);
    });
  }

  initializeSecondaryToolProfs(proficiencies: ProficiencyCollection, characterClass: CharacterClass, parent: CharacterClass): void {
    proficiencies.toolProficiencies.forEach((prof: ListProficiency) => {
      prof.secondaryProficient = this.isSecondaryProficient(prof.item, characterClass.toolCategorySecondaryProfs);
      prof.inheritedSecondaryProficient = parent != null &&
        this.isSecondaryProficient(prof.item, parent.toolCategorySecondaryProfs);

      prof.childrenProficiencies.forEach((childProf: ListProficiency) => {
        childProf.secondaryProficient = this.isSecondaryProficient(childProf.item, characterClass.toolSecondaryProfs);
        childProf.inheritedSecondaryProficient = parent != null &&
          this.isSecondaryProficient(childProf.item, parent.toolSecondaryProfs);
      });
    });

    proficiencies.toolChoiceProficiencies.forEach((prof: ListProficiency) => {
      prof.secondaryProficient = this.isSecondaryProficient(prof.item, characterClass.toolCategorySecondaryChoiceProfs);
      prof.inheritedSecondaryProficient = parent != null &&
        this.isSecondaryProficient(prof.item, parent.toolCategorySecondaryChoiceProfs);
    });
  }

  initializeSecondaryWeaponProfs(proficiencies: ProficiencyCollection, characterClass: CharacterClass, parent: CharacterClass): void {
    proficiencies.weaponProficiencies.forEach((prof: ListProficiency) => {
      prof.secondaryProficient = this.isSecondaryProficient(prof.item, characterClass.weaponTypeSecondaryProfs);
      prof.inheritedSecondaryProficient = parent != null && this.isSecondaryProficient(prof.item, parent.weaponTypeSecondaryProfs);

      prof.childrenProficiencies.forEach((childProf: ListProficiency) => {
        childProf.secondaryProficient = this.isSecondaryProficient(childProf.item, characterClass.weaponSecondaryProfs);
        childProf.inheritedSecondaryProficient = parent != null &&
          this.isSecondaryProficient(childProf.item, parent.weaponSecondaryProfs);
      });
    });
  }

  private isSecondaryProficient(attribute: ListObject, proficiencies: Proficiency[]): boolean {
    for (let i = 0; i < proficiencies.length; i++) {
      const prof: Proficiency = proficiencies[i];
      if (prof.attribute.id === attribute.id) {
        return true;
      }
    }
    return false;
  }

  updateParentSecondaryProfs(proficiencies: ProficiencyCollection, parent: CharacterClass): void {
    this.setAllSecondaryProfs(parent);

    this.updateInheritedProficiencies(proficiencies.savingThrowProficiencies,
      parent == null ? null : parent.savingThrowSecondaryProfs,
      null);
    this.updateInheritedProficiencies(proficiencies.armorProficiencies,
      parent == null ? null : parent.armorTypeSecondaryProfs,
      parent == null ? null : parent.armorSecondaryProfs);
    this.updateInheritedProficiencies(proficiencies.languageProficiencies,
      parent == null ? null : parent.languageSecondaryProfs,
      null);
    this.updateInheritedProficiencies(proficiencies.skillProficiencies,
      parent == null ? null : parent.skillSecondaryProfs,
      null);
    this.updateInheritedProficiencies(proficiencies.skillChoiceProficiencies,
      parent == null ? null : parent.skillSecondaryChoiceProfs,
      null);
    this.updateInheritedProficiencies(proficiencies.toolProficiencies,
      parent == null ? null : parent.toolCategorySecondaryProfs,
      parent == null ? null : parent.toolSecondaryProfs);
    this.updateInheritedProficiencies(proficiencies.toolChoiceProficiencies,
      parent == null ? null : parent.toolCategorySecondaryChoiceProfs,
      null);
    this.updateInheritedProficiencies(proficiencies.weaponProficiencies,
      parent == null ? null : parent.weaponTypeSecondaryProfs,
      parent == null ? null : parent.weaponSecondaryProfs);

    proficiencies.parentNumSecondarySkills = parent == null ? 0 : parent.numSecondarySkills;
    proficiencies.parentNumSecondaryTools = parent == null ? 0 : parent.numSecondaryTools;
  }

  private updateInheritedProficiencies(proficiencies: ListProficiency[],
      parentProficiencies: Proficiency[],
      parentChildProficiencies: Proficiency[]): void {
      proficiencies.forEach((prof: ListProficiency) => {
      prof.inheritedSecondaryProficient = parentProficiencies != null && this.isSecondaryProficient(prof.item, parentProficiencies);

      prof.childrenProficiencies.forEach((childProf: ListProficiency) => {
        childProf.inheritedSecondaryProficient = parentChildProficiencies != null &&
          this.isSecondaryProficient(childProf.item, parentChildProficiencies);
      });
    });
  }

  setSecondaryProficiencies(proficiencyCollection: ProficiencyCollection, characterClass: CharacterClass): void {
    //abilities
    const savingThrowProfs: Proficiency[] = [];
    proficiencyCollection.savingThrowProficiencies.forEach((prof: ListProficiency) => {
      if (prof.secondaryProficient) {
        const proficiency = new Proficiency();
        proficiency.proficient = true;
        proficiency.attribute = new ProficiencyListObject();
        proficiency.attribute.id = prof.item.id;
        proficiency.attribute.name = prof.item.name;
        savingThrowProfs.push(proficiency);
      }
    });
    characterClass.savingThrowSecondaryProfs = savingThrowProfs;

    //armors
    const armorTypeProfs: Proficiency[] = [];
    const armorProfs: Proficiency[] = [];
    proficiencyCollection.armorProficiencies.forEach((prof: ListProficiency) => {
      if (prof.secondaryProficient) {
        const proficiency = new Proficiency();
        proficiency.proficient = true;
        proficiency.attribute = new ProficiencyListObject();
        proficiency.attribute.id = prof.item.id;
        proficiency.attribute.name = prof.item.name;
        armorTypeProfs.push(proficiency);
      }

      prof.childrenProficiencies.forEach((childProf: ListProficiency) => {
        if (childProf.secondaryProficient) {
          const proficiency = new Proficiency();
          proficiency.proficient = true;
          proficiency.attribute = new ProficiencyListObject();
          proficiency.attribute.id = childProf.item.id;
          proficiency.attribute.name = childProf.item.name;
          armorProfs.push(proficiency);
        }
      });
    });
    characterClass.armorTypeSecondaryProfs = armorTypeProfs;
    characterClass.armorSecondaryProfs = armorProfs;

    //languages
    const languageProfs: Proficiency[] = [];
    proficiencyCollection.languageProficiencies.forEach((prof: ListProficiency) => {
      if (prof.secondaryProficient) {
        const proficiency = new Proficiency();
        proficiency.proficient = true;
        proficiency.attribute = new ProficiencyListObject();
        proficiency.attribute.id = prof.item.id;
        proficiency.attribute.name = prof.item.name;
        languageProfs.push(proficiency);
      }
    });
    characterClass.languageSecondaryProfs = languageProfs;

    //skills
    const skillProfs: Proficiency[] = [];
    proficiencyCollection.skillProficiencies.forEach((prof: ListProficiency) => {
      if (prof.secondaryProficient) {
        const proficiency = new Proficiency();
        proficiency.proficient = true;
        proficiency.attribute = new ProficiencyListObject();
        proficiency.attribute.id = prof.item.id;
        proficiency.attribute.name = prof.item.name;
        skillProfs.push(proficiency);
      }
    });
    characterClass.skillSecondaryProfs = skillProfs;

    //skill choices
    const skillChoices: Proficiency[] = [];
    proficiencyCollection.skillChoiceProficiencies.forEach((prof: ListProficiency) => {
      if (prof.secondaryProficient) {
        const proficiency = new Proficiency();
        proficiency.proficient = true;
        proficiency.attribute = new ProficiencyListObject();
        proficiency.attribute.id = prof.item.id;
        proficiency.attribute.name = prof.item.name;
        skillChoices.push(proficiency);
      }
    });
    characterClass.skillSecondaryChoiceProfs = skillChoices;
    characterClass.numSecondarySkills = proficiencyCollection.numSecondarySkills;

    //tools
    const toolCategoryProfs: Proficiency[] = [];
    const toolProfs: Proficiency[] = [];
    proficiencyCollection.toolProficiencies.forEach((prof: ListProficiency) => {
      if (prof.secondaryProficient) {
        const proficiency = new Proficiency();
        proficiency.proficient = true;
        proficiency.attribute = new ProficiencyListObject();
        proficiency.attribute.id = prof.item.id;
        proficiency.attribute.name = prof.item.name;
        toolCategoryProfs.push(proficiency);
      }

      prof.childrenProficiencies.forEach((childProf: ListProficiency) => {
        if (childProf.secondaryProficient) {
          const proficiency = new Proficiency();
          proficiency.proficient = true;
          proficiency.attribute = new ProficiencyListObject();
          proficiency.attribute.id = childProf.item.id;
          proficiency.attribute.name = childProf.item.name;
          toolProfs.push(proficiency);
        }
      });
    });
    characterClass.toolCategorySecondaryProfs = toolCategoryProfs;
    characterClass.toolSecondaryProfs = toolProfs;

    //tool choices
    const toolChoices: Proficiency[] = [];
    proficiencyCollection.toolChoiceProficiencies.forEach((prof: ListProficiency) => {
      if (prof.secondaryProficient) {
        const proficiency = new Proficiency();
        proficiency.proficient = true;
        proficiency.attribute = new ProficiencyListObject();
        proficiency.attribute.id = prof.item.id;
        proficiency.attribute.name = prof.item.name;
        toolChoices.push(proficiency);
      }
    });
    characterClass.toolCategorySecondaryChoiceProfs = toolChoices;
    characterClass.numSecondaryTools = proficiencyCollection.numSecondaryTools;

    //weapons
    const weaponTypeProfs: Proficiency[] = [];
    const weaponProfs: Proficiency[] = [];
    proficiencyCollection.weaponProficiencies.forEach((prof: ListProficiency) => {
      if (prof.secondaryProficient) {
        const proficiency = new Proficiency();
        proficiency.proficient = true;
        proficiency.attribute = new ProficiencyListObject();
        proficiency.attribute.id = prof.item.id;
        proficiency.attribute.name = prof.item.name;
        weaponTypeProfs.push(proficiency);
      }

      prof.childrenProficiencies.forEach((childProf: ListProficiency) => {
        if (childProf.secondaryProficient) {
          const proficiency = new Proficiency();
          proficiency.proficient = true;
          proficiency.attribute = new ProficiencyListObject();
          proficiency.attribute.id = childProf.item.id;
          proficiency.attribute.name = childProf.item.name;
          weaponProfs.push(proficiency);
        }
      });
    });
    characterClass.weaponTypeSecondaryProfs = weaponTypeProfs;
    characterClass.weaponSecondaryProfs = weaponProfs;
  }

  setAllSecondaryProfs(characterClass: CharacterClass): void {
    if (characterClass == null) {
      return;
    }
    characterClass.armorSecondaryProfs = this.getAllArmorSecondaryProfs(characterClass);
    characterClass.armorTypeSecondaryProfs = this.getAllArmorTypeSecondaryProfs(characterClass);
    characterClass.languageSecondaryProfs = this.getAllLanguageSecondaryProfs(characterClass);
    characterClass.savingThrowSecondaryProfs = this.getAllSavingThrowSecondaryProfs(characterClass);
    characterClass.skillSecondaryProfs = this.getAllSkillProfsSecondaryProfs(characterClass);
    characterClass.skillSecondaryChoiceProfs = this.getAllSkillChoiceSecondaryProfs(characterClass);
    characterClass.toolCategorySecondaryProfs = this.getAllToolCategorySecondaryProfs(characterClass);
    characterClass.toolCategorySecondaryChoiceProfs = this.getAllToolCategoryChoiceSecondaryProfs(characterClass);
    characterClass.toolSecondaryProfs = this.getAllToolSecondaryProfs(characterClass);
    characterClass.weaponSecondaryProfs = this.getAllWeaponProfsSecondaryProfs(characterClass);
    characterClass.weaponTypeSecondaryProfs = this.getAllWeaponTypeSecondaryProfs(characterClass);

    characterClass.numSecondarySkills = this.getAllNumSecondarySkills(characterClass);
    characterClass.numSecondaryTools = this.getAllNumSecondaryTools(characterClass);
  }

  getParent(characterClass: CharacterClass): CharacterClass {
    return characterClass.parent == null ? null : characterClass.parent as CharacterClass;
  }

  getAllNumSecondarySkills(characterClass: CharacterClass): number {
    let num = 0;
    if (characterClass.parent) {
      num = this.getAllNumSecondarySkills(this.getParent(characterClass));
    }
    num += characterClass.numSecondarySkills;
    return num;
  }

  getAllNumSecondaryTools(characterClass: CharacterClass): number {
    let num = 0;
    if (characterClass.parent) {
      num = this.getAllNumSecondaryTools(this.getParent(characterClass));
    }
    num += characterClass.numSecondaryTools;
    return num;
  }

  getAllArmorSecondaryProfs(characterClass: CharacterClass): Proficiency[] {
    let profs: Proficiency[] = [];
    if (characterClass.parent) {
      profs = this.getAllArmorSecondaryProfs(this.getParent(characterClass));
    }
    characterClass.armorSecondaryProfs.forEach((prof: Proficiency) => {
      profs.push(prof);
    });
    return profs;
  }

  getAllArmorTypeSecondaryProfs(characterClass: CharacterClass): Proficiency[] {
    let profs: Proficiency[] = [];
    if (characterClass.parent) {
      profs = this.getAllArmorTypeSecondaryProfs(this.getParent(characterClass));
    }
    characterClass.armorTypeSecondaryProfs.forEach((prof: Proficiency) => {
      profs.push(prof);
    });
    return profs;
  }

  getAllLanguageSecondaryProfs(characterClass: CharacterClass): Proficiency[] {
    let profs: Proficiency[] = [];
    if (characterClass.parent) {
      profs = this.getAllLanguageSecondaryProfs(this.getParent(characterClass));
    }
    characterClass.languageSecondaryProfs.forEach((prof: Proficiency) => {
      profs.push(prof);
    });
    return profs;
  }

  getAllSavingThrowSecondaryProfs(characterClass: CharacterClass): Proficiency[] {
    let profs: Proficiency[] = [];
    if (characterClass.parent) {
      profs = this.getAllSavingThrowSecondaryProfs(this.getParent(characterClass));
    }
    characterClass.savingThrowSecondaryProfs.forEach((prof: Proficiency) => {
      profs.push(prof);
    });
    return profs;
  }

  getAllSkillProfsSecondaryProfs(characterClass: CharacterClass): Proficiency[] {
    let profs: Proficiency[] = [];
    if (characterClass.parent) {
      profs = this.getAllSkillProfsSecondaryProfs(this.getParent(characterClass));
    }
    characterClass.skillSecondaryProfs.forEach((prof: Proficiency) => {
      profs.push(prof);
    });
    return profs;
  }

  getAllSkillChoiceSecondaryProfs(characterClass: CharacterClass): Proficiency[] {
    let profs: Proficiency[] = [];
    if (characterClass.parent) {
      profs = this.getAllSkillChoiceSecondaryProfs(this.getParent(characterClass));
    }
    characterClass.skillSecondaryChoiceProfs.forEach((prof: Proficiency) => {
      profs.push(prof);
    });
    return profs;
  }

  getAllToolCategorySecondaryProfs(characterClass: CharacterClass): Proficiency[] {
    let profs: Proficiency[] = [];
    if (characterClass.parent) {
      profs = this.getAllToolCategorySecondaryProfs(this.getParent(characterClass));
    }
    characterClass.toolCategorySecondaryProfs.forEach((prof: Proficiency) => {
      profs.push(prof);
    });
    return profs;
  }

  getAllToolCategoryChoiceSecondaryProfs(characterClass: CharacterClass): Proficiency[] {
    let profs: Proficiency[] = [];
    if (characterClass.parent) {
      profs = this.getAllToolCategoryChoiceSecondaryProfs(this.getParent(characterClass));
    }
    characterClass.toolCategorySecondaryChoiceProfs.forEach((prof: Proficiency) => {
      profs.push(prof);
    });
    return profs;
  }

  getAllToolSecondaryProfs(characterClass: CharacterClass): Proficiency[] {
    let profs: Proficiency[] = [];
    if (characterClass.parent) {
      profs = this.getAllToolSecondaryProfs(this.getParent(characterClass));
    }
    characterClass.toolSecondaryProfs.forEach((prof: Proficiency) => {
      profs.push(prof);
    });
    return profs;
  }

  getAllWeaponProfsSecondaryProfs(characterClass: CharacterClass): Proficiency[] {
    let profs: Proficiency[] = [];
    if (characterClass.parent) {
      profs = this.getAllWeaponProfsSecondaryProfs(this.getParent(characterClass));
    }
    characterClass.weaponSecondaryProfs.forEach((prof: Proficiency) => {
      profs.push(prof);
    });
    return profs;
  }

  getAllWeaponTypeSecondaryProfs(characterClass: CharacterClass): Proficiency[] {
    let profs: Proficiency[] = [];
    if (characterClass.parent) {
      profs = this.getAllWeaponTypeSecondaryProfs(this.getParent(characterClass));
    }
    characterClass.weaponTypeSecondaryProfs.forEach((prof: Proficiency) => {
      profs.push(prof);
    });
    return profs;
  }

  initializeAbilityScoreIncreases(characterClass: CharacterClass, levels: ListObject[]): AbilityScoreIncreaseCollection {
    const collection = new AbilityScoreIncreaseCollection();
    levels.forEach((level: ListObject) => {
      const item = new AbilityScoreIncreaseCollectionItem();
      item.level = level;
      item.checked = this.isChecked(characterClass, level);
      item.inheritedChecked = characterClass.parent != null && this.isChecked(this.getParent(characterClass), level);
      collection.levels.push(item);
    });
    return collection;
  }

  isChecked(characterClass: CharacterClass, level: ListObject): boolean {
    const index = _.indexOf(characterClass.abilityScoreIncreases, level.id);
    return index > -1;
  }

  createCopyOfAbilityCollection(collection: AbilityScoreIncreaseCollection): AbilityScoreIncreaseCollection {
    return _.cloneDeep(collection);
  }

  setAllAbilityScoreIncreases(characterClass: CharacterClass): void {
    if (characterClass == null) {
      return;
    }
    characterClass.abilityScoreIncreases = this.getAllAbilityScoreIncreases(characterClass);
  }

  getAllAbilityScoreIncreases(characterClass: CharacterClass): string[] {
    let increases: string[] = [];
    if (characterClass.parent) {
      increases = this.getAllAbilityScoreIncreases(this.getParent(characterClass));
    }
    characterClass.abilityScoreIncreases.forEach((increase: string) => {
      increases.push(increase);
    });
    return increases;
  }

  setAbilityScoreIncreases(collection: AbilityScoreIncreaseCollection, characterClass: CharacterClass): void {
    const increases: string[] = [];
    collection.levels.forEach((item: AbilityScoreIncreaseCollectionItem) => {
      if (item.checked) {
        increases.push(item.level.id);
      }
    });
    characterClass.abilityScoreIncreases = increases;
  }
}
