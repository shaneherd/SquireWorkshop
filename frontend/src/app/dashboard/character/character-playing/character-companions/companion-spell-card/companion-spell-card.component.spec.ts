import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanionSpellCardComponent } from './companion-spell-card.component';

xdescribe('CompanionSpellCardComponent', () => {
  let component: CompanionSpellCardComponent;
  let fixture: ComponentFixture<CompanionSpellCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanionSpellCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanionSpellCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
