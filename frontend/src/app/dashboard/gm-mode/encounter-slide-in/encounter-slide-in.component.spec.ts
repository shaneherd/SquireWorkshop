import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EncounterSlideInComponent } from './encounter-slide-in.component';

xdescribe('EncounterSlideInComponent', () => {
  let component: EncounterSlideInComponent;
  let fixture: ComponentFixture<EncounterSlideInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EncounterSlideInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EncounterSlideInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
