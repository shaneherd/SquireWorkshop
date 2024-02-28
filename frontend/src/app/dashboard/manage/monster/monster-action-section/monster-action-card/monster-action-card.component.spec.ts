import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MonsterActionCardComponent} from './monster-action-card.component';

xdescribe('MonsterActionCardComponent', () => {
  let component: MonsterActionCardComponent;
  let fixture: ComponentFixture<MonsterActionCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonsterActionCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonsterActionCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
