import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanionActionCardComponent } from './companion-action-card.component';

xdescribe('CompanionActionCardComponent', () => {
  let component: CompanionActionCardComponent;
  let fixture: ComponentFixture<CompanionActionCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanionActionCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanionActionCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
