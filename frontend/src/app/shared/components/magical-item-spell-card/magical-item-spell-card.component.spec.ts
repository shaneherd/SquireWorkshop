import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MagicalItemSpellCardComponent } from './magical-item-spell-card.component';

xdescribe('MagicalItemSpellCardComponent', () => {
  let component: MagicalItemSpellCardComponent;
  let fixture: ComponentFixture<MagicalItemSpellCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MagicalItemSpellCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MagicalItemSpellCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
