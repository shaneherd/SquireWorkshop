import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BattleMonsterFeatureCardComponent } from './battle-monster-feature-card.component';

xdescribe('BattleMonsterFeatureCardComponent', () => {
  let component: BattleMonsterFeatureCardComponent;
  let fixture: ComponentFixture<BattleMonsterFeatureCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BattleMonsterFeatureCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BattleMonsterFeatureCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
