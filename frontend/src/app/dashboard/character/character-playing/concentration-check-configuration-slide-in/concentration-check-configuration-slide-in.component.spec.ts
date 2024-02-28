import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConcentrationCheckConfigurationSlideInComponent } from './concentration-check-configuration-slide-in.component';

xdescribe('ConcentrationCheckConfigurationSlideInComponent', () => {
  let component: ConcentrationCheckConfigurationSlideInComponent;
  let fixture: ComponentFixture<ConcentrationCheckConfigurationSlideInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConcentrationCheckConfigurationSlideInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConcentrationCheckConfigurationSlideInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
