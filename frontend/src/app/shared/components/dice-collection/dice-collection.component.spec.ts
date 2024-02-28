import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DiceCollectionComponent} from './dice-collection.component';

xdescribe('DiceCollectionComponent', () => {
  let component: DiceCollectionComponent;
  let fixture: ComponentFixture<DiceCollectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiceCollectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiceCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
