import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterCompanionListSectionComponent } from './character-companion-list-section.component';

xdescribe('CharacterCompanionListSectionComponent', () => {
  let component: CharacterCompanionListSectionComponent;
  let fixture: ComponentFixture<CharacterCompanionListSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CharacterCompanionListSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CharacterCompanionListSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
