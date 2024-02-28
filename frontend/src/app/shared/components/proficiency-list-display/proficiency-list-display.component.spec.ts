import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProficiencyListDisplayComponent } from './proficiency-list-display.component';

xdescribe('ProficiencyListDisplayComponent', () => {
  let component: ProficiencyListDisplayComponent;
  let fixture: ComponentFixture<ProficiencyListDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProficiencyListDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProficiencyListDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
