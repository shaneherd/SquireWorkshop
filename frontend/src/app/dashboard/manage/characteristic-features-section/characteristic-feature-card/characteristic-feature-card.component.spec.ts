import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CharacteristicFeatureCardComponent} from './characteristic-feature-card.component';

xdescribe('CharacteristicFeatureCardComponent', () => {
  let component: CharacteristicFeatureCardComponent;
  let fixture: ComponentFixture<CharacteristicFeatureCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CharacteristicFeatureCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CharacteristicFeatureCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
