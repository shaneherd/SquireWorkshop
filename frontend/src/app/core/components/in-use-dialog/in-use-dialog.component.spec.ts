import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InUseDialogComponent } from './in-use-dialog.component';

xdescribe('InUseDialogComponent', () => {
  let component: InUseDialogComponent;
  let fixture: ComponentFixture<InUseDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InUseDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InUseDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
