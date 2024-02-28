import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidateCharacterConfigurationComponent } from './validate-character-configuration.component';

xdescribe('ValidateCharacterConfigurationComponent', () => {
  let component: ValidateCharacterConfigurationComponent;
  let fixture: ComponentFixture<ValidateCharacterConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidateCharacterConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidateCharacterConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
