import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SpellConfigurationCollectionItem} from '../../../../shared/models/spell-configuration-collection-item';
import {TranslateService} from '@ngx-translate/core';
import {SpellConfigurationCollection} from '../../../../shared/models/spell-configuration-collection';
import {ListObject} from '../../../../shared/models/list-object';
import {SpellService} from '../../../../core/services/powers/spell.service';
import {Characteristic} from '../../../../shared/models/characteristics/characteristic';
import {CharacteristicService} from '../../../../core/services/characteristics/characteristic.service';
import {SpellConfigurationService} from '../../../../core/services/powers/spell-configuration.service';

@Component({
  selector: 'app-spell-configuration-list',
  templateUrl: './spell-configuration-list.component.html',
  styleUrls: ['./spell-configuration-list.component.scss']
})
export class SpellConfigurationListComponent implements OnInit {
  @Input() characteristic: Characteristic;
  @Input() spellConfigurationCollection: SpellConfigurationCollection;
  @Input() editing: boolean;
  @Input() displayParentSpells = false;
  @Input() isPublic = false;
  @Input() isShared = false;

  @Output() configListUpdated = new EventEmitter();

  addingSpells = false;
  dontAutoGain: string;
  configuringItem: SpellConfigurationCollectionItem = null;

  constructor(
    private spellService: SpellService,
    private translate: TranslateService,
    private characteristicService: CharacteristicService,
    private spellConfigurationService: SpellConfigurationService
  ) { }

  ngOnInit() {
    this.dontAutoGain = this.translate.instant('Navigation.Manage.Spells.DontAutoGain');
  }

  getSpellName(config: SpellConfigurationCollectionItem): string {
    return config.parent == null ? config.spell.name : config.parent.spell.name;
  }

  isDisabled(config: SpellConfigurationCollectionItem): boolean {
    return config.parent != null;
  }

  spellClick(config: SpellConfigurationCollectionItem): void {
    if (this.configuringItem == null && !this.addingSpells) {
      this.configuringItem = config;
    }
  }

  addSpells(): void {
    if (this.configuringItem == null && !this.editing) {
      this.addingSpells = true;
    }
  }

  cancelAddSpells(): void {
    this.addingSpells = false;
  }

  continueAddSpells(selectedSpells: ListObject[]): void {
    this.characteristicService.addSpells(this.characteristic, selectedSpells).then(() => {
      this.spellConfigurationService.addSpellConfigurations(this.spellConfigurationCollection, selectedSpells);
      this.addingSpells = false;
      this.configListUpdated.emit();
    });
  }

  updateSpellConfiguration(config: SpellConfigurationCollectionItem): void {
    const spellConfiguration = this.spellConfigurationService.getSpellConfiguration(config);
    this.characteristicService.updateSpellConfiguration(this.characteristic, spellConfiguration).then(() => {
      this.configuringItem = null;
      this.configListUpdated.emit();
    });
  }

  deleteSpell(config: SpellConfigurationCollectionItem): void {
    const index = this.spellConfigurationCollection.spellConfigurations.indexOf(config);
    if (index > -1) {
      this.spellConfigurationCollection.spellConfigurations.splice(index, 1);
      this.characteristicService.deleteSpell(this.characteristic, config.spell.id).then(() => {
        this.configuringItem = null;
        this.configListUpdated.emit();
      });
    }
  }

  cancelConfiguration(): void {
    this.configuringItem = null;
  }
}
