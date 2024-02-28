import {Notification} from '../../../shared/models/notification';

export class NotificationDialogData {
  notifications: Notification[] = [];
  confirm: () => void;
}
