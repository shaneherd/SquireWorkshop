import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BattleMonsterCharacteristicsComponent } from './battle-monster-characteristics.component';

xdescribe('BattleMonsterCharacteristicsComponent', () => {
  let component: BattleMonsterCharacteristicsComponent;
  let fixture: ComponentFixture<BattleMonsterCharacteristicsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BattleMonsterCharacteristicsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BattleMonsterCharacteristicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
