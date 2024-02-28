import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {HeaderComponent} from './header.component';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpLoaderFactory} from '../../app.module';
import {HttpClient} from '@angular/common/http';
import {HeaderModule} from './header.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {IdleService} from '../services/idle.service';
import {EventsService} from '../services/events.service';
import {EVENTS} from '../../constants';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let idleService: IdleService;
  let eventsService: EventsService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HeaderModule,
        RouterTestingModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
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

  it('should create', () => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should start watching', () => {
    localStorage.setItem('token', 'token');
    idleService = TestBed.get(IdleService);
    const spy = spyOn(idleService, 'startWatching').and.stub();
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
  });

  it('should stop watching', () => {
    localStorage.setItem('token', '');
    idleService = TestBed.get(IdleService);
    const spy = spyOn(idleService, 'stopWatching').and.stub();
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
  });

  it('should set loggedIn to true', () => {
    fixture = TestBed.createComponent(HeaderComponent);
    eventsService = TestBed.get(EventsService);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.loggedIn = false;
    eventsService.dispatchEvent(EVENTS.Login);
    expect(component.loggedIn).toBeTruthy();
  });

  it('should set loggedIn to false', () => {
    fixture = TestBed.createComponent(HeaderComponent);
    eventsService = TestBed.get(EventsService);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.loggedIn = true;
    eventsService.dispatchEvent(EVENTS.Logout);
    expect(component.loggedIn).toBeFalsy();
  });

  it('should set the menu state to out', () => {
    fixture = TestBed.createComponent(HeaderComponent);
    eventsService = TestBed.get(EventsService);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.menuState = 'in';
    eventsService.dispatchEvent(EVENTS.MenuItemClick);
    expect(component.menuState).toBe('out');
  });

  it('should toggle the menu', () => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.menuState = 'in';
    component.toggleMenu();
    expect(component.menuState).toBe('out');
  });

  it('should return true', () => {
    localStorage.setItem('token', 'token');
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    const loggedIn = component.isLoggedId();
    expect(loggedIn).toBeTruthy();
  });

  it('should return false', () => {
    localStorage.setItem('token', '');
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    const loggedIn = component.isLoggedId();
    expect(loggedIn).toBeFalsy();
  });

});
