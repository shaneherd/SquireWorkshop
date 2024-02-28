import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SpellService} from '../../../core/services/powers/spell.service';
import {TranslateService} from '@ngx-translate/core';
import {DamageConfiguration} from '../../models/damage-configuration';
import {Ability} from '../../models/attributes/ability.model';
import {DamageType} from '../../models/attributes/damage-type';
import {DiceSize} from '../../models/dice-size.enum';
import {ListObject} from '../../models/list-object';
import {AbilityService} from '../../../core/services/attributes/ability.service';
import {CharacterLevelService} from '../../../core/services/character-level.service';
import {DamageTypeService} from '../../../core/services/attributes/damage-type.service';
import {DiceCollection} from '../../models/characteristics/dice-collection';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {NotificationService} from '../../../core/services/notification.service';

@Component({
  selector: 'app-damage-configuration',
  templateUrl: './damage-configuration.component.html',
  styleUrls: ['./damage-configuration.component.scss']
})
export class DamageConfigurationComponent implements OnInit {
  loading = false;
  @Input() damageConfiguration: DamageConfiguration;
  @Input() isSpell = false;
  @Input() allowNone = false;
  @Output() close = new EventEmitter();
  @Output() continue = new EventEmitter();

  headerName = '';
  diceCollection = new DiceCollection();
  levels: ListObject[] = [];
  selectedLevel: ListObject = new ListObject('0', '');
  diceSizes: DiceSize[] = [];
  abilities: ListObject[] = [];
  damageTypes: DamageType[] = [];
  selectedDamageType: DamageType = new DamageType();
  spellCastingAbilityModifier = false;
  adjustment = true;

  constructor(
    private spellService: SpellService,
    private characterLevelService: CharacterLevelService,
    private damageTypeService: DamageTypeService,
    private translate: TranslateService,
    private abilityService: AbilityService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    if (this.damageConfiguration.healing) {
      this.headerName = this.translate.instant('Navigation.Manage.Healing.Configure')
    } else {
      this.headerName = this.translate.instant('Navigation.Manage.Damages.Configure')
    }

    this.initializeDiceSizes();
    this.initializeAbilities();
    this.initializeLevels();
    this.initializeDamageTypes();
    this.diceCollection.numDice = this.damageConfiguration.values.numDice;
    this.diceCollection.diceSize = this.damageConfiguration.values.diceSize;
    this.diceCollection.abilityModifier = new Ability();
    if (this.damageConfiguration.values.abilityModifier != null) {
      this.diceCollection.abilityModifier.id = this.damageConfiguration.values.abilityModifier.id;
      this.diceCollection.abilityModifier.name = this.damageConfiguration.values.abilityModifier.name;
    }
    this.diceCollection.miscModifier = this.damageConfiguration.values.miscModifier;
    this.spellCastingAbilityModifier = this.damageConfiguration.spellCastingAbilityModifier;
    this.adjustment = this.damageConfiguration.adjustment;
  }

  initializeLevels(): void {
    this.characterLevelService.getLevels().then((levels: ListObject[]) => {
      this.levels = levels;
      this.initializeSelectedLevel();
    });
  }

  initializeSelectedLevel(): void {
    if (this.damageConfiguration.level == null) {
      if (this.levels.length > 0) {
        this.selectedLevel = this.levels[0];
      }
      return;
    }
    for (let i = 0; i < this.levels.length; i++) {
      const level = this.levels[i];
      if (level.id === this.damageConfiguration.level.id) {
        this.selectedLevel = level;
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
  }

  initializeAbilities(): void {
    this.abilities = [];
    this.abilityService.getAbilities().then().then((abilities: ListObject[]) => {
      abilities = abilities.slice(0);
      const noAbility = new ListObject('0', '');
      abilities.unshift(noAbility);
      this.abilities = abilities;
    });
  }

  initializeDamageTypes(): void {
    this.damageTypeService.getDamageTypes().then((damageTypes: ListObject[]) => {
      this.damageTypes = [];

      if (this.allowNone) {
        const damageType = new DamageType();
        damageType.id = '0';
        damageType.name = this.translate.instant('None');
        this.damageTypes.push(damageType);
      }

      damageTypes.forEach((type: ListObject) => {
        const damageType = new DamageType();
        damageType.id = type.id;
        damageType.name = type.name;
        this.damageTypes.push(damageType);
      });
      this.initializeSelectedDamageType();
    });
  }

  initializeSelectedDamageType(): void {
    if (this.damageConfiguration.damageType == null) {
      if (this.damageTypes.length > 0) {
        this.selectedDamageType = this.damageTypes[0];
      }
      return;
    }
    for (let i = 0; i < this.damageTypes.length; i++) {
      const damageType = this.damageTypes[i];
      if (damageType.id === this.damageConfiguration.damageType.id) {
        this.selectedDamageType = damageType;
        return;
      }
    }
  }

  damageTypeChange(value: DamageType): void {
    this.selectedDamageType = value;
  }

  levelChange(value: ListObject): void {
    this.selectedLevel = value;
  }

  spellcastingAbilityModifierChange(event: MatCheckboxChange): void {
    this.spellCastingAbilityModifier = event.checked;
  }

  adjustmentChange(event: MatCheckboxChange): void {
    this.adjustment = event.checked;
  }

  continueClick(): void {
    if (this.diceCollection.numDice === 0
      && this.diceCollection.miscModifier === 0
      && (this.diceCollection.abilityModifier == null || this.diceCollection.abilityModifier.id === '0')) {
      this.notificationService.error(this.translate.instant('Error.NoDamageValue'));
      return;
    }
    if (this.selectedDamageType != null && this.selectedDamageType.id !== '0') {
      this.damageConfiguration.damageType = this.selectedDamageType;
    } else {
      this.damageConfiguration.damageType = null;
    }
    this.damageConfiguration.level = this.selectedLevel;
    this.damageConfiguration.values = this.diceCollection;
    this.damageConfiguration.spellCastingAbilityModifier = this.spellCastingAbilityModifier;
    this.damageConfiguration.adjustment = this.adjustment;
    this.continue.emit(this.damageConfiguration);
  }

  cancelClick(): void {
    this.close.emit();
  }
}
