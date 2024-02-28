import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IsExpendableConfigurationComponent } from './is-expendable-configuration.component';

xdescribe('IsExpendableConfigurationComponent', () => {
  let component: IsExpendableConfigurationComponent;
  let fixture: ComponentFixture<IsExpendableConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IsExpendableConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IsExpendableConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
