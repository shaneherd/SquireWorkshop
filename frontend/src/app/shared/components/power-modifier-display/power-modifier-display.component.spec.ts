import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PowerModifierDisplayComponent } from './power-modifier-display.component';

xdescribe('PowerModifierDisplayComponent', () => {
  let component: PowerModifierDisplayComponent;
  let fixture: ComponentFixture<PowerModifierDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PowerModifierDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PowerModifierDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
