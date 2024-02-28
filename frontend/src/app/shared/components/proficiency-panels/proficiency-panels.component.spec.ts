import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ProficiencyPanelsComponent} from './proficiency-panels.component';

xdescribe('ProficiencyPanelsComponent', () => {
  let component: ProficiencyPanelsComponent;
  let fixture: ComponentFixture<ProficiencyPanelsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProficiencyPanelsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProficiencyPanelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
