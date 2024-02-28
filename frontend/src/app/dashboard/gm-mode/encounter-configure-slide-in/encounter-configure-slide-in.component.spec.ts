import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EncounterConfigureSlideInComponent } from './encounter-configure-slide-in.component';

xdescribe('EncounterConfigureSlideInComponent', () => {
  let component: EncounterConfigureSlideInComponent;
  let fixture: ComponentFixture<EncounterConfigureSlideInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EncounterConfigureSlideInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EncounterConfigureSlideInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
