import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AddRemoveArmorTypeComponent} from './add-remove-armor-type.component';

xdescribe('AddRemoveArmorTypeComponent', () => {
  let component: AddRemoveArmorTypeComponent;
  let fixture: ComponentFixture<AddRemoveArmorTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRemoveArmorTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRemoveArmorTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
