import {Component, Input, OnInit} from '@angular/core';
import {DamageConfigurationCollection} from '../../models/damage-configuration-collection';
import {AttackType} from '../../models/attack-type.enum';
import {AbilityService} from '../../../core/services/attributes/ability.service';
import {CharacterLevelService} from '../../../core/services/character-level.service';
import {TranslateService} from '@ngx-translate/core';
import {ListObject} from '../../models/list-object';
import {CharacterLevel} from '../../models/character-level';

@Component({
  selector: 'app-power-damage-display',
  templateUrl: './power-damage-display.component.html',
  styleUrls: ['./power-damage-display.component.scss']
})
export class PowerDamageDisplayComponent implements OnInit {
  @Input() damageConfigurationCollection: DamageConfigurationCollection = new DamageConfigurationCollection();
  @Input() isSpell = false;
  @Input() baseLevel = 1;
  @Input() characterLevel: CharacterLevel = null;

  characterLevels: CharacterLevel[] = [];
  attackTypes: AttackType[] = [];
  abilities: ListObject[] = [];
  none = '';
  attackDisplayLabel = '';
  attackDisplay = '';
  tooltip = '';

  constructor(
    private abilityService: AbilityService,
    private characterLevelService: CharacterLevelService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.initializeAttackTypes();
    this.initializeAbilities();
    this.initializeLevels();
    this.initializeAttackModifier();
  }

  private initializeLevels(): void {
    this.none = this.translate.instant('None');
    this.characterLevels = [];
    this.characterLevelService.getLevelsDetailed().then((characterLevels: CharacterLevel[]) => {
      this.characterLevels = characterLevels;
    });
  }

  private initializeAttackModifier(): void {
    if (this.characterLevel == null) {
      return;
    }

    if (this.isAttack()) {
      this.attackDisplay = '1d20';
    } else if (this.isSave()) {
      this.attackDisplayLabel = this.translate.instant('Labels.DC');
    }

    if (this.damageConfigurationCollection.attackMod !== 0 && this.isAttack()) {
      this.attackDisplay += ' + ';
    }
  }

  isAttack(): boolean {
    return this.damageConfigurationCollection.attackType === AttackType.ATTACK;
  }

  isSave(): boolean {
    return this.damageConfigurationCollection.attackType === AttackType.SAVE;
  }

  isHealing(): boolean {
    return this.damageConfigurationCollection.attackType === AttackType.HEAL;
  }

  isNone(): boolean {
    return this.damageConfigurationCollection.attackType === AttackType.NONE;
  }

  private initializeAttackTypes(): void {
    this.attackTypes = [];
    this.attackTypes.push(AttackType.ATTACK);
    this.attackTypes.push(AttackType.SAVE);
    this.attackTypes.push(AttackType.HEAL);
    this.attackTypes.push(AttackType.NONE);
  }

  private initializeAbilities(): void {
    this.abilities = [];
    this.abilityService.getAbilities().then((abilities: ListObject[]) => {
      abilities = abilities.slice(0);
      const noAbility = new ListObject('0', '');
      abilities.unshift(noAbility);
      this.abilities = abilities;
    });
  }

  getSelectedAttackAbilityModifier(): string {
    for (let i = 0; i < this.abilities.length; i++) {
      if (this.abilities[i].id === this.damageConfigurationCollection.attackAbilityMod) {
        return this.abilities[i].name;
      }
    }
    return '';
  }

  getSelectedSaveAbilityModifier(): string {
    for (let i = 0; i < this.abilities.length; i++) {
      if (this.abilities[i].id === this.damageConfigurationCollection.saveAbilityModifier) {
        return this.abilities[i].name;
      }
    }
    return '';
  }

  getAbility(id: string): ListObject {
    for (let i = 0; i < this.abilities.length; i++) {
      const ability: ListObject = this.abilities[i];
      if (ability.id === id) {
        return ability;
      }
    }
    return null;
  }

  hasLevel(level: ListObject): boolean {
    for (let i = 0; i < this.damageConfigurationCollection.advancementDamageConfigurations.length; i++) {
      const current = this.damageConfigurationCollection.advancementDamageConfigurations[i];
      if (current.level.id === level.id) {
        return true;
      }
    }
    return false;
  }
}
