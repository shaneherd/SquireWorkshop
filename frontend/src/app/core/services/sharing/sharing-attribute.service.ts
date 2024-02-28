import {Injectable} from '@angular/core';
import {Entity} from '../../../shared/models/entity';
import {Attribute} from '../../../shared/models/attributes/attribute';
import {EntityType} from '../../../shared/models/entity-type.enum';
import {SharingService} from './sharing.service';
import {VersionInfo} from '../../../shared/models/version-info';

@Injectable({
  providedIn: 'root'
})
export class SharingAttributeService {
  constructor(
    private sharingService: SharingService
  ) {
  }

  private getEntity(attribute: Attribute): Entity {
    return new Entity(
      EntityType.ATTRIBUTE,
      attribute.id,
      attribute.name,
      attribute
    );
  }

  addToMyStuff(attribute: Attribute, versionInfo: VersionInfo, confirm: () => void): void {
    this.sharingService.addToMyStuff(this.getEntity(attribute), versionInfo, confirm);
  }

  continueAddToMyStuff(attribute: Attribute): Promise<boolean> {
    return this.sharingService.confirmAdd(this.getEntity(attribute));
  }
}
