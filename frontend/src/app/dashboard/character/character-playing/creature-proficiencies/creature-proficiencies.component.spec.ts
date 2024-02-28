import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatureProficienciesComponent } from './creature-proficiencies.component';

xdescribe('CharacterProficienciesComponent', () => {
  let component: CreatureProficienciesComponent;
  let fixture: ComponentFixture<CreatureProficienciesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatureProficienciesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatureProficienciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
