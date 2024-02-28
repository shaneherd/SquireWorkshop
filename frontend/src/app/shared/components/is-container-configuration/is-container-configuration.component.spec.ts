import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IsContainerConfigurationComponent } from './is-container-configuration.component';

xdescribe('IsContainerConfigurationComponent', () => {
  let component: IsContainerConfigurationComponent;
  let fixture: ComponentFixture<IsContainerConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IsContainerConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IsContainerConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
