import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanionFeatureCardComponent } from './companion-feature-card.component';

xdescribe('CompanionFeatureCardComponent', () => {
  let component: CompanionFeatureCardComponent;
  let fixture: ComponentFixture<CompanionFeatureCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanionFeatureCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanionFeatureCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
