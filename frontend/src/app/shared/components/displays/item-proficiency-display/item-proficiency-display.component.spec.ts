import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ItemProficiencyDisplayComponent} from './item-proficiency-display.component';

xdescribe('ItemProficiencyDisplayComponent', () => {
  let component: ItemProficiencyDisplayComponent;
  let fixture: ComponentFixture<ItemProficiencyDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemProficiencyDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemProficiencyDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
