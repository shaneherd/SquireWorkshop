import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ExpendableDisplayComponent} from './expendable-display.component';

xdescribe('ExpendableDisplayComponent', () => {
  let component: ExpendableDisplayComponent;
  let fixture: ComponentFixture<ExpendableDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpendableDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpendableDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
