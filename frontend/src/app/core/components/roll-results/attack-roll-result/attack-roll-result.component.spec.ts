import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttackRollResultComponent } from './attack-roll-result.component';

xdescribe('AttackRollResultComponent', () => {
  let component: AttackRollResultComponent;
  let fixture: ComponentFixture<AttackRollResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttackRollResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttackRollResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
