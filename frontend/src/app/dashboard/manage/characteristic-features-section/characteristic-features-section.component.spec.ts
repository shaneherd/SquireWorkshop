import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CharacteristicFeaturesSectionComponent} from './characteristic-features-section.component';

xdescribe('CharacteristicFeaturesSectionComponent', () => {
  let component: CharacteristicFeaturesSectionComponent;
  let fixture: ComponentFixture<CharacteristicFeaturesSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CharacteristicFeaturesSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CharacteristicFeaturesSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
