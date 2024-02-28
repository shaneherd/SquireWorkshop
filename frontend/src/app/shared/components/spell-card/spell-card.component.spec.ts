import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SpellCardComponent} from './spell-card.component';

xdescribe('SpellCardComponent', () => {
  let component: SpellCardComponent;
  let fixture: ComponentFixture<SpellCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpellCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpellCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
