import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SpellConfigurationComponent} from './spell-configuration.component';

xdescribe('SpellConfigurationComponent', () => {
  let component: SpellConfigurationComponent;
  let fixture: ComponentFixture<SpellConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpellConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpellConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
