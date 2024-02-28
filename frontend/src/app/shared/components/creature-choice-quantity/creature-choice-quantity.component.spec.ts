import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatureChoiceQuantityComponent } from './creature-choice-quantity.component';

xdescribe('CreatureChoiceQuantityComponent', () => {
  let component: CreatureChoiceQuantityComponent;
  let fixture: ComponentFixture<CreatureChoiceQuantityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatureChoiceQuantityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatureChoiceQuantityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
