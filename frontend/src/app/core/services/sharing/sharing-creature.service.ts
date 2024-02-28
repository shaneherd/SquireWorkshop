import {Injectable} from '@angular/core';
import {Entity} from '../../../shared/models/entity';
import {Creature} from '../../../shared/models/creatures/creature';
import {EntityType} from '../../../shared/models/entity-type.enum';
import {SharingService} from './sharing.service';
import {VersionInfo} from '../../../shared/models/version-info';

@Injectable({
  providedIn: 'root'
})
export class SharingCreatureService {

  constructor(
    private sharingService: SharingService
  ) { }

  private getEntity(creature: Creature): Entity {
    return new Entity(
      EntityType.CREATURE,
      creature.id,
      creature.name,
      creature
    );
  }

  addToMyStuff(creature: Creature, versionInfo: VersionInfo, confirm: () => void): void {
    this.sharingService.addToMyStuff(this.getEntity(creature), versionInfo, confirm);
  }

  continueAddToMyStuff(creature: Creature): Promise<boolean> {
    return this.sharingService.confirmAdd(this.getEntity(creature));
  }
}
