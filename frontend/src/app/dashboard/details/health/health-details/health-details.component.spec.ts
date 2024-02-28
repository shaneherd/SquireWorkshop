import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthDetailsComponent } from './health-details.component';

xdescribe('HealthDetailsComponent', () => {
  let component: HealthDetailsComponent;
  let fixture: ComponentFixture<HealthDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HealthDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
