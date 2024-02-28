import {Injectable} from '@angular/core';
import {Power} from '../../../shared/models/powers/power';
import {PowerType} from '../../../shared/models/powers/power-type.enum';
import {Spell} from '../../../shared/models/powers/spell';
import {Feature} from '../../../shared/models/powers/feature';
import {ExportSharedService} from './export-shared.service';
import {ListObject} from '../../../shared/models/list-object';
import {PowerService} from '../powers/power.service';
import {SpellSchool} from '../../../shared/models/attributes/spell-school';
import {PowerAreaOfEffect} from '../../../shared/models/powers/power-area-of-effect';
import {RangeType} from '../../../shared/models/powers/range-type.enum';
import {CharacteristicType} from '../../../shared/models/characteristics/characteristic-type.enum';
import {ExportDetailsService} from './export.service';
import {CharacteristicService} from '../characteristics/characteristic.service';
import {Characteristic} from '../../../shared/models/characteristics/characteristic';
import {ExportCacheService} from './export-cache.service';

@Injectable({
  providedIn: 'root'
})
export class ExportPowerService implements ExportDetailsService {

  constructor(
    private exportCacheService: ExportCacheService,
    private exportSharedService: ExportSharedService,
    private powerService: PowerService,
    private characteristicService: CharacteristicService
  ) { }

  export(id: string, proExport: boolean): Promise<object> {
    return this.exportCacheService.getPower(id).then((power: Power) => {
      return this.processPower(power, proExport);
    });
  }

  processObject(object: Object, proExport: boolean): Promise<object> {
    return this.processPower(object as Power, proExport)
  }

  async processPower(power: Power, proExport: boolean): Promise<object> {
    switch (power.powerType) {
      case PowerType.SPELL:
        const spell = power as Spell;
        return await this.processSpell(spell);
      case PowerType.FEATURE:
        const feature = power as Feature;
        return await this.processFeature(feature);
    }
    return null;
  }

  async processSpell(spell: Spell): Promise<object> {
    return {
      'type': 'Spell',
      'areaOfEffect': this.processAreaOfEffect(spell.powerAreaOfEffect),
      'castingTime': spell.castingTime,
      'castingTimeUnits': this.exportSharedService.getCastingTimeUnit(spell.castingTimeUnit, spell.castingTime),
      'classes': await this.processSpellClasses(spell),
      'components': spell.components,
      'concentration': spell.concentration,
      'description': spell.description,
      'duration': spell.duration,
      'hasAreaOfEffect': spell.powerAreaOfEffect != null && spell.powerAreaOfEffect.areaOfEffect != null,
      'higherLevels': spell.higherLevels,
      'id': this.exportSharedService.getSpellId(spell.sid),
      'instantaneous': spell.instantaneous,
      'level': spell.level,
      'm': spell.material,
      'name': spell.name,
      'range': this.exportSharedService.getRange(spell.rangeType, spell.range, spell.rangeUnit),
      'reactionTrigger': '',
      'ritual': spell.ritual,
      's': spell.somatic,
      'school': this.processSpellSchool(spell.spellSchool),
      // 'spellTags': [],
      'v': spell.verbal
    };
  }

  private async processSpellClasses(spell: Spell): Promise<object[]> {
    const classes = await this.powerService.getClasses(spell.id)
    const spellClasses = [];
    classes.forEach((characterClass: ListObject) => {
      spellClasses.push({
        'description': '',
        'id': this.exportSharedService.getClassId(characterClass.sid),
        'name': characterClass.name
      })
    });
    return spellClasses;
  }

  private processSpellSchool(spellSchool: SpellSchool): object {
    if (spellSchool == null) {
      return {
        'type': 'School',
        'description': '',
        'id': 0,
        'name': ''
      }
    }
    return {
      'type': 'School',
      'description': spellSchool.description,
      'id': this.exportSharedService.getSpellSchoolId(spellSchool.sid),
      'name': spellSchool.name
    }
  }

  private processAreaOfEffect(powerAreaOfEffect: PowerAreaOfEffect): object {
    const aoe = powerAreaOfEffect == null ? null : powerAreaOfEffect.areaOfEffect;
    return {
      'type': 'AreaOfEffect',
      'description': aoe == null ? '' : aoe.description,
      'name': aoe == null ? '' : aoe.name
    }
  }

  async processFeature(feature: Feature): Promise<object> {
    let parentClass = null;
    let subClass = null;
    if (feature.characteristicType === CharacteristicType.CLASS) {
      parentClass = feature.characteristic;
      const parent: Characteristic = await this.characteristicService.getParent(feature.characteristic.id);
      if (parent != null) {
        subClass = feature.characteristic;
        parentClass = parent;
      }
    }
    return {
      'type': 'Feature',
      'areaOfEffect': this.processAreaOfEffect(feature.powerAreaOfEffect),
      'background': this.processFeatureBackground(feature),
      'category': this.getFeatureCategory(feature.characteristicType),
      'characterClass': this.processFeatureClass(feature, parentClass),
      'description': feature.description,
      'hasAreaOfEffect': feature.powerAreaOfEffect != null && feature.powerAreaOfEffect.areaOfEffect != null,
      'id': 0,
      'minimumLevel': feature.characterLevel == null ? 0 : parseInt(feature.characterLevel.name, 10),
      'name': feature.name,
      'race': this.processFeatureRace(feature),
      'range': this.exportSharedService.getRange(feature.rangeType, feature.range, feature.rangeUnit),
      'subclass': this.processFeatureSubClass(feature, subClass),
      'ranged': feature.rangeType !== RangeType.SELF && feature.range > 0
    };
  }

  private getFeatureCategory(characteristicType: CharacteristicType): string {
    switch (characteristicType) {
      case CharacteristicType.CLASS:
        return 'CLASS';
      case CharacteristicType.RACE:
        return 'RACE';
      case CharacteristicType.BACKGROUND:
        return 'BACKGROUND';
    }
    return 'FEAT';
  }

  private processFeatureBackground(feature: Feature): object {
    if (feature.characteristicType !== CharacteristicType.BACKGROUND) {
      return {
        'description': '',
        'id': 0,
        'name': ''
      }
    }
    return {
      'description': feature.characteristic.description,
      'id': 1,
      'name': feature.characteristic.name
    }
  }

  private processFeatureClass(feature: Feature, parentClass: ListObject): object {
    if (feature.characteristicType !== CharacteristicType.CLASS || parentClass == null) {
      return {
        'description': '',
        'id': 0,
        'name': ''
      }
    }
    return {
      'description': parentClass.description,
      'id': 1,
      'name': parentClass.name
    }
  }

  private processFeatureSubClass(feature: Feature, subClass: ListObject): object {
    if (feature.characteristicType !== CharacteristicType.CLASS || subClass == null) {
      return {
        'description': '',
        'id': 0,
        'name': ''
      }
    }
    return {
      'description': subClass.description,
      'id': 2, // 1 is reserved for "no subclass chosen"
      'name': subClass.name
    }
  }

  private processFeatureRace(feature: Feature): object {
    if (feature.characteristicType !== CharacteristicType.RACE) {
      return {
        'id': 0,
        'name': '',
        'numParents': 0
      }
    }
    return {
      'id': 1,
      'name': feature.characteristic.name,
      'numParents': 0
    }
  }
}
