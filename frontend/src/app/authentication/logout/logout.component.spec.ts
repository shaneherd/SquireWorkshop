import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogoutComponent } from './logout.component';
import {AuthenticationModule} from '../authentication.module';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpLoaderFactory} from '../../app.module';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {IdleService} from '../../core/services/idle.service';
import {EventsService} from '../../core/services/events.service';

describe('LogoutComponent', () => {
  let component: LogoutComponent;
  let fixture: ComponentFixture<LogoutComponent>;

  let router: Router;
  let idleService: IdleService;
  let eventsService: EventsService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AuthenticationModule,
        RouterTestingModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        })
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogoutComponent);
    router = TestBed.get(Router);
    idleService = TestBed.get(IdleService);
    eventsService = TestBed.get(EventsService);

    spyOn(idleService, 'stopWatching').and.stub();
    spyOn(router, 'navigate').and.callFake(() => {});
    spyOn(eventsService, 'dispatchEvent').and.stub();

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reset the local storage', () => {
    localStorage.setItem('token', 'token');
    localStorage.setItem('user', 'user');

    component.logout();

    expect(localStorage.getItem('token')).toBe('');
    expect(localStorage.getItem('user')).toBe('');
  })
});
