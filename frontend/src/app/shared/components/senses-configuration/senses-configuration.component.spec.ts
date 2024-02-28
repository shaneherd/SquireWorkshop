import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SensesConfigurationComponent } from './senses-configuration.component';

xdescribe('SensesConfigurationComponent', () => {
  let component: SensesConfigurationComponent;
  let fixture: ComponentFixture<SensesConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SensesConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SensesConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
