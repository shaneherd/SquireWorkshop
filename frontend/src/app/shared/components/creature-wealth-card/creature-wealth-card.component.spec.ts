import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CreatureWealthCardComponent} from './creature-wealth-card.component';

xdescribe('CreatureWealthCardComponent', () => {
  let component: CreatureWealthCardComponent;
  let fixture: ComponentFixture<CreatureWealthCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatureWealthCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatureWealthCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
