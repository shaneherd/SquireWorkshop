import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConcentrationCheckSlideInComponent } from './concentration-check-slide-in.component';

xdescribe('ConcentrationCheckSlideInComponent', () => {
  let component: ConcentrationCheckSlideInComponent;
  let fixture: ComponentFixture<ConcentrationCheckSlideInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConcentrationCheckSlideInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConcentrationCheckSlideInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
