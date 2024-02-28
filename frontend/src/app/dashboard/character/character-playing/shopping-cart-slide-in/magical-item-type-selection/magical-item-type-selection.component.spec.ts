import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MagicalItemTypeSelectionComponent } from './magical-item-type-selection.component';

xdescribe('MagicalItemTypeSelectionComponent', () => {
  let component: MagicalItemTypeSelectionComponent;
  let fixture: ComponentFixture<MagicalItemTypeSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MagicalItemTypeSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MagicalItemTypeSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
