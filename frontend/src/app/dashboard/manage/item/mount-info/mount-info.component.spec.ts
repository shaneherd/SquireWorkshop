import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MountInfoComponent} from './mount-info.component';

xdescribe('MountInfoComponent', () => {
  let component: MountInfoComponent;
  let fixture: ComponentFixture<MountInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MountInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MountInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
