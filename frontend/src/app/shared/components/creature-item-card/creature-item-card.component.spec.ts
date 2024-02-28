import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CreatureItemCardComponent} from './creature-item-card.component';

xdescribe('CreatureItemCardComponent', () => {
  let component: CreatureItemCardComponent;
  let fixture: ComponentFixture<CreatureItemCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatureItemCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatureItemCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
