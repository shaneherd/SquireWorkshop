import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpellTaggingConfigurationComponent } from './spell-tagging-configuration.component';

xdescribe('SpellTaggingConfigurationComponent', () => {
  let component: SpellTaggingConfigurationComponent;
  let fixture: ComponentFixture<SpellTaggingConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpellTaggingConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpellTaggingConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
