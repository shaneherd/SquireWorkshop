import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MagicItemTableComponent} from './magic-item-table.component';

xdescribe('MagicItemTableComponent', () => {
  let component: MagicItemTableComponent;
  let fixture: ComponentFixture<MagicItemTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MagicItemTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MagicItemTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
