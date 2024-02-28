import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanionActionSlideInComponent } from './companion-action-slide-in.component';

xdescribe('CompanionActionSlideInComponent', () => {
  let component: CompanionActionSlideInComponent;
  let fixture: ComponentFixture<CompanionActionSlideInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanionActionSlideInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanionActionSlideInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
