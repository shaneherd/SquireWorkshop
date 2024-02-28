import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkImportComponent } from './link-import.component';

xdescribe('LinkImportComponent', () => {
  let component: LinkImportComponent;
  let fixture: ComponentFixture<LinkImportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkImportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
