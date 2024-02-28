import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatSelectionComponent } from './feat-selection.component';

xdescribe('FeatSelectionComponent', () => {
  let component: FeatSelectionComponent;
  let fixture: ComponentFixture<FeatSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeatSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeatSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
