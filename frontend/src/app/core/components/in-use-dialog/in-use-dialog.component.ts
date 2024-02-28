import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {InUseDialogData} from './in-use-dialog-data';
import {TranslateService} from '@ngx-translate/core';
import {InUse} from '../../../shared/models/inUse/in-use';
import {InUseType} from '../../../shared/models/inUse/in-use-type.enum';
import {InUseAttribute} from '../../../shared/models/inUse/in-use-attribute';
import {InUseCreature, InUseMonster} from '../../../shared/models/inUse/in-use-creature';
import {InUseItem} from '../../../shared/models/inUse/in-use-item';
import {InUsePower} from '../../../shared/models/inUse/in-use-power';
import {InUseCharacteristic} from '../../../shared/models/inUse/in-use-characteristic';
import {EVENTS, SKIP_LOCATION_CHANGE} from '../../../constants';
import {Router} from '@angular/router';
import {PowerType} from '../../../shared/models/powers/power-type.enum';
import {CreatureType} from '../../../shared/models/creatures/creature-type.enum';
import {CharacteristicType} from '../../../shared/models/characteristics/characteristic-type.enum';
import {AttributeType} from '../../../shared/models/attributes/attribute-type.enum';
import {Subscription} from 'rxjs';
import {EventsService} from '../../services/events.service';

export class InUseCategory {
  name: string;
  items: InUse[] = [];
}

@Component({
  selector: 'app-in-use-dialog',
  templateUrl: './in-use-dialog.component.html',
  styleUrls: ['./in-use-dialog.component.scss']
})
export class InUseDialogComponent implements OnInit, OnDestroy {
  data: InUseDialogData;
  eventSub: Subscription;
  deletable = false;
  title = '';
  message = '';
  categories: InUseCategory[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public d: InUseDialogData,
    private eventsService: EventsService,
    private dialogRef: MatDialogRef<InUseDialogComponent>,
    private router: Router,
    private translate: TranslateService
  ) {
    this.data = d;
  }

  ngOnInit() {
    this.initializeDeletable();
    this.title = this.translate.instant('InUse.Title', {name: this.data.name});
    this.message = this.deletable ?
      this.translate.instant('InUse.MessageDeletable', {type: this.data.type.toLowerCase()}) :
      this.translate.instant('InUse.MessageNotDeletable', {type: this.data.type.toLocaleLowerCase()})
    this.initializeData();
    this.eventSub = this.eventsService.events.subscribe(event => {
      if (event === EVENTS.Logout) {
        this.dialogRef.close();
      }
    });
  }

  ngOnDestroy() {
    this.eventSub.unsubscribe();
  }

  private initializeData(): void {
    this.categories = [];
    this.data.inUse.forEach((inUse: InUse) => {
      const categoryName = this.getCategoryName(inUse);
      let category = this.getCategory(categoryName);
      if (category == null) {
        category = new InUseCategory();
        category.name = categoryName;
        this.categories.push(category);
      }
      category.items.push(inUse);
    });
  }

  private getCategoryName(inUse: InUse): string {
    switch (inUse.inUseType) {
      case InUseType.ATTRIBUTE:
        const attribute = inUse as InUseAttribute;
        return this.translate.instant('AttributeType.Plural.' + attribute.attributeType);
      case InUseType.CHARACTERISTIC:
        const characteristic = inUse as InUseCharacteristic;
        return this.translate.instant('CharacteristicType.Plural.' + characteristic.characteristicType);
      case InUseType.POWER:
        const power = inUse as InUsePower;
        return this.translate.instant('PowerType.Plural.' + power.powerType);
      case InUseType.ITEM:
        const item = inUse as InUseItem;
        return this.translate.instant('ItemType.Plural.' + item.itemType);
      case InUseType.CREATURE:
        const creature = inUse as InUseCreature;
        return this.translate.instant('CreatureType.Plural.' + creature.creatureType);
      case InUseType.MONSTER:
        return this.translate.instant('CreatureType.Plural.' + CreatureType.MONSTER);
    }
  }

  private getCategory(categoryName: string): InUseCategory {
    for (let i = 0; i < this.categories.length; i++) {
      const category = this.categories[i];
      if (category.name === categoryName) {
        return category;
      }
    }
    return null;
  }

  private initializeDeletable(): void {
    this.deletable = this.isDeletable();
  }

  private isDeletable(): boolean {
    for (let i = 0; i < this.data.inUse.length; i++) {
      if (this.data.inUse[i].required) {
        return false;
      }
    }
    return true;
  }

  confirm(): void {
    this.data.confirm();
    this.dialogRef.close();
  }

  cancel(): void {
    this.dialogRef.close();
  }

  itemClick(inUse: InUse): void {
    let subNavigation = '';
    switch (inUse.inUseType) {
      case InUseType.CREATURE:
        const creature = inUse as InUseCreature;
        switch (creature.creatureType) {
          case CreatureType.CHARACTER:
            subNavigation = 'characters';
            break;
        }
        break;
      case InUseType.CHARACTERISTIC:
        const characteristic = inUse as InUseCharacteristic;
        switch (characteristic.characteristicType) {
          case CharacteristicType.CLASS:
            subNavigation = 'classes';
            break;
          case CharacteristicType.RACE:
            subNavigation = 'races';
            break;
          case CharacteristicType.BACKGROUND:
            subNavigation = 'backgrounds';
            break;
        }
        break;
      case InUseType.POWER:
        const power = inUse as InUsePower;
        switch (power.powerType) {
          case PowerType.SPELL:
            subNavigation = 'spells';
            break;
          case PowerType.FEATURE:
            subNavigation = 'features';
            break;
        }
        break;
      case InUseType.ITEM:
        subNavigation = 'items';
        break;
      case InUseType.ATTRIBUTE:
        const attribute = inUse as InUseAttribute;
        switch (attribute.attributeType) {
          case AttributeType.ARMOR_TYPE:
            subNavigation = 'armorTypes';
            break;
          case AttributeType.CASTER_TYPE:
            subNavigation = 'casterTypes';
            break;
          case AttributeType.CONDITION:
            subNavigation = 'conditions';
            break;
          case AttributeType.DAMAGE_TYPE:
            subNavigation = 'damageTypes';
            break;
          case AttributeType.LEVEL:
            subNavigation = 'levels';
            break;
          case AttributeType.LANGUAGE:
            subNavigation = 'languages';
            break;
          case AttributeType.SKILL:
            subNavigation = 'skills';
            break;
          case AttributeType.TOOL_CATEGORY:
            subNavigation = 'toolCategories';
            break;
          case AttributeType.WEAPON_PROPERTY:
            subNavigation = 'weaponProperties';
            break;
          case AttributeType.AREA_OF_EFFECT:
            subNavigation = 'areaOfEffects';
            break;
          // case AttributeType.SPELL_SCHOOL:
          //   subNavigation = '';
          //   break;
          case AttributeType.ALIGNMENT:
            subNavigation = 'alignments';
            break;
          case AttributeType.DEITY:
            subNavigation = 'deities';
            break;
          case AttributeType.DEITY_CATEGORY:
            subNavigation = 'deityCategories';
            break;
        }
        break;
    }

    if (subNavigation !== '') {
      this.router.navigate(['/home/dashboard',
          { outlets: {
              'middle-nav': [subNavigation, inUse.id],
              'side-nav': [subNavigation, inUse.id]
            }}],
        {skipLocationChange: SKIP_LOCATION_CHANGE });
      this.dialogRef.close();
    }
  }
}
