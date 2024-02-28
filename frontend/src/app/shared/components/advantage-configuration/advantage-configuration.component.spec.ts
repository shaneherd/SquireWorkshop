import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvantageConfigurationComponent } from './advantage-configuration.component';

xdescribe('AdvantageConfigurationComponent', () => {
  let component: AdvantageConfigurationComponent;
  let fixture: ComponentFixture<AdvantageConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvantageConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvantageConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
