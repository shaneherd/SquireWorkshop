import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CharacterValidationSettingsComponent} from './character-validation-settings.component';

xdescribe('CharacterValidationSettingsComponent', () => {
  let component: CharacterValidationSettingsComponent;
  let fixture: ComponentFixture<CharacterValidationSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CharacterValidationSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CharacterValidationSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
