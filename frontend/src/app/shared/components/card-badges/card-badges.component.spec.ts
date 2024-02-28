import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CardBadgesComponent} from './card-badges.component';

xdescribe('CardBadgesComponent', () => {
  let component: CardBadgesComponent;
  let fixture: ComponentFixture<CardBadgesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardBadgesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardBadgesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
