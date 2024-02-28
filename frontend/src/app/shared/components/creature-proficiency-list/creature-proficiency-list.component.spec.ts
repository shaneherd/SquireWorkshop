import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatureProficiencyListComponent } from './creature-proficiency-list.component';

xdescribe('CreatureProficiencyListComponent', () => {
  let component: CreatureProficiencyListComponent;
  let fixture: ComponentFixture<CreatureProficiencyListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatureProficiencyListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatureProficiencyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
