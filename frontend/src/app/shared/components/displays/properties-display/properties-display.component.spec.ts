import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PropertiesDisplayComponent} from './properties-display.component';

xdescribe('PropertiesDisplayComponent', () => {
  let component: PropertiesDisplayComponent;
  let fixture: ComponentFixture<PropertiesDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertiesDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertiesDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
