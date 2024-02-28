import {Component, Input, OnInit} from '@angular/core';
import {Ammo} from '../../../../shared/models/items/ammo';
import {ListObject} from '../../../../shared/models/list-object';
import {Ability} from '../../../../shared/models/attributes/ability.model';
import {DamageConfigurationCollection} from '../../../../shared/models/damage-configuration-collection';
import {AbilityService} from '../../../../core/services/attributes/ability.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-ammo-info',
  templateUrl: './ammo-info.component.html',
  styleUrls: ['./ammo-info.component.scss']
})
export class AmmoInfoComponent implements OnInit {
  @Input() ammo: Ammo;
  @Input() damageCollection: DamageConfigurationCollection;
  @Input() editing: boolean;

  selectedAbility: ListObject = new ListObject('0', '');
  abilities: ListObject[] = [];
  noAbility: string;

  constructor(
    private abilityService: AbilityService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.initializeAbilities();
  }

  initializeAbilities(): void {
    this.noAbility = this.translate.instant('None');
    this.abilityService.getAbilities().then((abilities: ListObject[]) => {
      abilities = abilities.slice(0);
      const noAbility = new ListObject('0', '');
      abilities.unshift(noAbility);
      this.abilities = abilities;
      this.initializeSelectedAbility();
    });
  }

  initializeSelectedAbility(): void {
    if (this.ammo.attackAbilityModifier != null) {
      for (let i = 0; i < this.abilities.length; i++) {
        const ability = this.abilities[i];
        if (ability.id === this.ammo.attackAbilityModifier.id) {
          this.selectedAbility = ability;
          return;
        }
      }
    }
    if (this.abilities.length > 0) {
      this.ammo.attackAbilityModifier = new Ability();
      this.abilityChange(this.abilities[0]);
    }
  }

  attackModifierChange(input): void {
    this.ammo.attackModifier = input.value;
  }

  abilityChange(value: ListObject): void {
    this.selectedAbility = value;
    this.ammo.attackAbilityModifier.id = value.id;
    this.ammo.attackAbilityModifier.name = value.name;
  }
}
