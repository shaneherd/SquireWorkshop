import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PackDetailsComponent} from './pack-details.component';

xdescribe('PackDetailsComponent', () => {
  let component: PackDetailsComponent;
  let fixture: ComponentFixture<PackDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
