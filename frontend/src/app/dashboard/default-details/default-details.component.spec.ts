import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultDetailsComponent } from './default-details.component';
import {DashboardModule} from '../dashboard.module';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';

xdescribe('DefaultDetailsComponent', () => {
  let component: DefaultDetailsComponent;
  let fixture: ComponentFixture<DefaultDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        DashboardModule,
        RouterTestingModule,
        HttpClientTestingModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefaultDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
