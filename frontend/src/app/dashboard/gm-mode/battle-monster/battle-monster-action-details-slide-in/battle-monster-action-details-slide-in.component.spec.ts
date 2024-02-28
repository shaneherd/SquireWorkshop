import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BattleMonsterActionDetailsSlideInComponent } from './battle-monster-action-details-slide-in.component';

xdescribe('BattleMonsterActionDetailsSlideInComponent', () => {
  let component: BattleMonsterActionDetailsSlideInComponent;
  let fixture: ComponentFixture<BattleMonsterActionDetailsSlideInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BattleMonsterActionDetailsSlideInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BattleMonsterActionDetailsSlideInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
