import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {RaceListComponent} from './race-list.component';

xdescribe('RaceListComponent', () => {
  let component: RaceListComponent;
  let fixture: ComponentFixture<RaceListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RaceListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RaceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
