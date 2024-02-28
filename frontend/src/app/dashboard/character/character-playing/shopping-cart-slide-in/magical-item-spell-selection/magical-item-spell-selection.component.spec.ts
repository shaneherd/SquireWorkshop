import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MagicalItemSpellSelectionComponent } from './magical-item-spell-selection.component';

xdescribe('MagicalItemSpellSelectionComponent', () => {
  let component: MagicalItemSpellSelectionComponent;
  let fixture: ComponentFixture<MagicalItemSpellSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MagicalItemSpellSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MagicalItemSpellSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
