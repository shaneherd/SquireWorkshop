import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatureSenseConfigurationsComponent } from './creature-sense-configurations.component';

xdescribe('CreatureSenseConfigurationsComponent', () => {
  let component: CreatureSenseConfigurationsComponent;
  let fixture: ComponentFixture<CreatureSenseConfigurationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatureSenseConfigurationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatureSenseConfigurationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
