import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ToolInfoComponent} from './tool-info.component';

xdescribe('ToolInfoComponent', () => {
  let component: ToolInfoComponent;
  let fixture: ComponentFixture<ToolInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToolInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
