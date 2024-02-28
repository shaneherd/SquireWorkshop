import {Injectable} from '@angular/core';
import {Attribute} from '../../../shared/models/attributes/attribute';
import {AttributeType} from '../../../shared/models/attributes/attribute-type.enum';
import {ArmorType} from '../../../shared/models/attributes/armor-type';
import {CasterType} from '../../../shared/models/attributes/caster-type';
import {SpellSlots} from '../../../shared/models/spell-slots';
import {Skill} from '../../../shared/models/attributes/skill';
import {Language} from '../../../shared/models/attributes/language';
import {Condition} from '../../../shared/models/attributes/condition';
import {ExportSharedService} from './export-shared.service';
import {WeaponProperty} from '../../../shared/models/attributes/weapon-property';
import {ToolCategory} from '../../../shared/models/attributes/tool-category';
import {ExportDetailsService} from './export.service';
import {ExportCacheService} from './export-cache.service';
import {SID} from '../../../constants';

@Injectable({
  providedIn: 'root'
})
export class ExportAttributeService implements ExportDetailsService {

  constructor(
    private exportCacheService: ExportCacheService,
    private exportSharedService: ExportSharedService
  ) { }

  export(id: string, proExport: boolean): Promise<object> {
    return this.exportCacheService.getAttribute(id).then((attribute: Attribute) => {
      return this.processAttribute(attribute, proExport);
    });
  }

  processObject(object: Object, proExport: boolean): Promise<object> {
    return Promise.resolve(this.processAttribute(object as Attribute, proExport));
  }

  processAttribute(attribute: Attribute, proExport: boolean): object {
    switch (attribute.attributeType) {
      case AttributeType.ARMOR_TYPE:
        const armorType = attribute as ArmorType;
        return this.processArmorType(armorType);
      case AttributeType.CASTER_TYPE:
        const casterType = attribute as CasterType;
        return this.processCasterType(casterType);
      case AttributeType.CONDITION:
        if (!proExport) {
          return null;
        }
        const condition = attribute as Condition;
        return this.processCondition(condition);
      case AttributeType.LANGUAGE:
        const language = attribute as Language;
        return this.processLanguage(language);
      case AttributeType.SKILL:
        if (!proExport) {
          return null;
        }
        const skill = attribute as Skill;
        return this.processSkill(skill, proExport);
      case AttributeType.WEAPON_PROPERTY:
        if (!proExport) {
          return null;
        }
        const weaponProperty = attribute as WeaponProperty;
        return this.processWeaponProperty(weaponProperty);
    }
    return null;
  }

  processArmorType(armorType: ArmorType): object {
    return {
      'type': 'ArmorType',
      'doff': armorType.doff,
      'doffTimeUnit': this.exportSharedService.getTimeUnit(armorType.doffTimeUnit),
      'don': armorType.don,
      'donTimeUnit': this.exportSharedService.getTimeUnit(armorType.donTimeUnit),
      'name': armorType.name
    }
  }

  processCasterType(casterType: CasterType): object {
    if (casterType == null) {
      return this.getNoneCasterType();
    }
    const json = {
      'type': 'CasterType',
      'id': 1,
      'multiClassWeight': casterType.multiClassWeight,
      'name': casterType.name,
      'roundUp': casterType.roundUp,
      'spellSlots': []
    }
    casterType.spellSlots.forEach((spellSlot: SpellSlots) => {
      const slot = this.processSpellSlot(spellSlot);
      json['spellSlots'].push(slot);
    });
    return json;
  }

  private getNoneCasterType(): object {
    const json = {
      'type': 'CasterType',
      'id': 5, // 5 = none
      'multiClassWeight': 0,
      'name': 'None',
      'roundUp': false,
      'spellSlots': []
    }
    for (let i = 1; i <= 20; i++) {
      const slot = this.getNoneSpellSlot(i);
      json['spellSlots'].push(slot);
    }
    return json;
  }

  private getNoneSpellSlot(level: number): object {
    return {
      'type': 'SpellSlots',
      'level': this.exportSharedService.processLevelByValue(level),
      'slot1': 0,
      'slot2': 0,
      'slot3': 0,
      'slot4': 0,
      'slot5': 0,
      'slot6': 0,
      'slot7': 0,
      'slot8': 0,
      'slot9': 0
    };
  }

  private processSpellSlot(spellSlot: SpellSlots): object {
    return {
      'type': 'SpellSlots',
      'level': this.exportSharedService.processLevel(spellSlot.characterLevel),
      'slot1': spellSlot.slot1,
      'slot2': spellSlot.slot2,
      'slot3': spellSlot.slot3,
      'slot4': spellSlot.slot4,
      'slot5': spellSlot.slot5,
      'slot6': spellSlot.slot6,
      'slot7': spellSlot.slot7,
      'slot8': spellSlot.slot8,
      'slot9': spellSlot.slot9
    };
  }

  processCondition(condition: Condition): object {
    return {
      'type': 'Condition',
      'description': condition.description,
      'name': condition.name
    }
  }

  processLanguage(language: Language): object {
    return {
      'type': 'Language',
      'hash': 0,
      'name': language.name,
      'script': language.script
    }
  }

  processSkill(skill: Skill, proExport: boolean): object {
    const object = {
      'type': 'Skill',
      'abilityModifier': {
        'type': 'Ability',
        'abbr': skill.ability.abbr,
        'id': this.exportSharedService.getAbilityId(skill.ability.sid),
        'miscModifier': 0,
        'name': skill.ability.name,
        'raceModifier': 0,
        'roll': 0
      },
      'advantage': {
        'type': 'Advantage',
        'advantage': false,
        'disadvantage': false
      },
      'doubleProf': false,
      'halveProf': false,
      'id': this.exportSharedService.getSkillId(skill.sid),
      'miscModifier': 0,
      'name': skill.name,
      'prof': false,
      'roundUp': false
    }
    if (proExport) {
      object['description'] = skill.sid === 0 ? skill.description : '';
    }
    return object;
  }

  processWeaponProperty(weaponProperty: WeaponProperty): object {
    return {
      'type': 'WeaponProperty',
      'description': weaponProperty.description,
      'name': weaponProperty.name
    }
  }

  processToolCategory(toolCategory: ToolCategory): object {
    if (toolCategory.sid === 0) {
      return {
        'type': 'ToolCategoryType',
        'description': 'These special tools include the items needed to pursue a craft or trade. Proficiency with a set of artisan\'s tools lets you add your proficiency bonus to any ability checks you make using the tools in your craft.',
        'id': this.exportSharedService.getToolCategoryId(SID.TOOL_CATEGORIES.ARTISANS_TOOLS),
        'name': 'Artisan\'s Tools'
      }
    }
    return {
      'type': 'ToolCategoryType',
      'description': toolCategory.description,
      'id': 0,
      'name': toolCategory.name
    }
  }
}
