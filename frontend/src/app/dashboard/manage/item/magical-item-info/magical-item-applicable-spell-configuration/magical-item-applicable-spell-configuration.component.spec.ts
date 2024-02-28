import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MagicalItemApplicableSpellConfigurationComponent} from './magical-item-applicable-spell-configuration.component';

xdescribe('MagicalItemApplicableSpellConfigurationComponent', () => {
  let component: MagicalItemApplicableSpellConfigurationComponent;
  let fixture: ComponentFixture<MagicalItemApplicableSpellConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MagicalItemApplicableSpellConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MagicalItemApplicableSpellConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
