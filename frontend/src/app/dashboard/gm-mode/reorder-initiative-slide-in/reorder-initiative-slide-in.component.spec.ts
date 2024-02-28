import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReorderInitiativeSlideInComponent } from './reorder-initiative-slide-in.component';

xdescribe('ReorderInitiativeSlideInComponent', () => {
  let component: ReorderInitiativeSlideInComponent;
  let fixture: ComponentFixture<ReorderInitiativeSlideInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReorderInitiativeSlideInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReorderInitiativeSlideInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
