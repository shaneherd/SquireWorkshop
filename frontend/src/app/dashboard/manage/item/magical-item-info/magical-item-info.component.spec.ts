import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MagicalItemInfoComponent} from './magical-item-info.component';

xdescribe('MagicalItemInfoComponent', () => {
  let component: MagicalItemInfoComponent;
  let fixture: ComponentFixture<MagicalItemInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MagicalItemInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MagicalItemInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
