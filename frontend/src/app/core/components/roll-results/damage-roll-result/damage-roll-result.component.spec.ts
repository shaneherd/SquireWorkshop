import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DamageRollResultComponent } from './damage-roll-result.component';

xdescribe('DamageRollResultComponent', () => {
  let component: DamageRollResultComponent;
  let fixture: ComponentFixture<DamageRollResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DamageRollResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DamageRollResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
