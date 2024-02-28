import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {SpellListObject} from '../../../shared/models/powers/spell-list-object';
import {CreatureConfigurationCollection} from '../../../shared/models/creatures/configs/creature-configuration-collection';
import {Filters} from '../../../core/components/filters/filters';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {TranslateService} from '@ngx-translate/core';
import {CreatureService} from '../../../core/services/creatures/creature.service';
import {FilterDialogData} from '../../../core/components/filters/filter-dialog-data';
import {SpellFilterDialogComponent} from '../../../core/components/filters/spell-filter-dialog/spell-filter-dialog.component';
import {CreatureSpell} from '../../../shared/models/creatures/creature-spell';
import {ListObject} from '../../../shared/models/list-object';
import {ChosenClass} from '../../../shared/models/creatures/characters/chosen-class';
import {BarTagService} from '../../../core/services/bar-tag.service';
import {EVENTS} from '../../../constants';
import {EventsService} from '../../../core/services/events.service';
import {Subscription} from 'rxjs';
import {BarTagConfiguration} from '../../../shared/models/bar-tag-configuration';
import {Creature} from '../../../shared/models/creatures/creature';
import {CreatureType} from '../../../shared/models/creatures/creature-type.enum';
import {PlayerCharacter} from '../../../shared/models/creatures/characters/player-character';
import {BattleMonster} from '../../../shared/models/creatures/battle-monsters/battle-monster';
import {Characteristic} from '../../../shared/models/characteristics/characteristic';

export class SpellMenuItem {
  spell: SpellListObject;
  selected = false;
  tags: BarTagConfiguration[] = [];

  constructor(spell: SpellListObject, selected: boolean = false) {
    this.spell = spell;
    this.selected = selected;
  }
}

@Component({
  selector: 'app-spell-selection-list',
  templateUrl: './spell-selection-list.component.html',
  styleUrls: ['./spell-selection-list.component.scss']
})
export class SpellSelectionListComponent implements OnInit, OnDestroy {
  @Input() creature: Creature;
  @Input() collection: CreatureConfigurationCollection;
  @Input() characteristicId: string;
  @Output() save = new EventEmitter();
  @Output() close = new EventEmitter();

  headerName = '';
  loading = false;
  spells = new Map<string, SpellMenuItem>();
  filteredSpells: SpellMenuItem[] = [];
  searchedFilteredSpells: SpellMenuItem[] = [];
  searchValue = '';
  filters: Filters;
  viewingSpell: SpellMenuItem = null;
  showDropdown = false;
  characteristics: ListObject[] = [];
  eventSub: Subscription;
  selectedCount = 0;

  constructor(
    private dialog: MatDialog,
    private translate: TranslateService,
    private creatureService: CreatureService,
    private barTagService: BarTagService,
    private eventsService: EventsService
  ) { }

  ngOnInit() {
    this.filters = new Filters();
    this.headerName = this.translate.instant('Navigation.Manage.Spells.Add');
    this.initializeCharacteristics();
    this.initializeSpells();

    this.eventSub = this.eventsService.events.subscribe(event => {
      if (event === EVENTS.SpellTagsUpdated) {
        this.updateSpellTags();
      }
    });
  }

  private updateSpellTags(): void {
    this.spells.forEach((menuItem: SpellMenuItem) => {
      menuItem.tags = this.barTagService.initializeTags(menuItem.spell.tags, this.creature.creatureSpellCasting.tags);
    });
  }

  ngOnDestroy() {
    this.eventSub.unsubscribe();
  }

  private initializeCharacteristics(): void {
    this.showDropdown = this.characteristicId == null;
    if (!this.showDropdown) {
      return;
    }
    if (this.creature.creatureType === CreatureType.CHARACTER) {
      const playerCharacter = this.creature as PlayerCharacter;
      if (playerCharacter.characterSettings.spellcasting.displayClassSpellcasting) {
        playerCharacter.classes.forEach((chosenClass: ChosenClass) => {
          if (chosenClass.displaySpellcasting) {
            this.characteristics.push(chosenClass.characterClass);
          }
        });
      }
      if (playerCharacter.characterSettings.spellcasting.displayRaceSpellcasting) {
        this.characteristics.push(playerCharacter.characterRace.race);
      }
      if (playerCharacter.characterSettings.spellcasting.displayBackgroundSpellcasting) {
        if (playerCharacter.characterBackground.background != null) {
          this.characteristics.push(playerCharacter.characterBackground.background);
        }
      }
      if (playerCharacter.characterSettings.spellcasting.displayOtherSpellcasting) {
        this.characteristics.push(new ListObject('0', this.translate.instant('Other')));
      }
    } else if (this.creature.creatureType === CreatureType.MONSTER) {
      const battleMonster = this.creature as BattleMonster;
      if (battleMonster.monster.spellcaster) {
        const standard = new ListObject();
        standard.name = this.translate.instant('Standard');
        this.characteristics.push(standard);
      }
      if (battleMonster.monster.innateSpellcaster) {
        const innate = new ListObject();
        innate.name = this.translate.instant('Innate');
        innate.id = 'innate';
        this.characteristics.push(innate);
      }
    }

    if (this.characteristics.length > 0) {
      this.characteristicId = this.characteristics[0].id;
    } else {
      this.characteristicId = '0';
    }
  }

  characteristicChange(value: string): void {
    this.characteristicId = value;
    this.initializeSpells();
  }

  private initializeSpells(): void {
    this.loading = true;
    this.creatureService.getMissingSpells(this.creature, this.characteristicId, this.filters).then((spells: SpellListObject[]) => {
      this.setSpells(spells);
      this.filteredSpells = this.getFullSpellsList();
      this.loading = false;
      this.search(this.searchValue);
    });
  }

  private setSpells(spells: SpellListObject[]): void {
    this.spells.clear();
    spells.forEach((spell: SpellListObject) => {
      const menuItem = new SpellMenuItem(spell);
      menuItem.tags = this.barTagService.initializeTags(spell.tags, this.creature.creatureSpellCasting.tags);
      this.spells.set(spell.id, menuItem);
    });
  }

  private getFullSpellsList(): SpellMenuItem[] {
    const list: SpellMenuItem[] = [];
    this.spells.forEach((spell: SpellMenuItem, key: string) => {
      list.push(spell);
    });
    return list;
  }

  filter(): void {
    const self = this;
    const data = new FilterDialogData();
    data.filters = this.filters;
    data.tags = this.creature.creatureSpellCasting.tags;
    data.apply = (filters: Filters) => {
      self.applyFilters(filters);
    };
    data.clear = () => {
      self.applyFilters(new Filters());
    };

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = data;
    this.dialog.open(SpellFilterDialogComponent, dialogConfig);
  }

  private applyFilters(filters: Filters): void {
    this.filters = filters;
    this.creatureService.getMissingSpells(this.creature, this.characteristicId, this.filters).then((spells: SpellListObject[]) => {
      this.filteredSpells = this.getFilteredSpells(spells);
      this.search(this.searchValue);
    });
  }

  private getFilteredSpells(spells: SpellListObject[]): SpellMenuItem[] {
    const filtered: SpellMenuItem[] = [];
    spells.forEach((spell: SpellListObject) => {
      filtered.push(this.spells.get(spell.id));
    });
    return filtered;
  }

  search(searchValue: string): void {
    this.searchValue = searchValue;
    if (searchValue.length === 0) {
      this.searchedFilteredSpells = this.filteredSpells
    } else {
      const filtered: SpellMenuItem[] = [];
      const search = searchValue.toLowerCase();
      this.filteredSpells.forEach((spellMenuItem: SpellMenuItem) => {
        if (spellMenuItem.spell.name.toLowerCase().indexOf(search) > -1) {
          filtered.push(spellMenuItem);
        }
      });
      this.searchedFilteredSpells = filtered;
    }
  }

  spellClick(item: SpellMenuItem): void {
    this.viewingSpell = item;
  }

  toggleSelected(spell: SpellMenuItem): void {
    spell.selected = !spell.selected;
    this.viewingSpell = null;
    if (spell.selected) {
      this.selectedCount++;
    } else {
      this.selectedCount--;
    }
  }

  checkChange(spell: SpellMenuItem): void {
    if (spell.selected) {
      this.selectedCount++;
    } else {
      this.selectedCount--;
    }
  }

  closeDetails(): void {
    this.viewingSpell = null;
  }

  selectAll(): void {
    if (this.selectedCount > 0) {
      this.spells.forEach((spellMenuItem: SpellMenuItem) => {
        spellMenuItem.selected = false;
      });
      this.selectedCount = 0;
    } else {
      this.searchedFilteredSpells.forEach((spellMenuItem: SpellMenuItem) => {
        if (!spellMenuItem.selected) {
          spellMenuItem.selected = true;
          this.selectedCount++;
        }
      });
    }
  }

  addSelected(): void {
    this.loading = true;
    const selectedSpells: CreatureSpell[] = this.getSelectedSpells();
    if (selectedSpells.length > 0) {
      this.creatureService.addSpells(this.creature, this.characteristicId, selectedSpells).then(() => {
        this.loading = false;
        this.save.emit();
      });
    } else {
      this.loading = false;
      this.close.emit();
    }
  }

  private getSelectedSpells(): CreatureSpell[] {
    const selectedSpells: CreatureSpell[] = [];
    this.spells.forEach((spellMenuItem: SpellMenuItem) => {
      if (spellMenuItem.selected) {
        const spell = new CreatureSpell();
        spell.spell = spellMenuItem.spell;
        spell.assignedCharacteristic = this.characteristicId;
        if (this.characteristicId === 'innate') {
          spell.innateSlot = spellMenuItem.spell.level;
        }
        selectedSpells.push(spell);
      }
    });
    return selectedSpells;
  }

  closeClick(): void {
    this.close.emit();
  }
}
