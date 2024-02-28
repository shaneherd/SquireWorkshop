import {ListProficiency} from './list-proficiency';
import {ListModifier} from './list-modifier';

export class ProficiencyCollection {
  savingThrowProficiencies: ListProficiency[] = [];
  armorProficiencies: ListProficiency[] = [];
  languageProficiencies: ListProficiency[] = [];
  skillProficiencies: ListProficiency[] = [];
  skillChoiceProficiencies: ListProficiency[] = [];
  toolProficiencies: ListProficiency[] = [];
  toolChoiceProficiencies: ListProficiency[] = [];
  weaponProficiencies: ListProficiency[] = [];
  miscProficiencies: ListProficiency[] = [];

  abilityModifiers: ListModifier[] = [];

  numSavingThrows = 0;
  numAbilities = 0;
  numLanguages = 0;
  numSkills = 0;
  numSecondarySkills = 0;
  numTools = 0;
  numSecondaryTools = 0;

  parentNumSavingThrows = 0;
  parentNumAbilities = 0;
  parentNumLanguages = 0;
  parentNumTools = 0;
  parentNumSecondaryTools = 0;
  parentNumSkills = 0;
  parentNumSecondarySkills = 0;
}
