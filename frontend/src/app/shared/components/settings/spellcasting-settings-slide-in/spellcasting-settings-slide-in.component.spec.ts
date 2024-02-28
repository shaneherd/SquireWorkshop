import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SpellcastingSettingsSlideInComponent} from './spellcasting-settings-slide-in.component';

xdescribe('SpellcastingSettingsSlideInComponent', () => {
  let component: SpellcastingSettingsSlideInComponent;
  let fixture: ComponentFixture<SpellcastingSettingsSlideInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpellcastingSettingsSlideInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpellcastingSettingsSlideInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
