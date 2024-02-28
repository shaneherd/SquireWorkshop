import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AcDetailsComponent} from './ac-details.component';

xdescribe('AcDetailsComponent', () => {
  let component: AcDetailsComponent;
  let fixture: ComponentFixture<AcDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
