import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MonsterActionSectionComponent} from './monster-action-section.component';

xdescribe('MonsterActionSectionComponent', () => {
  let component: MonsterActionSectionComponent;
  let fixture: ComponentFixture<MonsterActionSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonsterActionSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonsterActionSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
