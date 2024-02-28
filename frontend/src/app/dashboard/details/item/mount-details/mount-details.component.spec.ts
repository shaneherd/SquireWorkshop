import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MountDetailsComponent} from './mount-details.component';

xdescribe('MountDetailsComponent', () => {
  let component: MountDetailsComponent;
  let fixture: ComponentFixture<MountDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MountDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MountDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
