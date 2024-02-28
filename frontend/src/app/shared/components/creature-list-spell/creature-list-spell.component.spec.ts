import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CreatureListSpellComponent} from './creature-list-spell.component';

xdescribe('CreatureListSpellComponent', () => {
  let component: CreatureListSpellComponent;
  let fixture: ComponentFixture<CreatureListSpellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatureListSpellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatureListSpellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
