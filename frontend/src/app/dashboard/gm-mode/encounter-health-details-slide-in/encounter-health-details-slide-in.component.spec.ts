import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EncounterHealthDetailsSlideInComponent } from './encounter-health-details-slide-in.component';

xdescribe('EncounterHealthDetailsSlideInComponent', () => {
  let component: EncounterHealthDetailsSlideInComponent;
  let fixture: ComponentFixture<EncounterHealthDetailsSlideInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EncounterHealthDetailsSlideInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EncounterHealthDetailsSlideInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
