import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CreatureWealthItemComponent} from './creature-wealth-item.component';

xdescribe('CharacterWealthItemComponent', () => {
  let component: CreatureWealthItemComponent;
  let fixture: ComponentFixture<CreatureWealthItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatureWealthItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatureWealthItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
