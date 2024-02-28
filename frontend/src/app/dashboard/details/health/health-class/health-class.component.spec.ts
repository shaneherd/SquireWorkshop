import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthClassComponent } from './health-class.component';

xdescribe('HealthClassComponent', () => {
  let component: HealthClassComponent;
  let fixture: ComponentFixture<HealthClassComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HealthClassComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
