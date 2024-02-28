import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SpellcastingSettingsComponent} from './spellcasting-settings.component';

xdescribe('SpellcastingSettingsComponent', () => {
  let component: SpellcastingSettingsComponent;
  let fixture: ComponentFixture<SpellcastingSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpellcastingSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpellcastingSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
