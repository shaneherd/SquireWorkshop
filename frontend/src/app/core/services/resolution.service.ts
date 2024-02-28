import {Injectable, NgZone} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResolutionService {
  private currentWidth = 0;
  width: BehaviorSubject<number> = new BehaviorSubject<number>(window.innerWidth);

  static isDesktop(width: number): boolean {
    const MOBILE_WIDTH = 500;
    return width > MOBILE_WIDTH;
  }

  isDesktop(): boolean {
    return ResolutionService.isDesktop(this.currentWidth);
  }

  constructor(ngZone: NgZone) {
    window.onresize = () => {
      ngZone.run(() => {
        this.currentWidth = window.innerWidth;
        this.width.next(this.currentWidth);
      });
    };
  }

}
