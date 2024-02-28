import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonsterDetailsSlideInComponent } from './monster-details-slide-in.component';

xdescribe('MonsterDetailsSlideInComponent', () => {
  let component: MonsterDetailsSlideInComponent;
  let fixture: ComponentFixture<MonsterDetailsSlideInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonsterDetailsSlideInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonsterDetailsSlideInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
