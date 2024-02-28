import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyStuffContextMenuComponent } from './my-stuff-context-menu.component';

xdescribe('MyStuffContextMenuComponent', () => {
  let component: MyStuffContextMenuComponent;
  let fixture: ComponentFixture<MyStuffContextMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyStuffContextMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyStuffContextMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
