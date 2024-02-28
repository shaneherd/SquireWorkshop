import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {EquippableDisplayComponent} from './equippable-display.component';

xdescribe('EquippableDisplayComponent', () => {
  let component: EquippableDisplayComponent;
  let fixture: ComponentFixture<EquippableDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquippableDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquippableDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
