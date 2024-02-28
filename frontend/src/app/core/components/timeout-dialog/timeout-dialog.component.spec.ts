import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeoutDialogComponent } from './timeout-dialog.component';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {CoreModule} from '../../core.module';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpLoaderFactory} from '../../../app.module';
import {HttpClient} from '@angular/common/http';

describe('TimeoutDialogComponent', () => {
  let component: TimeoutDialogComponent;
  let fixture: ComponentFixture<TimeoutDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {close: () => {}} }
      ],
      imports: [
        CoreModule,
        RouterTestingModule,
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

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeoutDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should stop the timer', () => {
    component.data = {
      userIdle: {
        stopTimer: () => {}
      }
    };
    const spy = spyOn(component.data.userIdle, 'stopTimer').and.stub();
    component.closeDialog();
    expect(spy).toHaveBeenCalled();
  });
});
