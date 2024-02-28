import {TestBed, inject} from '@angular/core/testing';
import {TokenInterceptorService} from './token-interceptor.service';
import {HTTP_INTERCEPTORS, HttpClient} from '@angular/common/http';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';

describe('TokenInterceptorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: TokenInterceptorService,
          multi: true,
        },
      ]
    });
  });

  it('should add an Authorization header', inject([HttpClient, HttpTestingController], (http: HttpClient, mock: HttpTestingController) => {
    const url = '/test/url';
    http.get(url).subscribe((response: string) => expect(response).toBeTruthy());
    mock.expectOne(req => (req.headers.has('Authorization')));
    mock.verify();
  }));

  it('should not add an Authorization header', inject([HttpClient, HttpTestingController],
    (http: HttpClient, mock: HttpTestingController) => {
    const url = '/authentication/other';
    http.get(url).subscribe((response: string) => {
      expect(response).toBeTruthy()
    });
    mock.expectOne(req => (!req.headers.has('Authorization')));
    mock.verify();
  }));

  it('should add an Authorization header for refresh', inject([HttpClient, HttpTestingController],
    (http: HttpClient, mock: HttpTestingController) => {
    const url = '/authentication/refresh';
    http.get(url).subscribe((response: string) => expect(response).toBeTruthy());
    mock.expectOne(req => (req.headers.has('Authorization')));
    mock.verify();
  }));
});
