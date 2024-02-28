import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BattleMonsterActionCardComponent } from './battle-monster-action-card.component';

xdescribe('BattleMonsterActionCardComponent', () => {
  let component: BattleMonsterActionCardComponent;
  let fixture: ComponentFixture<BattleMonsterActionCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BattleMonsterActionCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BattleMonsterActionCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
