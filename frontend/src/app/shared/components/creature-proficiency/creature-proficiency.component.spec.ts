import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CreatureProficiencyComponent} from './creature-proficiency.component';

xdescribe('CreatureProficiencyComponent', () => {
  let component: CreatureProficiencyComponent;
  let fixture: ComponentFixture<CreatureProficiencyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatureProficiencyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatureProficiencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
