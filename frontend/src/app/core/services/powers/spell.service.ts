import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {PowerService} from './power.service';
import {MenuService} from '../../../shared/components/list-menu/list-menu.component';
import {MenuItem} from '../../../shared/models/menuItem.model';
import {ListObject} from '../../../shared/models/list-object';
import {CharacterLevelService} from '../character-level.service';
import {Spell} from '../../../shared/models/powers/spell';
import {PowerType} from '../../../shared/models/powers/power-type.enum';
import {Power} from '../../../shared/models/powers/power';
import {Filters} from '../../components/filters/filters';
import {PowerModifier} from '../../../shared/models/powers/power-modifier';
import {DamageConfigurationCollection} from '../../../shared/models/damage-configuration-collection';
import * as _ from 'lodash';
import {DamageConfiguration} from '../../../shared/models/damage-configuration';
import {ModifierService} from '../modifier.service';
import {ModifierConfigurationCollection} from '../../../shared/models/modifier-configuration-collection';
import {ModifierConfiguration} from '../../../shared/models/modifier-configuration';
import {Creature} from '../../../shared/models/creatures/creature';
import {TranslateService} from '@ngx-translate/core';
import {SpellListObject} from '../../../shared/models/powers/spell-list-object';
import {environment} from '../../../../environments/environment';
import {ListSource} from '../../../shared/models/list-source.enum';

@Injectable({
  providedIn: 'root'
})
export class SpellService implements MenuService {
  private items: MenuItem[] = [];
  menuItems: BehaviorSubject<MenuItem[]> = new BehaviorSubject<MenuItem[]>(this.items);
  private spells: SpellListObject[] = [];
  private publicSpells: SpellListObject[] = [];
  private privateSpells: SpellListObject[] = [];

  constructor(
    private http: HttpClient,
    private powerService: PowerService,
    private characterLevelService: CharacterLevelService,
    private modifierService: ModifierService,
    private translate: TranslateService
  ) {
  }

  private resetCache(listSource: ListSource): void {
    switch (listSource) {
      case ListSource.MY_STUFF:
        this.spells = [];
        break;
      case ListSource.PUBLIC_CONTENT:
        this.publicSpells = [];
        break;
      case ListSource.PRIVATE_CONTENT:
        this.privateSpells = [];
        break;
    }
  }

  private getCached(listSource: ListSource): SpellListObject[] {
    switch (listSource) {
      case ListSource.MY_STUFF:
        return this.spells;
      case ListSource.PUBLIC_CONTENT:
        return this.publicSpells;
      case ListSource.PRIVATE_CONTENT:
        return this.privateSpells;
    }
  }

  private updateCache(list: SpellListObject[], listSource: ListSource): void {
    switch (listSource) {
      case ListSource.MY_STUFF:
        this.spells = list;
        break;
      case ListSource.PUBLIC_CONTENT:
        this.publicSpells = list;
        break;
      case ListSource.PRIVATE_CONTENT:
        this.privateSpells = list;
        break;
    }
  }

  updateMenuItems(id: string, listSource: ListSource = ListSource.MY_STUFF, filters: Filters = null): void {
    this.updateMenuItemsWithFilters(id, listSource, filters);
  }

  updateMenuItemsWithFilters(id: string, listSource: ListSource, filters: Filters): void {
    if (filters == null) {
      this.resetCache(listSource);
    }
    this.getSpellsWithFilters(listSource, filters).then((spells: SpellListObject[]) => {
      const menuItems: MenuItem[] = [];
      spells.forEach((spell: ListObject) => {
        menuItems.push(new MenuItem(spell.id, spell.name, '', '', false));
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

  createSpell(spell: Spell): Promise<string> {
    spell.powerType = PowerType.SPELL;
    return this.powerService.createPower(spell).then((id: string) => {
      this.spells = [];
      return id;
    });
  }

  getSpells(listSource: ListSource = ListSource.MY_STUFF): Promise<SpellListObject[]> {
    const cache = this.getCached(listSource);
    if (cache.length > 0) {
      return Promise.resolve(cache.slice());
    } else {
      return this.powerService.getSpells(listSource).then((spells: SpellListObject[]) => {
        this.updateCache(spells, listSource);
        return spells;
      });
    }
  }

  getSpellsWithFilters(listSource: ListSource, filters: Filters): Promise<SpellListObject[]> {
    if (filters == null || filters.filterValues.length === 0 || !filters.filtersApplied) {
      return this.getSpells(listSource);
    }

    return this.http.post<SpellListObject[]>(`${environment.backendUrl}/powers/type/${PowerType.SPELL}?source=${listSource}`, filters).toPromise();
  }

  getList(listSource: ListSource, filters: Filters, clearCache: boolean): Promise<ListObject[]> {
    if (clearCache) {
      this.resetCache(listSource);
    }
    return this.getSpellsWithFilters(listSource, filters);
  }

  getSpell(id: string): Promise<Power> {
    return this.powerService.getPower(id);
  }

  updateSpell(spell: Spell): Promise<any> {
    return this.powerService.updatePower(spell);
  }

  deleteSpell(spell: Spell): Promise<any> {
    return this.powerService.deletePower(spell).then(() => {
      this.spells = [];
    });
  }

  duplicateSpell(spell: Spell, name: string): Promise<string> {
    return this.powerService.duplicatePower(spell, name).then((id: string) => {
      this.spells = [];
      return id;
    });
  }

  /*********************************** Modifiers **********************************/

  getSpellAttackModifier(powerModifier: PowerModifier, powerModifiers: number, creature: Creature): number {
    if (powerModifier == null) {
      return 0;
    }
    let modifier = powerModifier.abilityModifier + powerModifier.profModifier + powerModifier.proficiency.miscModifier + powerModifiers;
    if (creature.creatureHealth.resurrectionPenalty > 0) {
      modifier -= creature.creatureHealth.resurrectionPenalty;
    }
    return modifier;
  }

  getSpellAttackModifierTooltip(powerModifier: PowerModifier, modifierTooltips: string[], creature: Creature): string {
    if (powerModifier == null) {
      return '';
    }
    let parts = [];
    if (powerModifier.abilityModifier !== 0) {
      parts.push(this.translate.instant('Labels.Ability') + ' ' + powerModifier.abilityModifier);
    }

    if (powerModifier.profModifier !== 0) {
      parts.push(this.translate.instant('Labels.Prof') + ' '  + powerModifier.profModifier)
    }

    parts = parts.concat(modifierTooltips);

    if (powerModifier.proficiency.miscModifier !== 0) {
      parts.push(this.translate.instant('Labels.Misc') + ' '  + powerModifier.proficiency.miscModifier);
    }
    if (creature.creatureHealth.resurrectionPenalty > 0) {
      parts.push(this.translate.instant('Labels.ResurrectionPenalty') + ' -'  + creature.creatureHealth.resurrectionPenalty);
    }

    return parts.join('\n');
  }

  getSpellSaveDC(powerModifier: PowerModifier, powerModifiers: number): number {
    if (powerModifier == null) {
      return 0;
    }
    let modifier = 8 + powerModifier.abilityModifier + powerModifier.profModifier + powerModifier.proficiency.miscModifier + powerModifiers;
    if (modifier < 0) {
      modifier = 0;
    }
    return modifier;
  }

  getSpellSaveDCTooltip(powerModifier: PowerModifier, modifierTooltips: string[]): string {
    if (powerModifier == null) {
      return '';
    }
    let parts = [];
    parts.push(this.translate.instant('Labels.Base') + ' 8');

    if (powerModifier.abilityModifier !== 0) {
      parts.push(this.translate.instant('Labels.Ability') + ' '  + powerModifier.abilityModifier);
    }

    if (powerModifier.profModifier !== 0) {
      parts.push(this.translate.instant('Labels.Prof') + ' '  + powerModifier.profModifier)
    }

    parts = parts.concat(modifierTooltips);

    if (powerModifier.proficiency.miscModifier !== 0) {
      parts.push(this.translate.instant('Labels.Misc') + ' '  + powerModifier.proficiency.miscModifier);
    }

    return parts.join('\n');
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

  getModifierForSelectedLevel(collection: ModifierConfigurationCollection, spellLevel: number, selectedSlot: number): ModifierConfigurationCollection {
    if (collection == null) {
      return null;
    }

    const config = _.cloneDeep(collection);
    if (selectedSlot > spellLevel) {
      if (config.extraModifiers && config.numLevelsAboveBase > 0) {
        const numSteps = (selectedSlot - spellLevel) / config.numLevelsAboveBase;
        for (let i = 0; i < numSteps; i++) {
          config.extraModifierConfigurations.forEach((damage: ModifierConfiguration) => {
            config.modifierConfigurations.push(damage);
          });
        }

        config.modifierConfigurations = this.powerService.combineModifiers(config.modifierConfigurations);
      }
    }

    config.extraModifiers = false;
    return config;
  }
}
