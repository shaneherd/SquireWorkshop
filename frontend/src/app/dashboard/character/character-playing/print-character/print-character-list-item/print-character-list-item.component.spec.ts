import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintCharacterListItemComponent } from './print-character-list-item.component';

xdescribe('PrintCharacterListItemComponent', () => {
  let component: PrintCharacterListItemComponent;
  let fixture: ComponentFixture<PrintCharacterListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintCharacterListItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintCharacterListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
