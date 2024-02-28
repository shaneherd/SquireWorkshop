import {Injectable} from '@angular/core';
import {Characteristic} from '../../../shared/models/characteristics/characteristic';
import {Entity} from '../../../shared/models/entity';
import {EntityType} from '../../../shared/models/entity-type.enum';
import {SharingService} from './sharing.service';
import {VersionInfo} from '../../../shared/models/version-info';

@Injectable({
  providedIn: 'root'
})
export class SharingCharacteristicService {

  constructor(
    private sharingService: SharingService
  ) { }

  private getEntity(characteristic: Characteristic): Entity {
    return new Entity(
      EntityType.CHARACTERISTIC,
      characteristic.id,
      characteristic.name,
      characteristic
    );
  }

  addToMyStuff(characteristic: Characteristic, versionInfo: VersionInfo, confirm: () => void): void {
    this.sharingService.addToMyStuff(this.getEntity(characteristic), versionInfo, confirm);
  }

  continueAddToMyStuff(characteristic: Characteristic): Promise<boolean> {
    return this.sharingService.confirmAdd(this.getEntity(characteristic));
  }
}
