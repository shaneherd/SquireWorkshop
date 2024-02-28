import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TypeDisplayComponent} from './type-display.component';

xdescribe('CategoryDisplayComponent', () => {
  let component: TypeDisplayComponent;
  let fixture: ComponentFixture<TypeDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TypeDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
