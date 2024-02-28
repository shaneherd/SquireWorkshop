import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MonsterFeatureSectionComponent} from './monster-feature-section.component';

xdescribe('MonsterFeatureSectionComponent', () => {
  let component: MonsterFeatureSectionComponent;
  let fixture: ComponentFixture<MonsterFeatureSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonsterFeatureSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonsterFeatureSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
