import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MagicalItemDetailsComponent} from './magical-item-details.component';

xdescribe('MagicalItemDetailsComponent', () => {
  let component: MagicalItemDetailsComponent;
  let fixture: ComponentFixture<MagicalItemDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MagicalItemDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MagicalItemDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
