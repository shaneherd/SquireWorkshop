import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CardBadgeComponent} from './card-badge.component';

xdescribe('CardBadgeComponent', () => {
  let component: CardBadgeComponent;
  let fixture: ComponentFixture<CardBadgeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardBadgeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
