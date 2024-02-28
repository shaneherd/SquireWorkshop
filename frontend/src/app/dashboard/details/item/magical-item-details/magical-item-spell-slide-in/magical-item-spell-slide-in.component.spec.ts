import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MagicalItemSpellSlideInComponent} from './magical-item-spell-slide-in.component';

xdescribe('MagicalItemSpellSlideInComponent', () => {
  let component: MagicalItemSpellSlideInComponent;
  let fixture: ComponentFixture<MagicalItemSpellSlideInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MagicalItemSpellSlideInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MagicalItemSpellSlideInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
