import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MagicalItemSpellsComponent} from './magical-item-spells.component';

xdescribe('MagicalItemSpellsComponent', () => {
  let component: MagicalItemSpellsComponent;
  let fixture: ComponentFixture<MagicalItemSpellsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MagicalItemSpellsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MagicalItemSpellsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
