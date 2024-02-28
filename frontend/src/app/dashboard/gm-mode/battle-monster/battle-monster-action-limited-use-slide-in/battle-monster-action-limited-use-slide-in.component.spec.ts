import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BattleMonsterActionLimitedUseSlideInComponent } from './battle-monster-action-limited-use-slide-in.component';

xdescribe('BattleMonsterActionLimitedUseSlideInComponent', () => {
  let component: BattleMonsterActionLimitedUseSlideInComponent;
  let fixture: ComponentFixture<BattleMonsterActionLimitedUseSlideInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BattleMonsterActionLimitedUseSlideInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BattleMonsterActionLimitedUseSlideInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
