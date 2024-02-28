import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MagicalItemAttunementClassConfigurationComponent} from './magical-item-attunement-class-configuration.component';

xdescribe('MagicalItemAttunementClassConfigurationComponent', () => {
  let component: MagicalItemAttunementClassConfigurationComponent;
  let fixture: ComponentFixture<MagicalItemAttunementClassConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MagicalItemAttunementClassConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MagicalItemAttunementClassConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
