import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BattleMonsterFeatureLimitedUseSlideInComponent } from './battle-monster-feature-limited-use-slide-in.component';

xdescribe('BattleMonsterFeatureLimitedUseSlideInComponent', () => {
  let component: BattleMonsterFeatureLimitedUseSlideInComponent;
  let fixture: ComponentFixture<BattleMonsterFeatureLimitedUseSlideInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BattleMonsterFeatureLimitedUseSlideInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BattleMonsterFeatureLimitedUseSlideInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
