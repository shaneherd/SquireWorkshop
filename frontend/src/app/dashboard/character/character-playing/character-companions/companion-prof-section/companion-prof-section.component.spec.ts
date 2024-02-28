import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanionProfSectionComponent } from './companion-prof-section.component';

xdescribe('CompanionProfSectionComponent', () => {
  let component: CompanionProfSectionComponent;
  let fixture: ComponentFixture<CompanionProfSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanionProfSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanionProfSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
