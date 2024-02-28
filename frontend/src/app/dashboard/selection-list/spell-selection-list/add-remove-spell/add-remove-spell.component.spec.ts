import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRemoveSpellComponent } from './add-remove-spell.component';

xdescribe('AddRemoveSpellComponent', () => {
  let component: AddRemoveSpellComponent;
  let fixture: ComponentFixture<AddRemoveSpellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRemoveSpellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRemoveSpellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
