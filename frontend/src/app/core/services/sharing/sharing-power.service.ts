import {Injectable} from '@angular/core';
import {Power} from '../../../shared/models/powers/power';
import {Entity} from '../../../shared/models/entity';
import {SharingService} from './sharing.service';
import {EntityType} from '../../../shared/models/entity-type.enum';
import {VersionInfo} from '../../../shared/models/version-info';

@Injectable({
  providedIn: 'root'
})
export class SharingPowerService {

  constructor(
    private sharingService: SharingService
  ) { }

  private getEntity(power: Power): Entity {
    return new Entity(
      EntityType.POWER,
      power.id,
      power.name,
      power
    );
  }

  addToMyStuff(power: Power, versionInfo: VersionInfo, confirm: () => void): void {
    this.sharingService.addToMyStuff(this.getEntity(power), versionInfo, confirm);
  }

  continueAddToMyStuff(power: Power): Promise<boolean> {
    return this.sharingService.confirmAdd(this.getEntity(power));
  }
}
