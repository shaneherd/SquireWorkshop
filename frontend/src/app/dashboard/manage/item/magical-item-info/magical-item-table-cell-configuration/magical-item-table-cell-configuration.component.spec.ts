import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MagicalItemTableCellConfigurationComponent} from './magical-item-table-cell-configuration.component';

xdescribe('MagicalItemTableCellConfigurationComponent', () => {
  let component: MagicalItemTableCellConfigurationComponent;
  let fixture: ComponentFixture<MagicalItemTableCellConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MagicalItemTableCellConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MagicalItemTableCellConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
