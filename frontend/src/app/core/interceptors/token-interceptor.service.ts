import {Injectable} from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import {Observable} from 'rxjs/index';
import {LOCAL_STORAGE} from '../../constants';

@Injectable()
export class TokenInterceptorService implements HttpInterceptor {
  constructor() {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const addToken = request.url.indexOf('authentication') < 0 || request.url.indexOf('authentication/refresh') > -1;
    if (addToken) {
      const authToken = localStorage.getItem(LOCAL_STORAGE.TOKEN);
      request = request.clone({
        headers: request.headers.set('Authorization', `Bearer ${authToken}`),
      });
    }
    return next.handle(request);
  }
}
