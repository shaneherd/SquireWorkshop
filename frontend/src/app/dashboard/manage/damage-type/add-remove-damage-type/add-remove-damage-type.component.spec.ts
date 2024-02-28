import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AddRemoveDamageTypeComponent} from './add-remove-damage-type.component';

xdescribe('AddRemoveDamageTypeComponent', () => {
  let component: AddRemoveDamageTypeComponent;
  let fixture: ComponentFixture<AddRemoveDamageTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRemoveDamageTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRemoveDamageTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
