import {Component, Input, OnInit} from '@angular/core';
import {MagicalItem} from '../../../../../shared/models/items/magical-item';
import {MagicalItemSpellConfiguration} from '../../../../../shared/models/items/magical-item-spell-configuration';
import {SpellListObject} from '../../../../../shared/models/powers/spell-list-object';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {MagicalItemType} from '../../../../../shared/models/items/magical-item-type.enum';
import {MagicalItemApplicability, MagicalItemApplicabilityDisplay} from '../../../../../shared/models/items/magical-item-applicability';
import {MagicalItemApplicabilityType} from '../../../../../shared/models/items/magical-item-applicability-type.enum';
import {TranslateService} from '@ngx-translate/core';
import {SpellFilterService} from '../../../../../core/services/spell-filter.service';
import {MagicalItemSpellAttackCalculationType} from '../../../../../shared/models/items/magical-item-spell-attack-calculation-type.enum';
import {MagicalItemTable, MagicalItemTableRow} from '../../../../../shared/models/items/magical-item-table';
import {ItemService} from '../../../../../core/services/items/item.service';
import {Filters} from '../../../../../core/components/filters/filters';
import {CharacterLevelService} from '../../../../../core/services/character-level.service';
import {ListSource} from '../../../../../shared/models/list-source.enum';

@Component({
  selector: 'app-magical-item-spells',
  templateUrl: './magical-item-spells.component.html',
  styleUrls: ['./magical-item-spells.component.scss']
})
export class MagicalItemSpellsComponent implements OnInit {
  @Input() magicalItem: MagicalItem;
  @Input() editing: boolean;
  @Input() disabled: boolean;
  @Input() listSource: ListSource = ListSource.MY_STUFF;

  addingSpells = false;
  configuringItem: MagicalItemSpellConfiguration;
  clickDisabled = false;
  applicableSpell: MagicalItemApplicabilityDisplay = null;
  editingApplicableSpell = false;
  applicableSpells: MagicalItemApplicabilityDisplay[] = [];

  isScroll = false;
  POTION = MagicalItemType.POTION;
  isTable = true;
  isCaster = false;
  isCustom = false;
  isNone = false;
  calculationTypes: MagicalItemSpellAttackCalculationType[] = [];
  scrollTable: MagicalItemTable;

  constructor(
    private translate: TranslateService,
    private spellFilterService: SpellFilterService,
    private itemService: ItemService,
    private characterLevelService: CharacterLevelService
  ) { }

  ngOnInit() {
    this.isScroll = this.magicalItem.magicalItemType === MagicalItemType.SCROLL;
    this.initializeScrollTable();
    this.initializeApplicableSpells();
    this.initializeCalculationTypes();
    this.updateCalculationTypeFlags();
  }

  private initializeScrollTable(): void {
    this.scrollTable = new MagicalItemTable();

    this.scrollTable.columns.push(this.translate.instant('Headers.SpellLevel'));
    this.scrollTable.columns.push(this.translate.instant('Headers.Attack'));
    this.scrollTable.columns.push(this.translate.instant('Headers.Save'));

    for (let i = 0; i < 10; i++) {
      const row = new MagicalItemTableRow();
      row.values.push(i === 0 ? this.translate.instant('Cantrip') : i.toString());
      row.values.push(`+${this.itemService.getScrollSpellAttackModifier(i).toString()}`);
      row.values.push(this.itemService.getScrollSpellSaveDC(i).toString());
      this.scrollTable.rows.push(row);
    }
  }

  private initializeApplicableSpells(): void {
    this.applicableSpells = [];
    this.spellFilterService.initializeFilterOptions(this.listSource).then(() => {
      if (this.magicalItem.applicableSpells.length === 0) {
        const config = new MagicalItemApplicability();
        config.magicalItemApplicabilityType = MagicalItemApplicabilityType.FILTER;
        config.filters = new Filters();
        this.magicalItem.applicableSpells.push(config);
      }

      this.magicalItem.applicableSpells.forEach((config: MagicalItemApplicability) => {
        const item = new MagicalItemApplicabilityDisplay();
        item.magicalItemApplicability = config;
        item.display = this.getApplicableSpellName(config);
        this.applicableSpells.push(item);
      });
    });
  }

  spellClick(config: MagicalItemSpellConfiguration): void {
    if (!this.disabled && !this.clickDisabled) {
      this.configuringItem = config;
      this.updateDisabled();
    }
  }

  updateSpellConfiguration(config: MagicalItemSpellConfiguration): void {
    this.configuringItem = null;
    this.updateDisabled();
  }

  deleteSpell(config: MagicalItemSpellConfiguration): void {
    const index = this.magicalItem.spells.indexOf(config);
    if (index > -1) {
      this.magicalItem.spells.splice(index, 1);
      this.configuringItem = null;
      this.updateDisabled();
    }
  }

  cancelConfiguration(): void {
    this.configuringItem = null;
    this.updateDisabled();
  }

  addSpells(): void {
    if (!this.disabled && !this.clickDisabled) {
      this.addingSpells = true;
    }
  }

  cancelAddSpells(): void {
    this.addingSpells = false;
    this.updateDisabled();
  }

  continueAddSpells(selectedSpells: SpellListObject[]): void {
    this.addingSpells = false;
    this.updateDisabled();
    selectedSpells.forEach((spell: SpellListObject) => {
      const config = new MagicalItemSpellConfiguration();
      config.spell = spell;
      if (spell.level === 0) {
        config.casterLevel = this.characterLevelService.getLevelsDetailedFromStorage()[0];
      }
      config.storedLevel = spell.level;
      config.charges = 0;
      this.magicalItem.spells.push(config);
    });
  }

  additionalSpellsChange(event: MatCheckboxChange): void {
    this.magicalItem.additionalSpells = event.checked;
  }

  additionalSpellsRemoveOnCastingChange(event: MatCheckboxChange): void {
    this.magicalItem.additionalSpellsRemoveOnCasting = event.checked;
  }

  addApplicableSpell(): void {
    this.editingApplicableSpell = false;
    const config = new MagicalItemApplicabilityDisplay();
    config.magicalItemApplicability = new MagicalItemApplicability();
    config.magicalItemApplicability.magicalItemApplicabilityType = MagicalItemApplicabilityType.SPELL;
    this.applicableSpell = config;
    this.updateDisabled();
  }

  applicableSpellClick(config: MagicalItemApplicabilityDisplay): void {
    if (!this.disabled) {
      this.editingApplicableSpell = true;
      this.applicableSpell = config;
      this.updateDisabled();
    }
  }

  updateApplicableSpell(config: MagicalItemApplicability): void {
    this.applicableSpell.display = this.getApplicableSpellName(config);

    if (!this.editingApplicableSpell) {
      this.applicableSpells.push(this.applicableSpell);
      this.magicalItem.applicableSpells.push(config);
    }
    this.applicableSpell = null;
    this.updateDisabled();
  }

  deleteApplicableSpell(config: MagicalItemApplicability): void {
    let index = this.magicalItem.applicableSpells.indexOf(config);
    if (index > -1) {
      this.magicalItem.applicableSpells.splice(index, 1);
    }
    index = this.applicableSpells.indexOf(this.applicableSpell);
    if (index > -1) {
      this.applicableSpells.splice(index, 1);
    }
    this.applicableSpell = null;
    this.updateDisabled();
  }

  cancelApplicableSpell(): void {
    this.applicableSpell = null;
    this.updateDisabled();
  }

  private updateDisabled(): void {
    this.clickDisabled = this.addingSpells || this.configuringItem != null;
  }

  private getApplicableSpellName(config: MagicalItemApplicability): string {
    if (config.magicalItemApplicabilityType === MagicalItemApplicabilityType.SPELL) {
      return config.spell.name;
    } else {
      return this.translate.instant('Labels.Filter') + this.spellFilterService.getFilterDisplay(config.filters);
    }
  }

  private initializeCalculationTypes(): void {
    this.calculationTypes = [];
    this.calculationTypes.push(MagicalItemSpellAttackCalculationType.NONE);
    this.calculationTypes.push(MagicalItemSpellAttackCalculationType.TABLE);
    this.calculationTypes.push(MagicalItemSpellAttackCalculationType.CASTER);
    this.calculationTypes.push(MagicalItemSpellAttackCalculationType.CUSTOM);
  }

  spellAttackCalculationTypeChange(value: MagicalItemSpellAttackCalculationType): void {
    this.magicalItem.spellAttackCalculationType = value;
    this.updateCalculationTypeFlags();
  }

  private updateCalculationTypeFlags(): void {
    this.isTable = this.magicalItem.spellAttackCalculationType === MagicalItemSpellAttackCalculationType.TABLE;
    this.isCaster = this.magicalItem.spellAttackCalculationType === MagicalItemSpellAttackCalculationType.CASTER;
    this.isCustom = this.magicalItem.spellAttackCalculationType === MagicalItemSpellAttackCalculationType.CUSTOM;
    this.isNone = this.magicalItem.spellAttackCalculationType === MagicalItemSpellAttackCalculationType.NONE;
  }

  spellAttackChange(input): void {
    this.magicalItem.spellAttackModifier = input.value;
  }

  spellSaveDCChange(input): void {
    this.magicalItem.spellSaveDC = input.value;
  }

}
