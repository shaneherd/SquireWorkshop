import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeaturesSelectionListComponent } from './features-selection-list.component';

xdescribe('FeaturesSelectionListComponent', () => {
  let component: FeaturesSelectionListComponent;
  let fixture: ComponentFixture<FeaturesSelectionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeaturesSelectionListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeaturesSelectionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
