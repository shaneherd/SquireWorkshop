import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompareImportComponent } from './compare-import.component';

xdescribe('CompareImportComponent', () => {
  let component: CompareImportComponent;
  let fixture: ComponentFixture<CompareImportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompareImportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompareImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
