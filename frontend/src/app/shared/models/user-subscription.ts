import {UserSubscriptionType} from './user-subscription-type.enum';

export class UserSubscription {
  type: UserSubscriptionType = UserSubscriptionType.FREE;
  expiration: number;
  paddleSubscriptionId: number;
  paddleSubscriptionPlanId: number;
  paddleSubscriptionStatus: string; //active, trialing, past_due, paused, deleted
  paddleUpdateUrl: string;
  paddleCancelUrl: string;
  nextBillDate: string;
}
