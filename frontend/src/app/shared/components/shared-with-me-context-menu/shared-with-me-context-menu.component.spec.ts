import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedWithMeContextMenuComponent } from './shared-with-me-context-menu.component';

xdescribe('SharedWithMeContextMenuComponent', () => {
  let component: SharedWithMeContextMenuComponent;
  let fixture: ComponentFixture<SharedWithMeContextMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedWithMeContextMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedWithMeContextMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
