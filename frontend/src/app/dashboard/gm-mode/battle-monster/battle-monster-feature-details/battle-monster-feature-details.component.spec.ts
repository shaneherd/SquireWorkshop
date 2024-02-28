import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BattleMonsterFeatureDetailsComponent } from './battle-monster-feature-details.component';

xdescribe('BattleMonsterFeatureDetailsComponent', () => {
  let component: BattleMonsterFeatureDetailsComponent;
  let fixture: ComponentFixture<BattleMonsterFeatureDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BattleMonsterFeatureDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BattleMonsterFeatureDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
