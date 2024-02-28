import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddToMyStuffConfirmationDialogComponent } from './add-to-my-stuff-confirmation-dialog.component';

xdescribe('AddToMyStuffConfirmationDialogComponent', () => {
  let component: AddToMyStuffConfirmationDialogComponent;
  let fixture: ComponentFixture<AddToMyStuffConfirmationDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddToMyStuffConfirmationDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddToMyStuffConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
