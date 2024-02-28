import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMonstersComponent } from './add-monsters.component';

xdescribe('AddMonstersComponent', () => {
  let component: AddMonstersComponent;
  let fixture: ComponentFixture<AddMonstersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMonstersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMonstersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
