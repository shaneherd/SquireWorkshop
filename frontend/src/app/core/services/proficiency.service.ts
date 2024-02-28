import { Injectable } from '@angular/core';
import {AbilityService} from './attributes/ability.service';
import {ArmorTypeService} from './attributes/armor-type.service';
import {ItemService} from './items/item.service';
import {LanguageService} from './attributes/language.service';
import {SkillService} from './attributes/skill.service';
import {ToolCategoryService} from './attributes/tool-category.service';
import {WeaponTypeService} from './attributes/weapon-type.service';
import {ProficiencyCollection} from '../../shared/models/proficiency-collection';
import {ListObject} from '../../shared/models/list-object';
import {Proficiency, ProficiencyListObject} from '../../shared/models/proficiency';
import {ListProficiency} from '../../shared/models/list-proficiency';
import {Characteristic} from '../../shared/models/characteristics/characteristic';
import {Attribute} from '../../shared/models/attributes/attribute';
import {Modifier} from '../../shared/models/modifier';
import {ListModifier} from '../../shared/models/list-modifier';
import {ListSource} from '../../shared/models/list-source.enum';
import {CreatureListProficiency} from '../../shared/models/creatures/creature-list-proficiency';

@Injectable({
  providedIn: 'root'
})
export class ProficienciesService {

  constructor(
    private abilityService: AbilityService,
    private armorTypeService: ArmorTypeService,
    private itemService: ItemService,
    private languageService: LanguageService,
    private skillService: SkillService,
    private toolCategoryService: ToolCategoryService,
    private weaponTypeService: WeaponTypeService
  ) { }

  initializeProfs(characteristic: Characteristic, parent: Characteristic, listSource: ListSource): Promise<ProficiencyCollection> {
    const proficiencies = new ProficiencyCollection();
    const promises = [];
    promises.push(this.initializeAbilityModifiers(proficiencies, characteristic, parent, listSource));
    promises.push(this.initializeSavingThrowProfs(proficiencies, characteristic, parent, listSource));
    promises.push(this.initializeArmorProfs(proficiencies, characteristic, parent, listSource));
    promises.push(this.initializeLanguageProfs(proficiencies, characteristic, parent, listSource));
    promises.push(this.initializeSkillsProfs(proficiencies, characteristic, parent, listSource));
    promises.push(this.initializeToolProfs(proficiencies, characteristic, parent, listSource));
    promises.push(this.initializeWeaponProfs(proficiencies, characteristic, parent, listSource));

    proficiencies.numSavingThrows = characteristic.numSavingThrows;
    proficiencies.numAbilities = characteristic.numAbilities;
    proficiencies.numLanguages = characteristic.numLanguages;
    proficiencies.numSkills = characteristic.numSkills;
    proficiencies.numTools = characteristic.numTools;

    proficiencies.parentNumSavingThrows = parent == null ? 0 : parent.numSavingThrows;
    proficiencies.parentNumAbilities = parent == null ? 0 : parent.numAbilities;
    proficiencies.parentNumLanguages = parent == null ? 0 : parent.numLanguages;
    proficiencies.parentNumSkills = parent == null ? 0 : parent.numSkills;
    proficiencies.parentNumTools = parent == null ? 0 : parent.numTools;

    return Promise.all(promises).then(() => {
      this.addMissingProficiencies(characteristic, proficiencies);
      return proficiencies;
    });
  }

  private addMissingProficiencies(characteristic: Characteristic, collection: ProficiencyCollection): void {
    this.addMissingProficienciesToCollection(characteristic.armorTypeProfs, collection.armorProficiencies);
    this.addMissingProficienciesToCollection(characteristic.languageProfs, collection.languageProficiencies);
    this.addMissingProficienciesToCollection(characteristic.savingThrowProfs, collection.savingThrowProficiencies);
    this.addMissingProficienciesToCollection(characteristic.skillProfs, collection.skillProficiencies);
    this.addMissingProficienciesToCollection(characteristic.skillChoiceProfs, collection.skillChoiceProficiencies);
    this.addMissingProficienciesToCollection(characteristic.toolCategoryProfs, collection.toolProficiencies);
    this.addMissingProficienciesToCollection(characteristic.toolCategoryChoiceProfs, collection.toolChoiceProficiencies);
    this.addMissingProficienciesToCollection(characteristic.toolProfs, collection.toolProficiencies);
    this.addMissingProficienciesToCollection(characteristic.weaponTypeProfs, collection.weaponProficiencies);
    this.addMissingProficienciesToCollection(characteristic.armorProfs, collection.armorProficiencies, true);
    this.addMissingProficienciesToCollection(characteristic.weaponProfs, collection.weaponProficiencies, true);
  }

  private addMissingProficienciesToCollection(proficiencies: Proficiency[], collection: ListProficiency[], nested: boolean = false): void {
    proficiencies.forEach((proficiency: Proficiency) => {
      let prof = this.getListProficiency(proficiency.attribute.id, collection);
      if (prof == null) {
        prof = new ListProficiency(new ListObject(proficiency.attribute.id, proficiency.attribute.name));
        prof.proficient = true;
        prof.inheritedProficient = false;
        prof.categoryId = proficiency.attribute.categoryId;
        if (!nested) {
          collection.push(prof);
        } else if (proficiency.attribute.categoryId != null && proficiency.attribute.categoryId !== '') {
          const parent = this.getListProficiency(proficiency.attribute.categoryId, collection);
          if (parent != null) {
            parent.childrenProficiencies.push(prof);
          }
        }
      }
    });
  }

  private getListProficiency(itemId: string, profs: ListProficiency[]): ListProficiency {
    for (let i = 0; i < profs.length; i++) {
      let prof = profs[i];
      if (prof.item.id === itemId) {
        return prof;
      }
      if (prof.childrenProficiencies.length > 0) {
        prof = this.getListProficiency(itemId, prof.childrenProficiencies);
        if (prof != null) {
          return prof;
        }
      }
    }
    return null;
  }

//  combineCollections(collections: ProficiencyCollection[]): ProficiencyCollection {
//    const combined: ProficiencyCollection = new ProficiencyCollection();
//    collections.forEach((collection: ProficiencyCollection) => {
//      this.combineProficiencies(combined.savingThrowProficiencies, collection.savingThrowProficiencies);
//      this.combineProficiencies(combined.armorProficiencies, collection.armorProficiencies);
//      this.combineProficiencies(combined.languageProficiencies, collection.languageProficiencies);
//      this.combineProficiencies(combined.skillProficiencies, collection.skillProficiencies);
//      this.combineProficiencies(combined.skillChoiceProficiencies, collection.skillChoiceProficiencies);
//      this.combineProficiencies(combined.toolProficiencies, collection.toolProficiencies);
//      this.combineProficiencies(combined.toolChoiceProficiencies, collection.toolChoiceProficiencies);
//      this.combineProficiencies(combined.weaponProficiencies, collection.weaponProficiencies);
//
//      this.combineModifiers(combined.abilityModifiers, collection.abilityModifiers);
//
//      combined.numSavingThrows += collection.numSavingThrows;
//      combined.numAbilities += collection.numAbilities;
//      combined.numLanguages += collection.numLanguages;
//      combined.numSkills += collection.numSkills;
//      combined.numSecondarySkills += collection.numSecondarySkills;
//      combined.numTools += collection.numTools;
//      combined.numSecondaryTools += collection.numSecondaryTools;
//
//      combined.parentNumSavingThrows += collection.parentNumSavingThrows;
//      combined.parentNumAbilities += collection.parentNumAbilities;
//      combined.parentNumLanguages += collection.parentNumLanguages;
//      combined.parentNumTools += collection.parentNumTools;
//      combined.parentNumSecondaryTools += collection.parentNumSecondaryTools;
//      combined.parentNumSkills += collection.parentNumSkills;
//      combined.parentNumSecondarySkills += collection.parentNumSecondarySkills;
//    });
//    return combined;
//  }

//  private combineProficiencies(combined: ListProficiency[], profs: ListProficiency[]): void {
//    profs.forEach((prof: ListProficiency) => {
//      const current = this.getProf(prof.item, combined);
//      if (current == null) {
//        combined.push(prof);
//      } else {
//        current.proficient = current.proficient || prof.proficient;
//        current.secondaryProficient = current.secondaryProficient || prof.secondaryProficient;
//        current.inheritedProficient = current.inheritedProficient || prof.inheritedProficient;
//        current.inheritedSecondaryProficient = current.inheritedSecondaryProficient || prof.inheritedSecondaryProficient;
//      }
//    });
//  }

//  private getProf(item: ListObject, profs: ListProficiency[]): ListProficiency {
//    for (let i = 0; i < profs.length; i++) {
//      if (profs[i].item.id === item.id) {
//        return profs[i];
//      }
//    }
//    return null;
//  }

//  private combineModifiers(combined: ListModifier[], modifiers: ListModifier[]): void {
//    modifiers.forEach((modifier: ListModifier) => {
//      const current: ListModifier = this.getModifier(modifier.item, combined);
//      if (current == null) {
//        combined.push(modifier);
//      } else {
//        current.value = current.value || modifier.value;
//        current.parentValue = current.parentValue || modifier.parentValue;
//      }
//    });
//  }

//  private getModifier(item: ListObject, profs: ListModifier[]): ListModifier {
//    for (let i = 0; i < profs.length; i++) {
//      if (profs[i].item.id === item.id) {
//        return profs[i];
//      }
//    }
//    return null;
//  }

  updateParentProfs(proficiencies: ProficiencyCollection, parent: Characteristic): void {
    this.updateInheritedModifiers(proficiencies.abilityModifiers, parent == null ? null : parent.abilityModifiers);
    this.updateInheritedProficiencies(proficiencies.savingThrowProficiencies,
      parent == null ? null : parent.savingThrowProfs,
      null);
    this.updateInheritedProficiencies(proficiencies.armorProficiencies,
      parent == null ? null : parent.armorTypeProfs,
      parent == null ? null : parent.armorProfs);
    this.updateInheritedProficiencies(proficiencies.languageProficiencies,
      parent == null ? null : parent.languageProfs,
      null);
    this.updateInheritedProficiencies(proficiencies.skillProficiencies,
      parent == null ? null : parent.skillProfs,
      null);
    this.updateInheritedProficiencies(proficiencies.skillChoiceProficiencies,
      parent == null ? null : parent.skillChoiceProfs,
      null);
    this.updateInheritedProficiencies(proficiencies.toolProficiencies,
      parent == null ? null : parent.toolCategoryProfs,
      parent == null ? null : parent.toolProfs);
    this.updateInheritedProficiencies(proficiencies.toolChoiceProficiencies,
      parent == null ? null : parent.toolCategoryChoiceProfs,
      null);
    this.updateInheritedProficiencies(proficiencies.weaponProficiencies,
      parent == null ? null : parent.weaponTypeProfs,
      parent == null ? null : parent.weaponProfs);

    proficiencies.parentNumSavingThrows = parent == null ? 0 : parent.numSavingThrows;
    proficiencies.parentNumAbilities = parent == null ? 0 : parent.numAbilities;
    proficiencies.parentNumLanguages = parent == null ? 0 : parent.numLanguages;
    proficiencies.parentNumSkills = parent == null ? 0 : parent.numSkills;
    proficiencies.parentNumTools = parent == null ? 0 : parent.numTools;
  }

  private updateInheritedModifiers(modifiers: ListModifier[],
                                       parentModifiers: Modifier[]): void {
    modifiers.forEach((modifier: ListModifier) => {
      modifier.parentValue = parentModifiers == null ? 0 : this.getValue(modifier.item, parentModifiers);
    });
  }

  private updateInheritedProficiencies(proficiencies: ListProficiency[],
                                    parentProficiencies: Proficiency[],
                                    parentChildProficiencies: Proficiency[]): void {
    proficiencies.forEach((prof: ListProficiency) => {
      prof.inheritedProficient = parentProficiencies != null && this.isProficient(prof.item, parentProficiencies);

      prof.childrenProficiencies.forEach((childProf: ListProficiency) => {
        childProf.inheritedProficient = parentChildProficiencies != null && this.isProficient(childProf.item, parentChildProficiencies);
      });
    });
  }

  private isProficient(attribute: ListObject, proficiencies: Proficiency[]): boolean {
    for (let i = 0; i < proficiencies.length; i++) {
      const prof: Proficiency = proficiencies[i];
      if (prof.attribute.id === attribute.id) {
        return true;
      }
    }
    return false;
  }

  private getValue(attribute: ListObject, modifiers: Modifier[]): number {
    for (let i = 0; i < modifiers.length; i++) {
      const modifier: Modifier = modifiers[i];
      if (modifier.attribute.id === attribute.id) {
        return modifier.value;
      }
    }
    return 0;
  }

  initializeAbilityModifiers(proficiencies: ProficiencyCollection, characteristic: Characteristic, parent: Characteristic, listSource: ListSource):
    Promise<ListModifier[]> {
    proficiencies.abilityModifiers = [];
    return this.abilityService.getAbilities(listSource).then((abilities: ListObject[]) => {
      abilities.forEach((ability: ListObject) => {
        const mod = new ListModifier(new ListObject(ability.id, ability.name));
        mod.value = this.getValue(ability, characteristic.abilityModifiers);
        mod.parentValue = parent == null ? 0 : this.getValue(ability, parent.abilityModifiers);
        proficiencies.abilityModifiers.push(mod);
      });
      return proficiencies.abilityModifiers;
    });
  }

  initializeSavingThrowProfs(proficiencies: ProficiencyCollection, characteristic: Characteristic, parent: Characteristic, listSource: ListSource):
    Promise<ListProficiency[]> {
    proficiencies.savingThrowProficiencies = [];
    return this.abilityService.getAbilities(listSource).then((abilities: ListObject[]) => {
      abilities.forEach((ability: ListObject) => {
        const prof = new ListProficiency(new ListObject(ability.id, ability.name));
        prof.proficient = this.isProficient(ability, characteristic.savingThrowProfs);
        prof.inheritedProficient = parent != null && this.isProficient(ability, parent.savingThrowProfs);
        proficiencies.savingThrowProficiencies.push(prof);
      });
      return proficiencies.savingThrowProficiencies;
    });
  }

  initializeArmorProfs(proficiencies: ProficiencyCollection, characteristic: Characteristic, parent: Characteristic, listSource: ListSource):
    Promise<ListProficiency[]> {
    proficiencies.armorProficiencies = [];
    return this.armorTypeService.getArmorTypes(listSource).then((armorTypes: ListObject[]) => {
      const promises = [];
      armorTypes.forEach((armorType: ListObject) => {
        const prof = new ListProficiency(armorType);
        prof.proficient = this.isProficient(armorType, characteristic.armorTypeProfs);
        prof.inheritedProficient = parent != null && this.isProficient(armorType, parent.armorTypeProfs);
        proficiencies.armorProficiencies.push(prof);

        promises.push(this.itemService.getArmorsByArmorType(armorType, listSource).then((armors: ListObject[]) => {
          armors.forEach((armor: ListObject) => {
            const childProf = new ListProficiency(armor);
            childProf.parentProficiency = prof;
            childProf.proficient = this.isProficient(armor, characteristic.armorProfs);
            childProf.inheritedProficient = parent != null && this.isProficient(armor, parent.armorProfs);
            childProf.categoryId = armorType.id;
            prof.childrenProficiencies.push(childProf);
          });
        }));
      });

      return Promise.all(promises).then(() => {
        return proficiencies.armorProficiencies;
      });
    });
  }

  initializeLanguageProfs(proficiencies: ProficiencyCollection, characteristic: Characteristic, parent: Characteristic, listSource: ListSource):
    Promise<ListProficiency[]> {
    proficiencies.languageProficiencies = [];
    return this.languageService.getLanguages(listSource).then((languages: ListObject[]) => {
      languages.forEach((language: ListObject) => {
        const prof = new ListProficiency(language);
        prof.proficient = this.isProficient(language, characteristic.languageProfs);
        prof.inheritedProficient = parent != null && this.isProficient(language, parent.languageProfs);
        proficiencies.languageProficiencies.push(prof);
      });
      return proficiencies.languageProficiencies;
    });
  }

  initializeSkillsProfs(proficiencies: ProficiencyCollection, characteristic: Characteristic, parent: Characteristic, listSource: ListSource):
    Promise<ListProficiency[]> {
    proficiencies.skillProficiencies = [];
    return this.skillService.getSkills(listSource).then((skills: ListObject[]) => {
      skills.forEach((skill: ListObject) => {
        const prof = new ListProficiency(skill);
        prof.proficient = this.isProficient(skill, characteristic.skillProfs);
        prof.inheritedProficient = parent != null && this.isProficient(skill, parent.skillProfs);
        proficiencies.skillProficiencies.push(prof);

        const choiceProf = new ListProficiency(skill);
        choiceProf.proficient = this.isProficient(skill, characteristic.skillChoiceProfs);
        choiceProf.inheritedProficient = parent != null && this.isProficient(skill, parent.skillChoiceProfs);
        proficiencies.skillChoiceProficiencies.push(choiceProf);
      });
      return proficiencies.skillProficiencies;
    });
  }

  initializeToolProfs(proficiencies: ProficiencyCollection, characteristic: Characteristic, parent: Characteristic, listSource: ListSource):
    Promise<ListProficiency[]> {
    proficiencies.toolProficiencies = [];
    return this.toolCategoryService.getToolCategories(listSource).then((toolCategories: ListObject[]) => {
      const promises = [];
      toolCategories.forEach((toolCategory: ListObject) => {
        const prof = new ListProficiency(toolCategory);
        prof.proficient = this.isProficient(toolCategory, characteristic.toolCategoryProfs);
        prof.inheritedProficient = parent != null && this.isProficient(toolCategory, parent.toolCategoryProfs);
        proficiencies.toolProficiencies.push(prof);

        const choiceProf = new ListProficiency(toolCategory);
        choiceProf.proficient = this.isProficient(toolCategory, characteristic.toolCategoryChoiceProfs);
        choiceProf.inheritedProficient = parent != null && this.isProficient(toolCategory, parent.toolCategoryChoiceProfs);
        proficiencies.toolChoiceProficiencies.push(choiceProf);

        promises.push(this.itemService.getToolsByToolCategory(toolCategory, listSource).then((weapons: ListObject[]) => {
          weapons.forEach((weapon: ListObject) => {
            const childProf = new ListProficiency(weapon);
            childProf.parentProficiency = prof;
            childProf.proficient = this.isProficient(weapon, characteristic.toolProfs);
            childProf.inheritedProficient = parent != null && this.isProficient(weapon, parent.toolProfs);
            prof.childrenProficiencies.push(childProf);
          });
        }));
      });

      return Promise.all(promises).then(() => {
        return proficiencies.toolProficiencies;
      });
    });
  }

  initializeWeaponProfs(proficiencies: ProficiencyCollection, characteristic: Characteristic, parent: Characteristic, listSource: ListSource):
    Promise<ListProficiency[]> {
    proficiencies.weaponProficiencies = [];
    return this.weaponTypeService.getWeaponTypes(listSource).then((weaponTypes: ListObject[]) => {
      const promises = [];
      weaponTypes.forEach((weaponType: ListObject) => {
        const prof = new ListProficiency(weaponType);
        prof.proficient = this.isProficient(weaponType, characteristic.weaponTypeProfs);
        prof.inheritedProficient = parent != null && this.isProficient(weaponType, parent.weaponTypeProfs);
        proficiencies.weaponProficiencies.push(prof);

        promises.push(this.itemService.getWeaponsByWeaponType(weaponType, listSource).then((weapons: ListObject[]) => {
          weapons.forEach((weapon: ListObject) => {
            const childProf = new ListProficiency(weapon);
            childProf.parentProficiency = prof;
            childProf.proficient = this.isProficient(weapon, characteristic.weaponProfs);
            childProf.inheritedProficient = parent != null && this.isProficient(weapon, parent.weaponProfs);
            childProf.categoryId = weaponType.id;
            prof.childrenProficiencies.push(childProf);
          });
        }));
      });

      return Promise.all(promises).then(() => {
        return proficiencies.weaponProficiencies;
      });
    });
  }

  setProficiencies(proficiencyCollection: ProficiencyCollection, characteristic: Characteristic): void {
    //abilities
    const savingThrowProfs: Proficiency[] = [];
    proficiencyCollection.savingThrowProficiencies.forEach((prof: ListProficiency) => {
      if (prof.proficient) {
        const proficiency = new Proficiency();
        proficiency.proficient = true;
        proficiency.attribute = new ProficiencyListObject();
        proficiency.attribute.id = prof.item.id;
        proficiency.attribute.name = prof.item.name;
        savingThrowProfs.push(proficiency);
      }
    });
    characteristic.savingThrowProfs = savingThrowProfs;
    characteristic.numSavingThrows = proficiencyCollection.numSavingThrows;

    //ability modifiers
    const abilityModifiers: Modifier[] = [];
    proficiencyCollection.abilityModifiers.forEach((modifier: ListModifier) => {
      if (modifier.value !== 0) {
        const mod = new Modifier();
        mod.attribute = new Attribute();
        mod.attribute.id = modifier.item.id;
        mod.attribute.name = modifier.item.name;
        mod.value = modifier.value;
        abilityModifiers.push(mod);
      }
    });
    characteristic.abilityModifiers = abilityModifiers;
    characteristic.numAbilities = proficiencyCollection.numAbilities;

    //armors
    const armorTypeProfs: Proficiency[] = [];
    const armorProfs: Proficiency[] = [];
    proficiencyCollection.armorProficiencies.forEach((prof: ListProficiency) => {
      if (prof.proficient) {
        const proficiency = new Proficiency();
        proficiency.proficient = true;
        proficiency.attribute = new ProficiencyListObject();
        proficiency.attribute.id = prof.item.id;
        proficiency.attribute.name = prof.item.name;
        armorTypeProfs.push(proficiency);
      }

      prof.childrenProficiencies.forEach((childProf: ListProficiency) => {
        if (childProf.proficient) {
          const proficiency = new Proficiency();
          proficiency.proficient = true;
          proficiency.attribute = new ProficiencyListObject();
          proficiency.attribute.id = childProf.item.id;
          proficiency.attribute.name = childProf.item.name;
          armorProfs.push(proficiency);
        }
      });
    });
    characteristic.armorTypeProfs = armorTypeProfs;
    characteristic.armorProfs = armorProfs;

    //languages
    const languageProfs: Proficiency[] = [];
    proficiencyCollection.languageProficiencies.forEach((prof: ListProficiency) => {
      if (prof.proficient) {
        const proficiency = new Proficiency();
        proficiency.proficient = true;
        proficiency.attribute = new ProficiencyListObject();
        proficiency.attribute.id = prof.item.id;
        proficiency.attribute.name = prof.item.name;
        languageProfs.push(proficiency);
      }
    });
    characteristic.languageProfs = languageProfs;
    characteristic.numLanguages = proficiencyCollection.numLanguages;

    //skills
    const skillProfs: Proficiency[] = [];
    const skillChoiceProfs: Proficiency[] = [];
    proficiencyCollection.skillProficiencies.forEach((prof: ListProficiency) => {
      if (prof.proficient) {
        const proficiency = new Proficiency();
        proficiency.proficient = true;
        proficiency.attribute = new ProficiencyListObject();
        proficiency.attribute.id = prof.item.id;
        proficiency.attribute.name = prof.item.name;
        skillProfs.push(proficiency);
      }
    });
    proficiencyCollection.skillChoiceProficiencies.forEach((prof: ListProficiency) => {
      if (prof.proficient) {
        const proficiency = new Proficiency();
        proficiency.proficient = true;
        proficiency.attribute = new ProficiencyListObject();
        proficiency.attribute.id = prof.item.id;
        proficiency.attribute.name = prof.item.name;
        skillChoiceProfs.push(proficiency);
      }
    });
    characteristic.skillProfs = skillProfs;
    characteristic.skillChoiceProfs = skillChoiceProfs;
    characteristic.numSkills = proficiencyCollection.numSkills;

    //tools
    const toolCategoryProfs: Proficiency[] = [];
    const toolCategoryChoiceProfs: Proficiency[] = [];
    const toolProfs: Proficiency[] = [];
    proficiencyCollection.toolProficiencies.forEach((prof: ListProficiency) => {
      if (prof.proficient) {
        const proficiency = new Proficiency();
        proficiency.proficient = true;
        proficiency.attribute = new ProficiencyListObject();
        proficiency.attribute.id = prof.item.id;
        proficiency.attribute.name = prof.item.name;
        toolCategoryProfs.push(proficiency);
      }

      prof.childrenProficiencies.forEach((childProf: ListProficiency) => {
        if (childProf.proficient) {
          const proficiency = new Proficiency();
          proficiency.proficient = true;
          proficiency.attribute = new ProficiencyListObject();
          proficiency.attribute.id = childProf.item.id;
          proficiency.attribute.name = childProf.item.name;
          toolProfs.push(proficiency);
        }
      });
    });
    proficiencyCollection.toolChoiceProficiencies.forEach((prof: ListProficiency) => {
      if (prof.proficient) {
        const proficiency = new Proficiency();
        proficiency.proficient = true;
        proficiency.attribute = new ProficiencyListObject();
        proficiency.attribute.id = prof.item.id;
        proficiency.attribute.name = prof.item.name;
        toolCategoryChoiceProfs.push(proficiency);
      }
    });
    characteristic.toolCategoryProfs = toolCategoryProfs;
    characteristic.toolCategoryChoiceProfs = toolCategoryChoiceProfs;
    characteristic.toolProfs = toolProfs;
    characteristic.numTools = proficiencyCollection.numTools;

    //weapons
    const weaponTypeProfs: Proficiency[] = [];
    const weaponProfs: Proficiency[] = [];
    proficiencyCollection.weaponProficiencies.forEach((prof: ListProficiency) => {
      if (prof.proficient) {
        const proficiency = new Proficiency();
        proficiency.proficient = true;
        proficiency.attribute = new ProficiencyListObject();
        proficiency.attribute.id = prof.item.id;
        proficiency.attribute.name = prof.item.name;
        weaponTypeProfs.push(proficiency);
      }

      prof.childrenProficiencies.forEach((childProf: ListProficiency) => {
        if (childProf.proficient) {
          const proficiency = new Proficiency();
          proficiency.proficient = true;
          proficiency.attribute = new ProficiencyListObject();
          proficiency.attribute.id = childProf.item.id;
          proficiency.attribute.name = childProf.item.name;
          weaponProfs.push(proficiency);
        }
      });
    });
    characteristic.weaponTypeProfs = weaponTypeProfs;
    characteristic.weaponProfs = weaponProfs;
  }

  /**************************** Set Profs ***********************************/

  setAllProfs(characteristic: Characteristic): void {
    if (characteristic == null) {
      return;
    }
    characteristic.abilityModifiers = this.getAllAbilityModifiers(characteristic);
    characteristic.armorProfs = this.getAllArmorProfs(characteristic);
    characteristic.armorTypeProfs = this.getAllArmorTypeProfs(characteristic);
    characteristic.languageProfs = this.getAllLanguageProfs(characteristic);
    characteristic.savingThrowProfs = this.getAllSavingThrowProfs(characteristic);
    characteristic.skillProfs = this.getAllSkillProfsProfs(characteristic);
    characteristic.skillChoiceProfs = this.getAllSkillChoiceProfs(characteristic);
    characteristic.toolCategoryProfs = this.getAllToolCategoryProfs(characteristic);
    characteristic.toolCategoryChoiceProfs = this.getAllToolCategoryChoiceProfs(characteristic);
    characteristic.toolProfs = this.getAllToolProfs(characteristic);
    characteristic.weaponProfs = this.getAllWeaponProfsProfs(characteristic);
    characteristic.weaponTypeProfs = this.getAllWeaponTypeProfs(characteristic);

    characteristic.numSavingThrows = this.getAllNumSavingThrows(characteristic);
    characteristic.numAbilities = this.getAllNumAbilities(characteristic);
    characteristic.numLanguages = this.getAllNumLanguages(characteristic);
    characteristic.numSkills = this.getAllNumSkills(characteristic);
    characteristic.numTools = this.getAllNumTools(characteristic);
  }

  getAllNumSavingThrows(characteristic: Characteristic): number {
    let num = 0;
    if (characteristic.parent) {
      num = this.getAllNumSavingThrows(characteristic.parent);
    }
    num += characteristic.numSavingThrows;
    return num;
  }

  getAllNumAbilities(characteristic: Characteristic): number {
    let num = 0;
    if (characteristic.parent) {
      num = this.getAllNumAbilities(characteristic.parent);
    }
    num += characteristic.numAbilities;
    return num;
  }

  getAllNumLanguages(characteristic: Characteristic): number {
    let num = 0;
    if (characteristic.parent) {
      num = this.getAllNumLanguages(characteristic.parent);
    }
    num += characteristic.numLanguages;
    return num;
  }

  getAllNumSkills(characteristic: Characteristic): number {
    let num = 0;
    if (characteristic.parent) {
      num = this.getAllNumSkills(characteristic.parent);
    }
    num += characteristic.numSkills;
    return num;
  }

  getAllNumTools(characteristic: Characteristic): number {
    let num = 0;
    if (characteristic.parent) {
      num = this.getAllNumTools(characteristic.parent);
    }
    num += characteristic.numTools;
    return num;
  }

  getAllAbilityModifiers(characteristic: Characteristic): Modifier[] {
    let modifiers: Modifier[] = [];
    if (characteristic.parent) {
      modifiers = this.getAllAbilityModifiers(characteristic.parent);
    }
    characteristic.abilityModifiers.forEach((modifier: Modifier) => {
      this.combineModifiers(modifier, modifiers);
    });
    return modifiers;
  }

  combineModifiers(modifier: Modifier, modifiers: Modifier[]): void {
    let found = false;
    modifiers.forEach((mod: Modifier) => {
      if (mod.attribute.id === modifier.attribute.id) {
        mod.value += modifier.value;
        found = true;
      }
    });

    if (!found) {
      modifiers.push(modifier);
    }
  }

  getAllArmorProfs(characteristic: Characteristic): Proficiency[] {
    let profs: Proficiency[] = [];
    if (characteristic.parent) {
      profs = this.getAllArmorProfs(characteristic.parent);
    }
    characteristic.armorProfs.forEach((prof: Proficiency) => {
      profs.push(prof);
    });
    return profs;
  }

  getAllArmorTypeProfs(characteristic: Characteristic): Proficiency[] {
    let profs: Proficiency[] = [];
    if (characteristic.parent) {
      profs = this.getAllArmorTypeProfs(characteristic.parent);
    }
    characteristic.armorTypeProfs.forEach((prof: Proficiency) => {
      profs.push(prof);
    });
    return profs;
  }

  getAllLanguageProfs(characteristic: Characteristic): Proficiency[] {
    let profs: Proficiency[] = [];
    if (characteristic.parent) {
      profs = this.getAllLanguageProfs(characteristic.parent);
    }
    characteristic.languageProfs.forEach((prof: Proficiency) => {
      profs.push(prof);
    });
    return profs;
  }

  getAllSavingThrowProfs(characteristic: Characteristic): Proficiency[] {
    let profs: Proficiency[] = [];
    if (characteristic.parent) {
      profs = this.getAllSavingThrowProfs(characteristic.parent);
    }
    characteristic.savingThrowProfs.forEach((prof: Proficiency) => {
      profs.push(prof);
    });
    return profs;
  }

  getAllSkillProfsProfs(characteristic: Characteristic): Proficiency[] {
    let profs: Proficiency[] = [];
    if (characteristic.parent) {
      profs = this.getAllSkillProfsProfs(characteristic.parent);
    }
    characteristic.skillProfs.forEach((prof: Proficiency) => {
      profs.push(prof);
    });
    return profs;
  }

  getAllSkillChoiceProfs(characteristic: Characteristic): Proficiency[] {
    let profs: Proficiency[] = [];
    if (characteristic.parent) {
      profs = this.getAllSkillChoiceProfs(characteristic.parent);
    }
    characteristic.skillChoiceProfs.forEach((prof: Proficiency) => {
      profs.push(prof);
    });
    return profs;
  }

  getAllToolCategoryProfs(characteristic: Characteristic): Proficiency[] {
    let profs: Proficiency[] = [];
    if (characteristic.parent) {
      profs = this.getAllToolCategoryProfs(characteristic.parent);
    }
    characteristic.toolCategoryProfs.forEach((prof: Proficiency) => {
      profs.push(prof);
    });
    return profs;
  }

  getAllToolCategoryChoiceProfs(characteristic: Characteristic): Proficiency[] {
    let profs: Proficiency[] = [];
    if (characteristic.parent) {
      profs = this.getAllToolCategoryChoiceProfs(characteristic.parent);
    }
    characteristic.toolCategoryChoiceProfs.forEach((prof: Proficiency) => {
      profs.push(prof);
    });
    return profs;
  }

  getAllToolProfs(characteristic: Characteristic): Proficiency[] {
    let profs: Proficiency[] = [];
    if (characteristic.parent) {
      profs = this.getAllToolProfs(characteristic.parent);
    }
    characteristic.toolProfs.forEach((prof: Proficiency) => {
      profs.push(prof);
    });
    return profs;
  }

  getAllWeaponProfsProfs(characteristic: Characteristic): Proficiency[] {
    let profs: Proficiency[] = [];
    if (characteristic.parent) {
      profs = this.getAllWeaponProfsProfs(characteristic.parent);
    }
    characteristic.weaponProfs.forEach((prof: Proficiency) => {
      profs.push(prof);
    });
    return profs;
  }

  getAllWeaponTypeProfs(characteristic: Characteristic): Proficiency[] {
    let profs: Proficiency[] = [];
    if (characteristic.parent) {
      profs = this.getAllWeaponTypeProfs(characteristic.parent);
    }
    characteristic.weaponTypeProfs.forEach((prof: Proficiency) => {
      profs.push(prof);
    });
    return profs;
  }

}
