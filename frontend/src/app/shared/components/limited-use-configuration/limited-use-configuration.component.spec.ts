import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LimitedUseConfigurationComponent } from './limited-use-configuration.component';

xdescribe('LimitedUseConfigurationComponent', () => {
  let component: LimitedUseConfigurationComponent;
  let fixture: ComponentFixture<LimitedUseConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LimitedUseConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LimitedUseConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
