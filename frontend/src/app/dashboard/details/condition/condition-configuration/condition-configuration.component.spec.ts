import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConditionConfigurationComponent } from './condition-configuration.component';

xdescribe('ConditionConfigurationComponent', () => {
  let component: ConditionConfigurationComponent;
  let fixture: ComponentFixture<ConditionConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConditionConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConditionConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
