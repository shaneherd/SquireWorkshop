import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintCharacterSpellsSectionComponent } from './print-character-spells-section.component';

xdescribe('PrintCharacterSpellsSectionComponent', () => {
  let component: PrintCharacterSpellsSectionComponent;
  let fixture: ComponentFixture<PrintCharacterSpellsSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintCharacterSpellsSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintCharacterSpellsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
