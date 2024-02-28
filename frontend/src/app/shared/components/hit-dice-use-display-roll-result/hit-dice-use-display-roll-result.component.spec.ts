import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HitDiceUseDisplayRollResultComponent } from './hit-dice-use-display-roll-result.component';

xdescribe('HitDiceUseDisplayRollResultComponent', () => {
  let component: HitDiceUseDisplayRollResultComponent;
  let fixture: ComponentFixture<HitDiceUseDisplayRollResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HitDiceUseDisplayRollResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HitDiceUseDisplayRollResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
