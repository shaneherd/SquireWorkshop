import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpellSelectionItemsComponent } from './spell-selection-items.component';

xdescribe('SpellSelectionItemsComponent', () => {
  let component: SpellSelectionItemsComponent;
  let fixture: ComponentFixture<SpellSelectionItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpellSelectionItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpellSelectionItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
