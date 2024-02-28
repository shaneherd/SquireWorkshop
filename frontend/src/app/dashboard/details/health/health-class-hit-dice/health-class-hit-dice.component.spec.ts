import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthClassHitDiceComponent } from './health-class-hit-dice.component';

xdescribe('HealthClassHitDiceComponent', () => {
  let component: HealthClassHitDiceComponent;
  let fixture: ComponentFixture<HealthClassHitDiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HealthClassHitDiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthClassHitDiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
