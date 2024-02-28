import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ProficiencyDisplayComponent} from './proficiency-display.component';

xdescribe('ProficiencyDisplayComponent', () => {
  let component: ProficiencyDisplayComponent;
  let fixture: ComponentFixture<ProficiencyDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProficiencyDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProficiencyDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
