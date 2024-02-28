import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DeityInfoComponent} from './deity-info.component';

xdescribe('DeityInfoComponent', () => {
  let component: DeityInfoComponent;
  let fixture: ComponentFixture<DeityInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeityInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeityInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
