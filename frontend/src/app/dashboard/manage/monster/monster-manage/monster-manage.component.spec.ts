import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MonsterManageComponent} from './monster-manage.component';

xdescribe('MonsterManageComponent', () => {
  let component: MonsterManageComponent;
  let fixture: ComponentFixture<MonsterManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonsterManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonsterManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
