import {Injectable} from '@angular/core';
import {SharingService} from './sharing.service';
import {Entity} from '../../../shared/models/entity';
import {EntityType} from '../../../shared/models/entity-type.enum';
import {VersionInfo} from '../../../shared/models/version-info';
import {Monster} from '../../../shared/models/creatures/monsters/monster';

@Injectable({
  providedIn: 'root'
})
export class SharingMonsterService {

  constructor(
    private sharingService: SharingService
  ) { }

  private getEntity(monster: Monster): Entity {
    return new Entity(
      EntityType.MONSTER,
      monster.id,
      monster.name,
      monster
    );
  }

  addToMyStuff(monster: Monster, versionInfo: VersionInfo, confirm: () => void): void {
    this.sharingService.addToMyStuff(this.getEntity(monster), versionInfo, confirm);
  }

  continueAddToMyStuff(monster: Monster): Promise<boolean> {
    return this.sharingService.confirmAdd(this.getEntity(monster));
  }
}
