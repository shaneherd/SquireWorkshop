import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BattleMonsterLegendaryPointsSlideInComponent } from './battle-monster-legendary-points-slide-in.component';

xdescribe('BattleMonsterLegendaryPointsSlideInComponent', () => {
  let component: BattleMonsterLegendaryPointsSlideInComponent;
  let fixture: ComponentFixture<BattleMonsterLegendaryPointsSlideInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BattleMonsterLegendaryPointsSlideInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BattleMonsterLegendaryPointsSlideInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
