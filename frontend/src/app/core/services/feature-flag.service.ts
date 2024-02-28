import { Injectable } from '@angular/core';
import {FeatureFlag} from '../../shared/models/feature-flag';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs';
import {UserModel} from '../../shared/models/user.model';
import {UserService} from './user.service';

@Injectable({
  providedIn: 'root'
})
export class FeatureFlagService {
  featureFlags: FeatureFlag[] = [];
  flags: BehaviorSubject<FeatureFlag[]> = new BehaviorSubject<FeatureFlag[]>(this.featureFlags);

  constructor(
    private userService: UserService,
    private http: HttpClient
  ) {
    this.getFeatureFlags();
  }

  getFeatureFlags(): Promise<FeatureFlag[]> {
    return this.http.get<FeatureFlag[]>(`${environment.backendUrl}/user/featureFlags`).toPromise().then((featureFlags: FeatureFlag[]) => {
      this.featureFlags = featureFlags;
      this.flags.next(this.featureFlags);
      return featureFlags;
    });
  }

  async isFeatureEnabledForCurrentUser(featureFlagId: number): Promise<boolean> {
    const user: UserModel = this.userService.getUser();
    return user != null && user.beta || await this.isFeatureEnabled(featureFlagId);
  }

  private async isFeatureEnabled(featureFlagId: number): Promise<boolean> {
    if (this.featureFlags == null || this.featureFlags.length === 0) {
      await this.getFeatureFlags();
    }
    if (this.featureFlags != null) {
      for (let i = 0; i < this.featureFlags.length; i++) {
        const flag = this.featureFlags[i];
        if (flag.id === featureFlagId) {
          return flag.enabled;
        }
      }
    }
    return false;
  }
}
