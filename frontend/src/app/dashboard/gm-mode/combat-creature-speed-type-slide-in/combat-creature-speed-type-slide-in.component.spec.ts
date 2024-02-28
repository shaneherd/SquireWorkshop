import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CombatCreatureSpeedTypeSlideInComponent } from './combat-creature-speed-type-slide-in.component';

xdescribe('CombatCreatureSpeedTypeSlideInComponent', () => {
  let component: CombatCreatureSpeedTypeSlideInComponent;
  let fixture: ComponentFixture<CombatCreatureSpeedTypeSlideInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CombatCreatureSpeedTypeSlideInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CombatCreatureSpeedTypeSlideInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
