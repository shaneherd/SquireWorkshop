import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DamageModifierDetailsComponent } from './damage-modifier-details.component';

xdescribe('DamageModifierDetailsComponent', () => {
  let component: DamageModifierDetailsComponent;
  let fixture: ComponentFixture<DamageModifierDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DamageModifierDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DamageModifierDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
