import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MonsterHpCalculationComponent} from './monster-hp-calculation.component';

xdescribe('MonsterHpCalculationComponent', () => {
  let component: MonsterHpCalculationComponent;
  let fixture: ComponentFixture<MonsterHpCalculationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonsterHpCalculationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonsterHpCalculationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
