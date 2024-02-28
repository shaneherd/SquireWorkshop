import {Entity} from '../../../../shared/models/entity';
import {VersionInfo} from '../../../../shared/models/version-info';

export class AddToMyStuffConfirmationDialogData {
  parentVersion = 0;
  versionInfo: VersionInfo;
  entity: Entity;
  dependencies: Entity[] = [];
  confirm: () => void;
}
