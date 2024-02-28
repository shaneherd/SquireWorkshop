import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {RaceManageComponent} from './race-manage.component';

xdescribe('RaceManageComponent', () => {
  let component: RaceManageComponent;
  let fixture: ComponentFixture<RaceManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RaceManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RaceManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
