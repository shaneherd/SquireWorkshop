import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DeityListComponent} from './deity-list.component';

xdescribe('DeityListComponent', () => {
  let component: DeityListComponent;
  let fixture: ComponentFixture<DeityListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeityListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeityListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
