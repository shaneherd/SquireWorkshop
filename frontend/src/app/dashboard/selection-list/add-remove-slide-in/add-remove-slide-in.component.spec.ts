import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRemoveSlideInComponent } from './add-remove-slide-in.component';

xdescribe('AddRemoveSlideInComponent', () => {
  let component: AddRemoveSlideInComponent;
  let fixture: ComponentFixture<AddRemoveSlideInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRemoveSlideInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRemoveSlideInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
