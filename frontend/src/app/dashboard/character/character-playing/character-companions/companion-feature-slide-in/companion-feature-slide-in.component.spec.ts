import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanionFeatureSlideInComponent } from './companion-feature-slide-in.component';

xdescribe('CompanionFeatureSlideInComponent', () => {
  let component: CompanionFeatureSlideInComponent;
  let fixture: ComponentFixture<CompanionFeatureSlideInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanionFeatureSlideInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanionFeatureSlideInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
