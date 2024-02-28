import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BattleMonsterActionsComponent } from './battle-monster-actions.component';

xdescribe('BattleMonsterActionsComponent', () => {
  let component: BattleMonsterActionsComponent;
  let fixture: ComponentFixture<BattleMonsterActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BattleMonsterActionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BattleMonsterActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
