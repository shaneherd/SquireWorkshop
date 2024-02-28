import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterSettingsComponent } from './character-settings.component';

xdescribe('CharacterSettingsComponent', () => {
  let component: CharacterSettingsComponent;
  let fixture: ComponentFixture<CharacterSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CharacterSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CharacterSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
