import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DescriptionConfigurationComponent } from './description-configuration.component';

xdescribe('DescriptionConfigurationComponent', () => {
  let component: DescriptionConfigurationComponent;
  let fixture: ComponentFixture<DescriptionConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DescriptionConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DescriptionConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
