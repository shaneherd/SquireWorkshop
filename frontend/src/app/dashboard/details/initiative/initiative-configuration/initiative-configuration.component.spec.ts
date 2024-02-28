import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InitiativeConfigurationComponent } from './initiative-configuration.component';

xdescribe('InitiativeConfigurationComponent', () => {
  let component: InitiativeConfigurationComponent;
  let fixture: ComponentFixture<InitiativeConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InitiativeConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InitiativeConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
