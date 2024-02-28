import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DescriptionDisplayComponent} from './description-display.component';

xdescribe('DescriptionDisplayComponent', () => {
  let component: DescriptionDisplayComponent;
  let fixture: ComponentFixture<DescriptionDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DescriptionDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DescriptionDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
