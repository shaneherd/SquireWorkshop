import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintCharacterComponent } from './print-character.component';

xdescribe('PrintCharacterComponent', () => {
  let component: PrintCharacterComponent;
  let fixture: ComponentFixture<PrintCharacterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintCharacterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintCharacterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
