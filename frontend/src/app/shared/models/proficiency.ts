export class Proficiency {
  attribute: ProficiencyListObject;
  proficient = false;
  miscModifier = 0;
  advantage = false;
  advantageDisabled = false;
  advantageTooltip = '';
  disadvantage = false;
  disadvantageDisabled = false;
  disadvantageTooltip = '';
  doubleProf = false;
  halfProf = false;
  roundUp = false;
}

export class ProficiencyListObject {
  id: string;
  name: string;
  proficiencyType: ProficiencyType;
  description = '';
  sid = 0;
  author = false;
  categoryId = '';
}

export enum ProficiencyType {
  ABILITY = 'ABILITY',
  ARMOR = 'ARMOR',
  ARMOR_TYPE = 'ARMOR_TYPE',
  LANGUAGE = 'LANGUAGE',
  SKILL = 'SKILL',
  TOOL = 'TOOL',
  TOOL_CATEGORY = 'TOOL_CATEGORY',
  WEAPON = 'WEAPON',
  WEAPON_TYPE = 'WEAPON_TYPE',
  MISC = 'MISC'
}
