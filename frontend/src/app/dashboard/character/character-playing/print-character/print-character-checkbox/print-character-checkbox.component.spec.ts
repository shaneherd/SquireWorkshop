import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintCharacterCheckboxComponent } from './print-character-checkbox.component';

xdescribe('PrintCharacterCheckboxComponent', () => {
  let component: PrintCharacterCheckboxComponent;
  let fixture: ComponentFixture<PrintCharacterCheckboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintCharacterCheckboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintCharacterCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
