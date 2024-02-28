import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RollResultDialogComponent } from './roll-result-dialog.component';

xdescribe('RollResultDialogComponent', () => {
  let component: RollResultDialogComponent;
  let fixture: ComponentFixture<RollResultDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RollResultDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RollResultDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
