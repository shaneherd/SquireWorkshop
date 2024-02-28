import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpellSelectionListComponent } from './spell-selection-list.component';

xdescribe('SpellSelectionListComponent', () => {
  let component: SpellSelectionListComponent;
  let fixture: ComponentFixture<SpellSelectionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpellSelectionListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpellSelectionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
