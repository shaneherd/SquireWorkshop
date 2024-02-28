import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MonsterSearchComponent} from './monster-search.component';

describe('MonsterSearchComponent', () => {
  let component: MonsterSearchComponent;
  let fixture: ComponentFixture<MonsterSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonsterSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonsterSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
