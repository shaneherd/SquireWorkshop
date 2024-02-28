import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SpellConfigurationCollection} from '../../../../shared/models/spell-configuration-collection';
import {ListObject} from '../../../../shared/models/list-object';
import {SpellService} from '../../../../core/services/powers/spell.service';
import {TranslateService} from '@ngx-translate/core';
import {AbilityService} from '../../../../core/services/attributes/ability.service';
import {Characteristic} from '../../../../shared/models/characteristics/characteristic';

@Component({
  selector: 'app-spell-configuration',
  templateUrl: './spell-configuration.component.html',
  styleUrls: ['./spell-configuration.component.scss']
})
export class SpellConfigurationComponent implements OnInit {
  @Input() characteristic: Characteristic;
  @Input() spellConfigurationCollection: SpellConfigurationCollection;
  @Input() editing: boolean;
  @Input() loading: boolean;
  @Output() configListUpdated = new EventEmitter();
  noAbility: string;
  abilities: ListObject[] = [];

  constructor(
    private spellService: SpellService,
    private translate: TranslateService,
    private abilityService: AbilityService
  ) { }

  ngOnInit() {
    this.noAbility = this.translate.instant('None');
    this.abilityService.getAbilities().then().then((abilities: ListObject[]) => {
      abilities = abilities.slice(0);
      const noAbility = new ListObject('0', '');
      abilities.unshift(noAbility);
      this.abilities = abilities;
    });
  }

  spellcastingAbilityChange(value: string): void {
    this.spellConfigurationCollection.spellcastingAbility = value;
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

  handleConfigListUpdated(): void {
    this.configListUpdated.emit();
  }
}
