import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatureSelectionItemsComponent } from './feature-selection-items.component';

xdescribe('FeatureSelectionItemsComponent', () => {
  let component: FeatureSelectionItemsComponent;
  let fixture: ComponentFixture<FeatureSelectionItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeatureSelectionItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeatureSelectionItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
