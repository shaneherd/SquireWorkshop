import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BattleMonsterFeatureUseRegainComponent } from './battle-monster-feature-use-regain.component';

xdescribe('BattleMonsterFeatureUseRegainComponent', () => {
  let component: BattleMonsterFeatureUseRegainComponent;
  let fixture: ComponentFixture<BattleMonsterFeatureUseRegainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BattleMonsterFeatureUseRegainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BattleMonsterFeatureUseRegainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
