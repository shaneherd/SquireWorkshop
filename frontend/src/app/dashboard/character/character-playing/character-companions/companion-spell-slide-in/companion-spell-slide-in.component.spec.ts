import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanionSpellSlideInComponent } from './companion-spell-slide-in.component';

xdescribe('CompanionSpellSlideInComponent', () => {
  let component: CompanionSpellSlideInComponent;
  let fixture: ComponentFixture<CompanionSpellSlideInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanionSpellSlideInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanionSpellSlideInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
