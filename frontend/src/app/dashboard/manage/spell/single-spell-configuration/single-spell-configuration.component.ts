import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SpellService} from '../../../../core/services/powers/spell.service';
import {TranslateService} from '@ngx-translate/core';
import {SpellConfigurationCollectionItem} from '../../../../shared/models/spell-configuration-collection-item';
import {ListObject} from '../../../../shared/models/list-object';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {Spell} from '../../../../shared/models/powers/spell';
import {PowerService} from '../../../../core/services/powers/power.service';

@Component({
  selector: 'app-single-spell-configuration',
  templateUrl: './single-spell-configuration.component.html',
  styleUrls: ['./single-spell-configuration.component.scss']
})
export class SingleSpellConfigurationComponent implements OnInit {
  @Input() spellConfigurationCollectionItem: SpellConfigurationCollectionItem;
  @Input() levels: ListObject[];
  @Input() editing: boolean;
  @Input() allowEditing = true;
  @Output() close = new EventEmitter();
  @Output() continue = new EventEmitter();
  @Output() remove = new EventEmitter();

  loading = false;
  dontAutoGain = '';
  disabled = false;
  selectedLevel: ListObject = null;
  originalAlwaysPrepared: boolean;
  originalCountTowardsNumberPrepared: boolean;
  viewingSpell: Spell = null;

  constructor(
    private powerService: PowerService,
    private spellService: SpellService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.originalAlwaysPrepared = this.spellConfigurationCollectionItem.alwaysPrepared;
    this.originalCountTowardsNumberPrepared = this.spellConfigurationCollectionItem.countTowardsPrepared;
    this.dontAutoGain = this.translate.instant('Navigation.Manage.Spells.DontAutoGain');
    this.disabled = this.spellConfigurationCollectionItem.parent != null;
    this.initializeSelectedLevel();

    this.powerService.getPower(this.spellConfigurationCollectionItem.spell.id).then((spell: Spell) => {
      this.viewingSpell = spell;
      this.loading = false;
    });
  }

  private initializeSelectedLevel(): void {
    for (let i = 0; i < this.levels.length; i++) {
      const level = this.levels[i];
      if ((this.spellConfigurationCollectionItem.parent != null && level.id === this.spellConfigurationCollectionItem.parent.levelGained.id) ||
        (this.spellConfigurationCollectionItem.parent == null && level.id === this.spellConfigurationCollectionItem.levelGained.id)) {
        this.selectedLevel = level;
        break;
      }
    }
  }

  levelChange(value: ListObject): void {
    this.selectedLevel = value;
  }

  alwaysPreparedChange(event: MatCheckboxChange): void {
    if (!this.disabled) {
      this.spellConfigurationCollectionItem.alwaysPrepared = event.checked;
    }
  }

  countTowardsNumberPreparedChange(event: MatCheckboxChange): void {
    if (!this.disabled) {
      this.spellConfigurationCollectionItem.countTowardsPrepared = event.checked;
    }
  }

  continueClick(): void {
    this.spellConfigurationCollectionItem.levelGained = this.selectedLevel;
    this.continue.emit(this.spellConfigurationCollectionItem);
  }

  removeClick(): void {
    this.remove.emit(this.spellConfigurationCollectionItem);
  }

  cancelClick(): void {
    this.spellConfigurationCollectionItem.alwaysPrepared = this.originalAlwaysPrepared;
    this.spellConfigurationCollectionItem.countTowardsPrepared = this.originalCountTowardsNumberPrepared;
    this.close.emit();
  }
}
