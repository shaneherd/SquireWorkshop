import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CriticalDisplayComponent} from './critical-display.component';

xdescribe('CriticalDisplayComponent', () => {
  let component: CriticalDisplayComponent;
  let fixture: ComponentFixture<CriticalDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CriticalDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CriticalDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
