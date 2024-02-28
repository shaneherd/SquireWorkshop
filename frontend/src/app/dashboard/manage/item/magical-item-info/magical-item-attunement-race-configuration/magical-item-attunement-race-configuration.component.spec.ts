import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MagicalItemAttunementRaceConfigurationComponent} from './magical-item-attunement-race-configuration.component';

describe('MagicalItemAttunementRaceConfigurationComponent', () => {
  let component: MagicalItemAttunementRaceConfigurationComponent;
  let fixture: ComponentFixture<MagicalItemAttunementRaceConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MagicalItemAttunementRaceConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MagicalItemAttunementRaceConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
