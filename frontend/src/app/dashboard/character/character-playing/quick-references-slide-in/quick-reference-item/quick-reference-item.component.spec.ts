import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickReferenceItemComponent } from './quick-reference-item.component';

xdescribe('QuickReferenceItemComponent', () => {
  let component: QuickReferenceItemComponent;
  let fixture: ComponentFixture<QuickReferenceItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuickReferenceItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickReferenceItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
