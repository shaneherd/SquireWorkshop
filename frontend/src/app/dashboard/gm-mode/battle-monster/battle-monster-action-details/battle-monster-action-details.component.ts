import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {BattleMonsterAction} from '../../../../shared/models/creatures/battle-monster-action';
import {MonsterAction} from '../../../../shared/models/creatures/monsters/monster';
import {ListObject} from '../../../../shared/models/list-object';
import {AbilityService} from '../../../../core/services/attributes/ability.service';
import {LimitedUseType} from '../../../../shared/models/limited-use-type.enum';
import {Action} from '../../../../shared/models/action.enum';
import {DamageConfigurationCollection} from '../../../../shared/models/damage-configuration-collection';
import {MonsterService} from '../../../../core/services/creatures/monster.service';
import {AttackType} from '../../../../shared/models/attack-type.enum';
import {WeaponRangeType} from '../../../../shared/models/items/weapon-range-type.enum';
import {TranslateService} from '@ngx-translate/core';
import {BattleMonster} from '../../../../shared/models/creatures/battle-monsters/battle-monster';
import {CreatureConfigurationCollection} from '../../../../shared/models/creatures/configs/creature-configuration-collection';
import {CreatureService} from '../../../../core/services/creatures/creature.service';
import {DamageConfiguration} from '../../../../shared/models/damage-configuration';

@Component({
  selector: 'app-battle-monster-action-details',
  templateUrl: './battle-monster-action-details.component.html',
  styleUrls: ['./battle-monster-action-details.component.scss']
})
export class BattleMonsterActionDetailsComponent implements OnInit {
  @Input() battleMonsterAction: BattleMonsterAction;
  @Input() battleMonster: BattleMonster;
  @Input() collection: CreatureConfigurationCollection;
  @Input() action: MonsterAction;
  @Output() damageChange = new EventEmitter();

  abilities: ListObject[] = [];
  isRecharge = false;
  isLegendary = false;
  attack = false;
  isAttack = false;
  isSave = false;
  isHeal = false;
  isRanged = false;
  damageConfigurationCollection: DamageConfigurationCollection = new DamageConfigurationCollection();
  none = '';
  selectedAttackAbilityModifier = '';
  selectedSaveAbilityModifier = '';

  constructor(
    private creatureService: CreatureService,
    private abilityService: AbilityService,
    private monsterService: MonsterService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.none = this.translate.instant('None');
    this.isRecharge = this.action.limitedUse != null && this.action.limitedUse.limitedUseType === LimitedUseType.RECHARGE;
    this.isLegendary = this.action.actionType === Action.LEGENDARY;
    this.initializeDamages();
    this.attack = this.damageConfigurationCollection.attackType !== AttackType.NONE;
    this.isAttack = this.damageConfigurationCollection.attackType === AttackType.ATTACK;
    this.isSave = this.damageConfigurationCollection.attackType === AttackType.SAVE;
    this.isHeal = this.damageConfigurationCollection.attackType === AttackType.HEAL;
    this.isRanged = this.action.rangeType === WeaponRangeType.RANGED;
    this.initializeAbilities();
  }

  private initializeDamages(): void {
    const configuration = this.monsterService.initializeDamageConfigurations(this.action);
    if (this.action.attackType === AttackType.ATTACK) {
      if (configuration.attackAbilityMod !== '0') {
        const ability = this.creatureService.getAbility(configuration.attackAbilityMod, this.collection);
        const abilityMod = this.creatureService.getAbilityModifier(ability, this.collection);
        configuration.attackMod += abilityMod;
        configuration.attackAbilityMod = '0';
      }
    } else if (this.action.attackType === AttackType.SAVE) {
      if (configuration.saveAbilityModifier !== '0') {
        const ability = this.creatureService.getAbility(configuration.saveAbilityModifier, this.collection);
        const abilityMod = this.creatureService.getAbilityModifier(ability, this.collection);
        configuration.attackMod += abilityMod;
        configuration.saveAbilityModifier = '0';
      }
      if (configuration.saveProficiencyModifier) {
        const profValue = this.collection.profBonus;
        configuration.attackMod += profValue;
        configuration.saveProficiencyModifier = false;
      }
    }
    configuration.damageConfigurations.forEach((config: DamageConfiguration) => {
      if (config.values.abilityModifier != null && config.values.abilityModifier.id !== '0') {
        const ability = this.creatureService.getAbility(config.values.abilityModifier.id, this.collection);
        const abilityMod = this.creatureService.getAbilityModifier(ability, this.collection);
        config.values.abilityModifier.id = '0';
        config.values.miscModifier += abilityMod;
      }
    });
    this.damageConfigurationCollection = configuration;
    this.damageChange.emit(this.damageConfigurationCollection);
  }

  private initializeAbilities(): void {
    this.abilities = this.abilityService.getAbilitiesDetailedFromStorageAsListObject();
    this.initializeSelectedAttackAbilityModifier();
    this.initializeSelectedSaveAbilityModifier();
  }

  private initializeSelectedAttackAbilityModifier(): void {
    for (let i = 0; i < this.abilities.length; i++) {
      if (this.abilities[i].id === this.damageConfigurationCollection.attackAbilityMod) {
        this.selectedAttackAbilityModifier = this.abilities[i].name;
        return;
      }
    }
  }

  private initializeSelectedSaveAbilityModifier(): void {
    for (let i = 0; i < this.abilities.length; i++) {
      if (this.abilities[i].id === this.damageConfigurationCollection.saveAbilityModifier) {
        this.selectedSaveAbilityModifier = this.abilities[i].name;
        return;
      }
    }
  }
}
