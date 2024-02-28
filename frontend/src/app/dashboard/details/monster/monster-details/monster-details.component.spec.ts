import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonsterDetailsComponent } from './monster-details.component';

xdescribe('MonsterDetailsComponent', () => {
  let component: MonsterDetailsComponent;
  let fixture: ComponentFixture<MonsterDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonsterDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonsterDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
