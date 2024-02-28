import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleLimitedUseRowComponent } from './single-limited-use-row.component';

xdescribe('SingleLimitedUseRowComponent', () => {
  let component: SingleLimitedUseRowComponent;
  let fixture: ComponentFixture<SingleLimitedUseRowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleLimitedUseRowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleLimitedUseRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
