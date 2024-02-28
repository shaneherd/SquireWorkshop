import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CreatureChoiceListComponent} from './creature-choice-list.component';

xdescribe('CreatureChoiceListComponent', () => {
  let component: CreatureChoiceListComponent;
  let fixture: ComponentFixture<CreatureChoiceListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatureChoiceListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatureChoiceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
