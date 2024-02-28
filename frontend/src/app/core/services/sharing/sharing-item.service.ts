import {Injectable} from '@angular/core';
import {Entity} from '../../../shared/models/entity';
import {Item} from '../../../shared/models/items/item';
import {SharingService} from './sharing.service';
import {EntityType} from '../../../shared/models/entity-type.enum';
import {VersionInfo} from '../../../shared/models/version-info';

@Injectable({
  providedIn: 'root'
})
export class SharingItemService {

  constructor(
    private sharingService: SharingService
  ) { }

  private getEntity(item: Item): Entity {
    return new Entity(
      EntityType.ITEM,
      item.id,
      item.name,
      item
    );
  }

  addToMyStuff(item: Item, versionInfo: VersionInfo, confirm: () => void): void {
    this.sharingService.addToMyStuff(this.getEntity(item), versionInfo, confirm);
  }

  continueAddToMyStuff(item: Item): Promise<boolean> {
    return this.sharingService.confirmAdd(this.getEntity(item));
  }
}
