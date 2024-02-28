import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HitDiceUseDisplayComponent } from './hit-dice-use-display.component';

xdescribe('HitDiceUseDisplayComponent', () => {
  let component: HitDiceUseDisplayComponent;
  let fixture: ComponentFixture<HitDiceUseDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HitDiceUseDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HitDiceUseDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
