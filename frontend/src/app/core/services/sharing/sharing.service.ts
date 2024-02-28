import {Injectable} from '@angular/core';
import {Entity} from '../../../shared/models/entity';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {EntityType} from '../../../shared/models/entity-type.enum';
import {Attribute} from '../../../shared/models/attributes/attribute';
import {AttributeService} from '../attributes/attribute.service';
import {Power} from '../../../shared/models/powers/power';
import {Item} from '../../../shared/models/items/item';
import {Characteristic} from '../../../shared/models/characteristics/characteristic';
import {CharacteristicService} from '../characteristics/characteristic.service';
import {CreatureService} from '../creatures/creature.service';
import {ItemService} from '../items/item.service';
import {PowerService} from '../powers/power.service';
import {AddToMyStuffConfirmationDialogData} from '../../components/sharing/add-to-my-stuff-confirmation-dialog/add-to-my-stuff-confirmation-dialog-data';
import {AddToMyStuffConfirmationDialogComponent} from '../../components/sharing/add-to-my-stuff-confirmation-dialog/add-to-my-stuff-confirmation-dialog.component';
import {Creature} from '../../../shared/models/creatures/creature';
import {VersionInfo} from '../../../shared/models/version-info';
import {Monster} from '../../../shared/models/creatures/monsters/monster';
import {MonsterService} from '../creatures/monster.service';

@Injectable({
  providedIn: 'root'
})
export class SharingService {

  constructor(
    private dialog: MatDialog,
    private attributeService: AttributeService,
    private characteristicService: CharacteristicService,
    private creatureService: CreatureService,
    private itemService: ItemService,
    private powerService: PowerService,
    private monsterService: MonsterService
  ) { }

  addToMyStuff(entity: Entity, versionInfo: VersionInfo, confirm: () => void): void {
    const self = this;
    const data = new AddToMyStuffConfirmationDialogData();
    data.versionInfo = versionInfo;
    data.entity = entity;
    data.confirm = () => {
      confirm();
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = data;
    this.dialog.open(AddToMyStuffConfirmationDialogComponent, dialogConfig);
  }

  public confirmAdd(entity: Entity): Promise<boolean> {
    return this.continueAdd(entity).then((id: string) => {
      return id !== '0';
    }, () => {
      return false;
    });
  }

  private continueAdd(entity: Entity): Promise<string> {
    switch (entity.entityType) {
      case EntityType.ATTRIBUTE:
        const attribute = entity.object as Attribute;
        return this.attributeService.addToMyStuff(attribute);
      case EntityType.CHARACTERISTIC:
        const characteristic = entity.object as Characteristic;
        return this.characteristicService.addToMyStuff(characteristic);
      case EntityType.CREATURE:
        const creature = entity.object as Creature;
        return this.creatureService.addToMyStuff(creature);
      case EntityType.ITEM:
        const item = entity.object as Item;
        return this.itemService.addToMyStuff(item);
      case EntityType.POWER:
        const power = entity.object as Power;
        return this.powerService.addToMyStuff(power);
      case EntityType.MONSTER:
        const monster = entity.object as Monster;
        return this.monsterService.addToMyStuff(monster);
    }

    return Promise.resolve('0');
  }
}
