import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MonsterFeatureCardComponent} from './monster-feature-card.component';

xdescribe('MonsterFeatureCardComponent', () => {
  let component: MonsterFeatureCardComponent;
  let fixture: ComponentFixture<MonsterFeatureCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonsterFeatureCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonsterFeatureCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
