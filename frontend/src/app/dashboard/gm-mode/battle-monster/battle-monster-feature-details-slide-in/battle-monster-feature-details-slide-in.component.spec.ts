import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BattleMonsterFeatureDetailsSlideInComponent } from './battle-monster-feature-details-slide-in.component';

xdescribe('BattleMonsterFeatureDetailsSlideInComponent', () => {
  let component: BattleMonsterFeatureDetailsSlideInComponent;
  let fixture: ComponentFixture<BattleMonsterFeatureDetailsSlideInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BattleMonsterFeatureDetailsSlideInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BattleMonsterFeatureDetailsSlideInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
