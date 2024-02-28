import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatureWealthComponent } from './creature-wealth.component';

xdescribe('CharacterWealthComponent', () => {
  let component: CreatureWealthComponent;
  let fixture: ComponentFixture<CreatureWealthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatureWealthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatureWealthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
