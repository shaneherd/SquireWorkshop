import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatureConditionsComponent } from './creature-conditions.component';

xdescribe('CharacterConditionsComponent', () => {
  let component: CreatureConditionsComponent;
  let fixture: ComponentFixture<CreatureConditionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatureConditionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatureConditionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
