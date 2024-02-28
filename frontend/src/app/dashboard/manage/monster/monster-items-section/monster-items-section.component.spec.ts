import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MonsterItemsSectionComponent} from './monster-items-section.component';

xdescribe('MonsterItemsSectionComponent', () => {
  let component: MonsterItemsSectionComponent;
  let fixture: ComponentFixture<MonsterItemsSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonsterItemsSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonsterItemsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
