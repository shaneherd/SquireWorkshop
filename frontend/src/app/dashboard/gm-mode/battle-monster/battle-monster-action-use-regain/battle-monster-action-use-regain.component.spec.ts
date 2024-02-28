import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BattleMonsterActionUseRegainComponent } from './battle-monster-action-use-regain.component';

xdescribe('BattleMonsterActionUseRegainComponent', () => {
  let component: BattleMonsterActionUseRegainComponent;
  let fixture: ComponentFixture<BattleMonsterActionUseRegainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BattleMonsterActionUseRegainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BattleMonsterActionUseRegainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
