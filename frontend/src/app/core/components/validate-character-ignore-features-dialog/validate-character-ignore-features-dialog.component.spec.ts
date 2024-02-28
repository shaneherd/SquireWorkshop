import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidateCharacterIgnoreFeaturesDialogComponent } from './validate-character-ignore-features-dialog.component';

xdescribe('ValidateCharacterIgnoreFeaturesDialogComponent', () => {
  let component: ValidateCharacterIgnoreFeaturesDialogComponent;
  let fixture: ComponentFixture<ValidateCharacterIgnoreFeaturesDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidateCharacterIgnoreFeaturesDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidateCharacterIgnoreFeaturesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
