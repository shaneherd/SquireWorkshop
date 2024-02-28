import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EncounterSummaryComponent } from './encounter-summary.component';

xdescribe('EncounterSummaryComponent', () => {
  let component: EncounterSummaryComponent;
  let fixture: ComponentFixture<EncounterSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EncounterSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EncounterSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
