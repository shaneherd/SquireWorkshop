import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CreatureListItemComponent} from './creature-list-item.component';

xdescribe('CreatureListItemComponent', () => {
  let component: CreatureListItemComponent;
  let fixture: ComponentFixture<CreatureListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatureListItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatureListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
