import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PublicContextMenuComponent} from './public-context-menu.component';

xdescribe('PublicContextMenuComponent', () => {
  let component: PublicContextMenuComponent;
  let fixture: ComponentFixture<PublicContextMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicContextMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicContextMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
