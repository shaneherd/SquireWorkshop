import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthClassLevelComponent } from './health-class-level.component';

xdescribe('HealthClassLevelComponent', () => {
  let component: HealthClassLevelComponent;
  let fixture: ComponentFixture<HealthClassLevelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HealthClassLevelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthClassLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
