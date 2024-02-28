import {UserSettingsModel} from './user-settings.model';
import {UserRole} from './user-role.enum';
import {UserSubscription} from './user-subscription';

export class UserModel {
  id: number;
  beta: boolean;
  username: string;
  password: string;
  email: string;
  lastLogin: number;
  numFailedLogins: number;
  userSettings: UserSettingsModel;
  token: string;
  userRole: UserRole = UserRole.BASIC;
  userSubscription: UserSubscription;
}
