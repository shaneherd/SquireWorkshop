import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ToolCheckComponent} from './tool-check.component';

xdescribe('ToolCheckComponent', () => {
  let component: ToolCheckComponent;
  let fixture: ComponentFixture<ToolCheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToolCheckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
