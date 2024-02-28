import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BattleMonsterActionDetailsComponent } from './battle-monster-action-details.component';

xdescribe('BattleMonsterActionDetailsComponent', () => {
  let component: BattleMonsterActionDetailsComponent;
  let fixture: ComponentFixture<BattleMonsterActionDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BattleMonsterActionDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BattleMonsterActionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
