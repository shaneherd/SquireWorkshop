import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {InnateSpellConfigurationCollectionItem} from '../../../../shared/models/spell-configuration-collection-item';
import {ListObject} from '../../../../shared/models/list-object';
import {Spell} from '../../../../shared/models/powers/spell';
import {PowerService} from '../../../../core/services/powers/power.service';
import {SpellService} from '../../../../core/services/powers/spell.service';
import {TranslateService} from '@ngx-translate/core';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {LimitedUse} from '../../../../shared/models/powers/limited-use';
import {LimitedUseType} from '../../../../shared/models/limited-use-type.enum';

@Component({
  selector: 'app-single-innate-spell-configuration',
  templateUrl: './single-innate-spell-configuration.component.html',
  styleUrls: ['./single-innate-spell-configuration.component.scss']
})
export class SingleInnateSpellConfigurationComponent implements OnInit {
  @Input() spellConfigurationCollectionItem: InnateSpellConfigurationCollectionItem;
  @Input() levels: ListObject[];
  @Input() editing: boolean;
  @Input() allowEditing = true;
  @Output() close = new EventEmitter();
  @Output() continue = new EventEmitter();
  @Output() remove = new EventEmitter();

  loading = false;
  disabled = false;
  viewingSpell: Spell = null;
  slots: number[] = [];
  selectedSlot = 0;

  step = 0;
  headerName = '';

  //limited use
  originalQuantity = 0;
  configuringLimitedUse: LimitedUse = null;
  limitedUse = false;
  limitedUseCategories: LimitedUseType[] = [];
  selectedLimitedUseCategory: LimitedUseType = LimitedUseType.QUANTITY;

  constructor(
    private powerService: PowerService,
    private spellService: SpellService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.disabled = this.spellConfigurationCollectionItem.parent != null;
    this.setStep(0);
    this.initializeLimitedUse();

    this.powerService.getPower(this.spellConfigurationCollectionItem.spell.id).then((spell: Spell) => {
      this.viewingSpell = spell;
      this.initializeSlots();
      this.loading = false;
    });
  }

  private initializeSlots(): void {
    this.slots = [];
    if (this.viewingSpell.level === 0) {
      return;
    }
    for (let i = this.viewingSpell.level; i < 10; i++) {
      this.slots.push(i);
    }
    if (this.slots.length > 0) {
      if (this.spellConfigurationCollectionItem.slot < this.viewingSpell.level) {
        this.spellConfigurationCollectionItem.slot = this.slots[0];
      }
    }
  }

  setStep(step: number): void {
    this.step = step;
    switch (this.step) {
      case 0:
        if (this.editing) {
          this.headerName = this.translate.instant('Headers.BasicInfo');
        } else {
          this.headerName = this.spellConfigurationCollectionItem.spell.name;
        }
        break;
      case 1:
        this.headerName = this.translate.instant('Headers.LimitedUse');
        break;
    }
  }

  continueClick(): void {
    this.continue.emit(this.spellConfigurationCollectionItem);
  }

  removeClick(): void {
    this.remove.emit(this.spellConfigurationCollectionItem);
  }

  cancelClick(): void {
    this.spellConfigurationCollectionItem.limitedUse.quantity = this.originalQuantity;
    this.close.emit();
  }

  slotChange(slot: number): void {
    this.spellConfigurationCollectionItem.slot = slot;
  }

  /************************************ Limited Use **********************************/

  private initializeLimitedUse(): void {
    if (this.spellConfigurationCollectionItem.limitedUse == null) {
      this.spellConfigurationCollectionItem.limitedUse = new LimitedUse();
    }
    this.limitedUse = this.spellConfigurationCollectionItem.limitedUse.quantity > 0;
    this.originalQuantity = this.spellConfigurationCollectionItem.limitedUse.quantity;
  }

  changeLimitedUse(value: LimitedUseType): void {
    this.selectedLimitedUseCategory = value;
    if (this.spellConfigurationCollectionItem.limitedUse != null) {
      this.spellConfigurationCollectionItem.limitedUse.limitedUseType = value;
    }
  }

  limitedUseChange(event: MatCheckboxChange): void {
    this.limitedUse = event.checked;
  }

  quantityChange(input): void {
    this.spellConfigurationCollectionItem.limitedUse.quantity = parseInt(input.value, 10);
  }
}
