import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Weapon} from '../../../models/items/weapon';
import {WeaponProperty} from '../../../models/attributes/weapon-property';
import {EVENTS, SID} from '../../../../constants';
import {CreatureConfigurationCollection} from '../../../models/creatures/configs/creature-configuration-collection';
import {CreatureItem} from '../../../models/creatures/creature-item';
import {TranslateService} from '@ngx-translate/core';
import {Subscription} from 'rxjs';
import {EventsService} from '../../../../core/services/events.service';

@Component({
  selector: 'app-weapon-properties-display',
  templateUrl: './weapon-properties-display.component.html',
  styleUrls: ['./weapon-properties-display.component.scss']
})
export class WeaponPropertiesDisplayComponent implements OnInit, OnDestroy {
  @Input() collection: CreatureConfigurationCollection;
  @Input() creatureItem: CreatureItem;
  @Input() weapon: Weapon;
  @Input() class = '';

  eventSub: Subscription;
  properties: string[] = [];

  constructor(
    private translate: TranslateService,
    private eventsService: EventsService
  ) { }

  ngOnInit() {
    this.initializeProperties();

    this.eventSub = this.eventsService.events.subscribe(event => {
      if (event === EVENTS.ItemsUpdated
        || event === EVENTS.AbilityScoreChange
        || event === EVENTS.ModifiersUpdated
        || event === EVENTS.ProficiencyUpdated) {
        this.initializeProperties();
      }
    });
  }

  private initializeProperties(): void {
    const properties: string[] = [];
    this.weapon.properties.forEach((property: WeaponProperty) => {
      let propertyDisplay = property.name;
      if (property.sid === SID.WEAPON_PROPERTIES.AMMUNITION) {
        propertyDisplay +=  ' - ' + this.weapon.ammoType.name;
      } else if (property.sid === SID.WEAPON_PROPERTIES.THROWN) {
        propertyDisplay +=  ' - ' + this.translate.instant('RangeValues', {normal: this.weapon.normalRange, long: this.weapon.longRange});
      } else if (property.sid === SID.WEAPON_PROPERTIES.VERSATILE) {
        //todo - extra damage
      }
      properties.push(propertyDisplay);
    });
    this.properties = properties;
  }

  ngOnDestroy() {
    this.eventSub.unsubscribe();
  }

}
