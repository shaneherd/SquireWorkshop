import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SingleInnateSpellConfigurationComponent} from './single-innate-spell-configuration.component';

xdescribe('SingleInnateSpellConfigurationComponent', () => {
  let component: SingleInnateSpellConfigurationComponent;
  let fixture: ComponentFixture<SingleInnateSpellConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleInnateSpellConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleInnateSpellConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
