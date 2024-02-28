import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PowerDamageDisplayComponent } from './power-damage-display.component';

xdescribe('PowerDamageDisplayComponent', () => {
  let component: PowerDamageDisplayComponent;
  let fixture: ComponentFixture<PowerDamageDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PowerDamageDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PowerDamageDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
