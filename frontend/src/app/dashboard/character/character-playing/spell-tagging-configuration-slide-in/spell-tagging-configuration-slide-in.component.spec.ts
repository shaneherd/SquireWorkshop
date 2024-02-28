import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpellTaggingConfigurationSlideInComponent } from './spell-tagging-configuration-slide-in.component';

xdescribe('SpellTaggingConfigurationSlideInComponent', () => {
  let component: SpellTaggingConfigurationSlideInComponent;
  let fixture: ComponentFixture<SpellTaggingConfigurationSlideInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpellTaggingConfigurationSlideInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpellTaggingConfigurationSlideInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
