import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AddRemoveBackgroundComponent} from './add-remove-background.component';

xdescribe('AddRemoveBackgroundComponent', () => {
  let component: AddRemoveBackgroundComponent;
  let fixture: ComponentFixture<AddRemoveBackgroundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRemoveBackgroundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRemoveBackgroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
