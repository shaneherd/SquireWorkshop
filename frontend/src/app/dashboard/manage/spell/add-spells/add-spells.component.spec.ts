import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AddSpellsComponent} from './add-spells.component';

xdescribe('AddSpellsComponent', () => {
  let component: AddSpellsComponent;
  let fixture: ComponentFixture<AddSpellsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSpellsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSpellsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
