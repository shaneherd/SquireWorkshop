import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BattleMonsterBasicComponent } from './battle-monster-basic.component';

xdescribe('BattleMonsterBasicComponent', () => {
  let component: BattleMonsterBasicComponent;
  let fixture: ComponentFixture<BattleMonsterBasicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BattleMonsterBasicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BattleMonsterBasicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
