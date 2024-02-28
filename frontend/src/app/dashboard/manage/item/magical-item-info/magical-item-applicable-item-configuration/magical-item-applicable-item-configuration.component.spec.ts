import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MagicalItemApplicableItemConfigurationComponent} from './magical-item-applicable-item-configuration.component';

xdescribe('MagicalItemApplicableItemConfigurationComponent', () => {
  let component: MagicalItemApplicableItemConfigurationComponent;
  let fixture: ComponentFixture<MagicalItemApplicableItemConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MagicalItemApplicableItemConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MagicalItemApplicableItemConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
