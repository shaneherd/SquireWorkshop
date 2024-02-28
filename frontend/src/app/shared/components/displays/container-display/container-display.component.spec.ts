import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ContainerDisplayComponent} from './container-display.component';

xdescribe('ContainerDisplayComponent', () => {
  let component: ContainerDisplayComponent;
  let fixture: ComponentFixture<ContainerDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContainerDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
