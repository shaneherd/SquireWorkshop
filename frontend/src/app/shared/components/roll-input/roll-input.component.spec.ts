import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {RollInputComponent} from './roll-input.component';

xdescribe('RollInputComponent', () => {
  let component: RollInputComponent;
  let fixture: ComponentFixture<RollInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RollInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RollInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
