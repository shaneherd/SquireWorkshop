import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AcDisplayComponent} from './ac-display.component';

xdescribe('AcDisplayComponent', () => {
  let component: AcDisplayComponent;
  let fixture: ComponentFixture<AcDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
