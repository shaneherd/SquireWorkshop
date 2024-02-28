import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MagicalItemTableConfigurationComponent} from './magical-item-table-configuration.component';

xdescribe('MagicalItemTableConfigurationComponent', () => {
  let component: MagicalItemTableConfigurationComponent;
  let fixture: ComponentFixture<MagicalItemTableConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MagicalItemTableConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MagicalItemTableConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
