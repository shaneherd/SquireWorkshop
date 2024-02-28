import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthConfigurationDetailsComponent } from './health-configuration-details.component';

xdescribe('HealthConfigurationDetailsComponent', () => {
  let component: HealthConfigurationDetailsComponent;
  let fixture: ComponentFixture<HealthConfigurationDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HealthConfigurationDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthConfigurationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
