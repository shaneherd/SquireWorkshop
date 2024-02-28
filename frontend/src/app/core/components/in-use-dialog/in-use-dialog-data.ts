import {InUse} from '../../../shared/models/inUse/in-use';

export class InUseDialogData {
  name: string;
  type: string;
  inUse: InUse[] = [];
  confirm: () => void;
}
