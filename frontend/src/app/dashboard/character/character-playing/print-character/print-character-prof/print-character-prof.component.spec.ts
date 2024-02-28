import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintCharacterProfComponent } from './print-character-prof.component';

xdescribe('PrintCharacterProfComponent', () => {
  let component: PrintCharacterProfComponent;
  let fixture: ComponentFixture<PrintCharacterProfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintCharacterProfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintCharacterProfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
