import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintCharacterListSpellComponent } from './print-character-list-spell.component';

xdescribe('PrintCharacterListSpellComponent', () => {
  let component: PrintCharacterListSpellComponent;
  let fixture: ComponentFixture<PrintCharacterListSpellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintCharacterListSpellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintCharacterListSpellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
