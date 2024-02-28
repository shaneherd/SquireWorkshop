import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProficiencyConfigurationComponent } from './proficiency-configuration.component';

xdescribe('ProficiencyConfigurationComponent', () => {
  let component: ProficiencyConfigurationComponent;
  let fixture: ComponentFixture<ProficiencyConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProficiencyConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProficiencyConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
