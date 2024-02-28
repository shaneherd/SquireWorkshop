import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MagicalItemAttunementAlignmentConfigurationComponent} from './magical-item-attunement-alignment-configuration.component';

xdescribe('MagicalItemAttunementAlignmentConfigurationComponent', () => {
  let component: MagicalItemAttunementAlignmentConfigurationComponent;
  let fixture: ComponentFixture<MagicalItemAttunementAlignmentConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MagicalItemAttunementAlignmentConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MagicalItemAttunementAlignmentConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
