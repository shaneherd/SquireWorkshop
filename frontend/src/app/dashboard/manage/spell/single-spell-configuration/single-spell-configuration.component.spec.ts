import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SingleSpellConfigurationComponent} from './single-spell-configuration.component';

xdescribe('SingleSpellConfigurationComponent', () => {
  let component: SingleSpellConfigurationComponent;
  let fixture: ComponentFixture<SingleSpellConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleSpellConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleSpellConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
