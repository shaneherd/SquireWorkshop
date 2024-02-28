import {Injectable} from '@angular/core';
import {CanDeactivate} from '@angular/router';
import {Observable} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class PendingChangesGuard implements CanDeactivate<ComponentCanDeactivate> {
  constructor(private translate: TranslateService) {}

  canDeactivate(component: ComponentCanDeactivate): boolean | Observable<boolean> {
    return component.canDeactivate() ? true : confirm(this.translate.instant('UnsavedChangesWarning'));
  }
}

export interface ComponentCanDeactivate {
  canDeactivate: () => boolean | Observable<boolean>;
}
