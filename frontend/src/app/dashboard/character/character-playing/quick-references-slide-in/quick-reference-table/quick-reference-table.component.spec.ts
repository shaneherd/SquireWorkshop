import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickReferenceTableComponent } from './quick-reference-table.component';

xdescribe('QuickReferenceTableComponent', () => {
  let component: QuickReferenceTableComponent;
  let fixture: ComponentFixture<QuickReferenceTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuickReferenceTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickReferenceTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
