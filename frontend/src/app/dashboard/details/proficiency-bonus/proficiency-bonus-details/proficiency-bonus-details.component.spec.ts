import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProficiencyBonusDetailsComponent } from './proficiency-bonus-details.component';

xdescribe('ProficiencyBonusDetailsComponent', () => {
  let component: ProficiencyBonusDetailsComponent;
  let fixture: ComponentFixture<ProficiencyBonusDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProficiencyBonusDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProficiencyBonusDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
