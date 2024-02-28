import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatureSpellLimitedUseSlideInComponent } from './creature-spell-limited-use-slide-in.component';

xdescribe('CreatureSpellLimitedUseSlideInComponent', () => {
  let component: CreatureSpellLimitedUseSlideInComponent;
  let fixture: ComponentFixture<CreatureSpellLimitedUseSlideInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatureSpellLimitedUseSlideInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatureSpellLimitedUseSlideInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
