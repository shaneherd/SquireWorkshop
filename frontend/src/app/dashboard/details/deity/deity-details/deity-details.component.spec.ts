import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DeityDetailsComponent} from './deity-details.component';

xdescribe('DeityDetailsComponent', () => {
  let component: DeityDetailsComponent;
  let fixture: ComponentFixture<DeityDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeityDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeityDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
