import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {LimitedUse} from '../../models/powers/limited-use';
import {TranslateService} from '@ngx-translate/core';
import {DiceSize} from '../../models/dice-size.enum';
import {ListObject} from '../../models/list-object';
import {AbilityService} from '../../../core/services/attributes/ability.service';
import {CharacterLevelService} from '../../../core/services/character-level.service';
import {LimitedUseType} from '../../models/limited-use-type.enum';

@Component({
  selector: 'app-limited-use-configuration',
  templateUrl: './limited-use-configuration.component.html',
  styleUrls: ['./limited-use-configuration.component.scss']
})
export class LimitedUseConfigurationComponent implements OnInit {
  loading = false;
  none = '';

  @Input() limitedUse: LimitedUse;
  @Input() limitedUses: LimitedUse[] = [];
  @Input() editing = false;
  @Input() disabled = false;
  @Input() showLevel = true;
  @Output() configuringChange = new EventEmitter();
  @Output() close = new EventEmitter();
  @Output() continue = new EventEmitter();

  configuringLimitedUse: LimitedUse = new LimitedUse();

  levels: ListObject[] = [];
  diceSizes: DiceSize[] = [];
  abilities: ListObject[] = [];

  constructor(
    private abilityService: AbilityService,
    private characterLevelService: CharacterLevelService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.none = this.translate.instant('None');
    this.initializeLevels();
    this.initializeAbilities();
    this.initializeDiceSizes();
  }

  initializeLevels(): void {
    if (this.showLevel) {
      this.characterLevelService.getLevels().then((levels: ListObject[]) => {
        const filteredLevels: ListObject[] = [];
        for (let i = 0; i < levels.length; i++) {
          const level = levels[i];
          if ((this.limitedUse.characterLevel != null && level.id === this.limitedUse.characterLevel.id) || !this.inUse(level)) {
            filteredLevels.push(level);
          }
        }
        this.levels = filteredLevels;
        this.initializeSelectedLevel();
      });
    }
  }

  private inUse(level: ListObject): boolean {
    for (let i = 0; i < this.limitedUses.length; i++) {
      if (this.limitedUses[i].characterLevel.id === level.id) {
        return true;
      }
    }
    return false;
  }

  private initializeSelectedLevel(): void {
    if (this.limitedUse.characterLevel == null) {
      if (this.levels.length > 0) {
        this.configuringLimitedUse.characterLevel = this.levels[0];
        return;
      }
    }
    for (let i = 0; i < this.levels.length; i++) {
      const level = this.levels[i];
      if (level.id === this.limitedUse.characterLevel.id) {
        this.configuringLimitedUse.characterLevel = level;
        return;
      }
    }
  }

  initializeDiceSizes(): void {
    this.diceSizes = [];
    this.diceSizes.push(DiceSize.ONE);
    this.diceSizes.push(DiceSize.TWO);
    this.diceSizes.push(DiceSize.THREE);
    this.diceSizes.push(DiceSize.FOUR);
    this.diceSizes.push(DiceSize.SIX);
    this.diceSizes.push(DiceSize.EIGHT);
    this.diceSizes.push(DiceSize.TEN);
    this.diceSizes.push(DiceSize.TWELVE);
    this.diceSizes.push(DiceSize.TWENTY);
    this.diceSizes.push(DiceSize.HUNDRED);
    this.initializeSelectedDiceSize();
  }

  private initializeSelectedDiceSize(): void {
    this.configuringLimitedUse.diceSize = this.limitedUse.diceSize;
  }

  initializeAbilities(): void {
    this.abilities = [];
    const abilities = this.abilityService.getAbilitiesDetailedFromStorageAsListObject().slice(0);
    const noAbility = new ListObject('0', '');
    abilities.unshift(noAbility);
    this.abilities = abilities;

    this.initializeSelectedAbility();
  }

  private initializeSelectedAbility(): void {
    this.configuringLimitedUse.quantity = this.limitedUse.quantity;
    this.configuringLimitedUse.abilityModifier = this.limitedUse.abilityModifier;
  }

  isDice(): boolean {
    return this.limitedUse.limitedUseType === LimitedUseType.DICE;
  }

  isLevel(): boolean {
    return this.limitedUse.limitedUseType === LimitedUseType.LEVEL;
  }

  quantityChange(input): void {
    this.configuringLimitedUse.quantity = parseInt(input.value, 10);
  }

  continueClick(): void {
    this.limitedUse.characterLevel = this.showLevel ? this.configuringLimitedUse.characterLevel : null;
    this.limitedUse.quantity = this.configuringLimitedUse.quantity;
    this.limitedUse.abilityModifier = this.configuringLimitedUse.abilityModifier;
    this.limitedUse.diceSize = this.configuringLimitedUse.diceSize;
    this.continue.emit(this.limitedUse);
  }

  cancelClick(): void {
    this.close.emit();
  }

}
