import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BattleMonsterFeaturesComponent } from './battle-monster-features.component';

xdescribe('BattleMonsterFeaturesComponent', () => {
  let component: BattleMonsterFeaturesComponent;
  let fixture: ComponentFixture<BattleMonsterFeaturesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BattleMonsterFeaturesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BattleMonsterFeaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
