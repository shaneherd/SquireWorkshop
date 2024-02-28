import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemFilterDialogComponent } from './item-filter-dialog.component';

xdescribe('ItemFilterDialogComponent', () => {
  let component: ItemFilterDialogComponent;
  let fixture: ComponentFixture<ItemFilterDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemFilterDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemFilterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
